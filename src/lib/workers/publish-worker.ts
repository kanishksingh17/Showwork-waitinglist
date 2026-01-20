import { prisma } from "@/lib/prisma";
import { getAdapter } from "@/lib/platform-adapters";

export interface PublishJob {
  scheduledPostId: string;
}

export class PublishWorker {
  async processJob(job: PublishJob): Promise<void> {
    const { scheduledPostId } = job;

    try {
      // Get the scheduled post
      const scheduledPost = await prisma.scheduledPost.findUnique({
        where: { id: scheduledPostId },
        include: {
          user: true,
          project: true,
        },
      });

      if (!scheduledPost) {
        throw new Error(`Scheduled post not found: ${scheduledPostId}`);
      }

      // Update status to processing
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: "processing" },
      });

      const results: Record<string, any> = {};
      const errors: Record<string, string> = {};

      // Process each platform
      for (const platform of scheduledPost.platforms) {
        try {
          // Get user's token for this platform (using userToken model)
          const userToken = await prisma.userToken.findFirst({
            where: {
              userId: scheduledPost.userId,
              platform: platform.toLowerCase(),
            },
          });

          if (!userToken) {
            throw new Error(`No token found for platform: ${platform}`);
          }

          // Check if token is expired
          if (userToken.expiresAt && userToken.expiresAt < new Date()) {
            throw new Error(`Token expired for platform: ${platform}`);
          }

          // Get platform adapter
          const adapter = getAdapter(platform);

          // Prepare payload - messageByPlatform is a JSON object
          const messageByPlatform = scheduledPost.messageByPlatform as Record<string, string>;
          const mediaUrls = scheduledPost.media as string[] || [];

          const payload = {
            message: messageByPlatform[platform] || scheduledPost.messageByPlatform,
            mediaUrls,
            metadata: {
              projectId: scheduledPost.projectId,
              projectName: scheduledPost.project.name,
              projectUrl: scheduledPost.project.liveUrl,
            },
          };

          // Publish to platform
          const result = await adapter.publish(
            userToken.accessToken,
            payload,
          );

          // Log the attempt
          await prisma.publishLog.create({
            data: {
              scheduledPostId,
              platform,
              attempt: 1,
              status: result.success ? "success" : "failed",
              platformResponse: result.platformResponse || result,
            },
          });

          if (result.success) {
            results[platform] = {
              postId: result.postId,
              url: result.url,
            };
          } else {
            errors[platform] = result.error || "Unknown error";
          }
        } catch (error) {
          console.error(`Error publishing to ${platform}:`, error);

          // Log the failed attempt
          await prisma.publishLog.create({
            data: {
              scheduledPostId,
              platform,
              attempt: 1,
              status: "failed",
              platformResponse: {
                error: error instanceof Error ? error.message : "Unknown error",
              },
            },
          });

          errors[platform] =
            error instanceof Error ? error.message : "Unknown error";
        }
      }

      // Update final status
      const hasErrors = Object.keys(errors).length > 0;
      const hasSuccess = Object.keys(results).length > 0;

      let finalStatus: "posted" | "failed" | "partial";
      if (hasSuccess && !hasErrors) {
        finalStatus = "posted";
      } else if (hasSuccess && hasErrors) {
        finalStatus = "partial"; // Partial success
      } else {
        finalStatus = "failed";
      }

      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: finalStatus,
          result: {
            results,
            errors,
            processedAt: new Date().toISOString(),
          },
        },
      });

      // Create PublishedPost entry for successful publishes (posted or partial)
      if (hasSuccess) {
        const platformResults: Record<string, any> = {};
        for (const [platform, result] of Object.entries(results)) {
          platformResults[platform] = {
            postId: result.postId,
            url: result.url,
            status: "success",
            publishedAt: new Date().toISOString(),
          };
        }

        await prisma.publishedPost.create({
          data: {
            userId: scheduledPost.userId,
            projectId: scheduledPost.projectId,
            scheduledPostId,
            platforms: Object.keys(results), // Only successful platforms
            message: scheduledPost.message,
            messageByPlatform: scheduledPost.messageByPlatform,
            mediaUrls: scheduledPost.media || [],
            platformResults,
            status: finalStatus === "posted" ? "posted" : "partial",
            publishedAt: new Date(),
          },
        });

        // Schedule metrics collection for successful posts
        await this.scheduleMetricsCollection(scheduledPostId, results);
      }
    } catch (error) {
      console.error("Publish worker error:", error);

      // Update status to failed
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: "FAILED",
          result: {
            error: error instanceof Error ? error.message : "Unknown error",
            processedAt: new Date().toISOString(),
          },
        },
      });
    }
  }

  private async scheduleMetricsCollection(
    scheduledPostId: string,
    results: Record<string, any>,
  ): Promise<void> {
    // Schedule metrics collection for each successful platform
    for (const [platform, result] of Object.entries(results)) {
      if (result.postId) {
        // TODO: Schedule metrics collection job
        // This would be a separate job that runs periodically
        // to collect metrics from platform APIs
        console.log(
          `Scheduled metrics collection for ${platform} post ${result.postId}`,
        );
      }
    }
  }
}

// Export singleton instance
export const publishWorker = new PublishWorker();






