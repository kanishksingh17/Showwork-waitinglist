import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import ScheduledPost from "../../models/ScheduledPost.js";
import PublishedPost from "../../models/PublishedPost.js";
import PublishLog from "../../models/PublishLog.js";
import { publishToPlatform } from "./workers_util/publishPlatform.js";

const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false });

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
console.log("✅ publish-worker connected to MongoDB");

const w = new Worker("publish-posts", async (job) => {
  const { scheduledPostId } = job.data;

  const post = await ScheduledPost.findById(scheduledPostId);
  if (!post) throw new Error("ScheduledPost not found");

  let partialFailures = false;
  const results = [];

  for (const platform of post.platforms) {
    try {
      const result = await publishToPlatform(platform, post.payload);
      results.push({ platform, status: "success", ...result });
      await PublishLog.create({ 
        jobId: job.id, 
        scheduledPostId: post._id, 
        platform, 
        status: "success", 
        response: result 
      });
    } catch (e) {
      partialFailures = true;
      results.push({ platform, status: "failed", error: e.message });
      await PublishLog.create({ 
        jobId: job.id, 
        scheduledPostId: post._id, 
        platform, 
        status: "failed", 
        error: e.message 
      });
    }
  }

  await ScheduledPost.findByIdAndUpdate(post._id, {
    status: partialFailures ? "partial" : "published",
    results
  });

  // Create PublishedPost entry for successful publishes (posted or partial)
  const successfulResults = results.filter(r => r.status === "success");
  if (successfulResults.length > 0) {
    const platformResults = successfulResults.map(r => ({
      platform: r.platform,
      postId: r.postId || r.id,
      url: r.url,
      status: "success",
      publishedAt: new Date(),
      ...(r.error ? { error: r.error } : {})
    }));

    await PublishedPost.create({
      userId: post.userId,
      projectId: post.projectId,
      scheduledPostId: post._id.toString(),
      platforms: successfulResults.map(r => r.platform),
      payload: post.payload,
      platformResults,
      status: partialFailures ? "partial" : "posted",
      publishedAt: new Date()
    });
  }

  return { published: results.length, partialFailures };
}, { connection });

new QueueEvents("publish-posts", { connection });
console.log("🚀 publish-worker running");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down publish worker...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});