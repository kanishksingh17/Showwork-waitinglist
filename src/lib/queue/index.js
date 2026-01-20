import { Queue } from "bullmq";
import { createClient } from "redis";
import IORedis from "ioredis";

// Create Redis client for session storage (using redis package for connect-redis compatibility)
export const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

// Export for session store - will be connected in server.js
export const redis = redisClient;

// Keep IORedis for BullMQ as it's more compatible with BullMQ
const ioredisConnection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const publishQueue = new Queue("publish-posts", {
  connection: ioredisConnection,
  defaultJobOptions: { 
    removeOnComplete: 20, 
    removeOnFail: 20, 
    attempts: 3, 
    backoff: { type: "exponential", delay: 2000 } 
  }
});

export const analyticsQueue = new Queue("collect-analytics", {
  connection: ioredisConnection,
  defaultJobOptions: { 
    removeOnComplete: 50, 
    removeOnFail: 20, 
    attempts: 2 
  }
});
