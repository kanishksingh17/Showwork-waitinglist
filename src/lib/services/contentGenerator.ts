/**
 * Content Generator Service
 * Generates platform-specific social media content from project data
 */

interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags?: string[];
}

interface GenerateContentOptions {
  project: Project;
  platforms: string[];
  customMessage?: string;
  useAI?: boolean;
  mediaUrls?: string[]; // User-selected media URLs to include in posts
}

export interface GeneratedContent {
  platform: string;
  message: string;
  hashtags: string[];
  mediaUrls: string[];
  metadata: {
    characterCount: number;
    isValid: boolean;
    warnings?: string[];
    title?: string; // For Reddit posts: separate title field
  };
}

interface PlatformRules {
  maxLength: number;
  minLength: number;
  tone: "professional" | "casual" | "concise" | "visual" | "conversational";
  supportsHashtags: boolean;
  maxHashtags: number;
  supportsMentions: boolean;
  supportsLinks: boolean;
  lineBreaks: boolean;
  emojiSupported: boolean;
}

const PLATFORM_RULES: Record<string, PlatformRules> = {
  linkedin: {
    maxLength: 1300,
    minLength: 50,
    tone: "professional",
    supportsHashtags: true,
    maxHashtags: 5,
    supportsMentions: true,
    supportsLinks: true,
    lineBreaks: true,
    emojiSupported: true,
  },
  twitter: {
    maxLength: 280,
    minLength: 10,
    tone: "concise",
    supportsHashtags: true,
    maxHashtags: 3,
    supportsMentions: true,
    supportsLinks: true,
    lineBreaks: false,
    emojiSupported: true,
  },
  instagram: {
    maxLength: 2200,
    minLength: 50,
    tone: "visual",
    supportsHashtags: true,
    maxHashtags: 30,
    supportsMentions: true,
    supportsLinks: false, // Links not clickable in captions
    lineBreaks: true,
    emojiSupported: true,
  },
  facebook: {
    maxLength: 5000,
    minLength: 10,
    tone: "casual",
    supportsHashtags: false,
    maxHashtags: 0,
    supportsMentions: true,
    supportsLinks: true,
    lineBreaks: true,
    emojiSupported: true,
  },
  reddit: {
    maxLength: 40000,
    minLength: 50,
    tone: "conversational",
    supportsHashtags: false,
    maxHashtags: 0,
    supportsMentions: false,
    supportsLinks: true,
    lineBreaks: true,
    emojiSupported: false,
  },
  github: {
    maxLength: 500,
    minLength: 10,
    tone: "professional",
    supportsHashtags: false,
    maxHashtags: 0,
    supportsMentions: true,
    supportsLinks: true,
    lineBreaks: true,
    emojiSupported: false,
  },
};

export class ContentGenerator {
  /**
   * Generate platform-specific content for multiple platforms
   */
  async generate(
    options: GenerateContentOptions
  ): Promise<GeneratedContent[]> {
    const { project, platforms, customMessage, useAI = false, mediaUrls } = options;

    // If AI is enabled, try to enhance with AI
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        return await this.generateWithAI(project, platforms, customMessage, mediaUrls);
      } catch (error) {
        console.warn("AI generation failed, falling back to templates:", error);
        // Fall through to template generation
      }
    }

    // Generate using templates
    return platforms.map((platform) =>
      this.generateForPlatform(project, platform, customMessage, mediaUrls)
    );
  }

  /**
   * Generate content for a single platform using templates
   */
  private generateForPlatform(
    project: Project,
    platform: string,
    customMessage?: string,
    mediaUrls?: string[]
  ): GeneratedContent {
    const rules = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;

    // Extract hashtags from technologies and tags
    const hashtags = this.extractHashtags(
      project.technologies || [],
      project.tags || [],
      rules.maxHashtags
    );

    // Build base message
    let message = customMessage || this.buildTemplateMessage(project, platform);

    // Add hashtags if supported
    if (rules.supportsHashtags && hashtags.length > 0) {
      message += `\n\n${hashtags.join(" ")}`;
    }

    // Add links if supported
    if (rules.supportsLinks) {
      message = this.addLinks(message, project, platform);
    }

    // Apply platform-specific formatting
    message = this.applyPlatformRules(message, platform);

    // Validate and trim
    const warnings: string[] = [];
    if (message.length > rules.maxLength) {
      message = message.slice(0, rules.maxLength - 3) + "...";
      warnings.push(`Content truncated to ${rules.maxLength} characters`);
    }
    if (message.length < rules.minLength) {
      warnings.push(`Content is below recommended minimum of ${rules.minLength} characters`);
    }

    // Use provided mediaUrls if available, otherwise fall back to project.imageUrl
    // All platforms support multiple images/media
    let finalMediaUrls: string[] = [];
    if (mediaUrls && mediaUrls.length > 0) {
      // Use all selected media URLs
      finalMediaUrls = [...mediaUrls];
      console.log(`📸 ContentGenerator - Platform ${platform}: Using ${finalMediaUrls.length} media URLs from selection:`, finalMediaUrls);
    } else if (project.imageUrl) {
      // Fallback to project image if no media selected
      finalMediaUrls = [project.imageUrl];
      console.log(`📸 ContentGenerator - Platform ${platform}: Using fallback project imageUrl`);
    } else {
      console.log(`📸 ContentGenerator - Platform ${platform}: No media URLs available`);
    }

    return {
      platform,
      message: message.trim(),
      hashtags: rules.supportsHashtags ? hashtags : [],
      mediaUrls: finalMediaUrls,
      metadata: {
        characterCount: message.length,
        isValid: message.length <= rules.maxLength && message.length >= rules.minLength,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };
  }

  /**
   * Build template message based on platform tone
   */
  private buildTemplateMessage(
    project: Project,
    platform: string
  ): string {
    const rules = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;
    const { tone } = rules;

    const title = project.name || "New Project";
    const description = project.description || "";
    const shortDesc = description.slice(0, 150);

    switch (tone) {
      case "professional": // LinkedIn, GitHub
        return `🚀 Excited to share my latest project: ${title}\n\n${shortDesc}\n\nBuilt with ${(project.technologies || []).slice(0, 3).join(", ")}.\n\nCheck it out!`;

      case "concise": // Twitter
        const twitterDesc = description.slice(0, 100);
        return `🚀 ${title}\n\n${twitterDesc}${project.technologies ? "\n\nTech: " + project.technologies.slice(0, 2).join(", ") : ""}`;

      case "visual": // Instagram
        return `✨ ${title}\n\n${description.slice(0, 200)}\n\n${(project.technologies || []).slice(0, 5).map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;

      case "casual": // Facebook
        return `Hey everyone! 👋\n\nI just finished working on ${title}!\n\n${description.slice(0, 250)}\n\nLet me know what you think!`;

      case "conversational": // Reddit
        return `I recently built ${title} and wanted to share it with the community.\n\n${description}\n\nTech stack: ${(project.technologies || []).join(", ")}\n\nWould love to hear your thoughts!`;

      default:
        return `${title}\n\n${shortDesc}`;
    }
  }

  /**
   * Extract hashtags from technologies and tags
   */
  private extractHashtags(
    technologies: string[],
    tags: string[],
    maxHashtags: number
  ): string[] {
    const allTags = [...technologies, ...tags];
    const hashtags = allTags
      .slice(0, maxHashtags)
      .map((tag) => `#${tag.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "")}`)
      .filter(Boolean);

    return hashtags;
  }

  /**
   * Add links to message if supported
   */
  private addLinks(
    message: string,
    project: Project,
    platform: string
  ): string {
    const links: string[] = [];

    if (project.liveUrl) {
      const utmLink = this.generateUTMLink(project.liveUrl, platform);
      links.push(`🔗 Live Demo: ${utmLink}`);
    }

    if (project.githubUrl && platform === "github") {
      links.push(`📦 Repository: ${project.githubUrl}`);
    } else if (project.githubUrl) {
      links.push(`💻 Code: ${project.githubUrl}`);
    }

    if (links.length > 0) {
      message += `\n\n${links.join("\n")}`;
    }

    return message;
  }

  /**
   * Generate UTM tracking link
   */
  private generateUTMLink(url: string, platform: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("utm_source", "showwork");
      urlObj.searchParams.set("utm_medium", platform);
      urlObj.searchParams.set("utm_campaign", "social_share");
      return urlObj.toString();
    } catch {
      // If URL parsing fails, return original
      return url;
    }
  }

  /**
   * Apply platform-specific formatting rules
   */
  private applyPlatformRules(message: string, platform: string): string {
    const rules = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;

    // Remove emojis if not supported
    if (!rules.emojiSupported) {
      message = message.replace(
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
        ""
      );
    }

    // Normalize line breaks
    if (!rules.lineBreaks) {
      message = message.replace(/\n+/g, " ");
    }

    // Trim multiple spaces
    message = message.replace(/\s+/g, " ").trim();

    return message;
  }

  /**
   * Generate content using AI (OpenAI) via server-side endpoint
   */
  private async generateWithAI(
    project: Project,
    platforms: string[],
    customMessage?: string,
    mediaUrls?: string[]
  ): Promise<GeneratedContent[]> {
    try {
      // Build platform-specific prompts
      const prompts = this.buildPlatformSpecificPrompts(project, platforms, customMessage);
      
      // Generate content for each platform
      const generatedContents: GeneratedContent[] = [];
      
      for (const platform of platforms) {
        const platformPrompt = prompts[platform];
        const rules = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;
        
        // Call server-side AI endpoint
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: platformPrompt,
              },
            ],
            model: "gpt-4o-mini",
            max_tokens: platform === "reddit" ? 1500 : platform === "linkedin" ? 1000 : 500,
            temperature: 0.7,
            systemMessage: this.getSystemMessage(platform),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to generate ${platform} content`);
        }

        const data = await response.json();
        let aiContent = data.content || "";

        // Use provided mediaUrls if available, otherwise fall back to project.imageUrl
        let finalMediaUrls: string[] = [];
        if (mediaUrls && mediaUrls.length > 0) {
          finalMediaUrls = [...mediaUrls];
        } else if (project.imageUrl) {
          finalMediaUrls = [project.imageUrl];
        }

        // For Reddit, we need to parse title and text separately
        if (platform === "reddit") {
          const redditContent = this.parseRedditContent(aiContent);
          generatedContents.push({
            platform,
            message: redditContent.text,
            hashtags: [],
            mediaUrls: finalMediaUrls,
            metadata: {
              characterCount: redditContent.text.length,
              isValid: redditContent.text.length <= rules.maxLength && redditContent.text.length >= rules.minLength,
              warnings: undefined,
              title: redditContent.title, // Reddit-specific: store title separately
            },
          });
        } else {
          // For other platforms, process normally
          const content = this.postProcessAIContent(aiContent, project, platform, finalMediaUrls);
          generatedContents.push(content);
        }
      }

      return generatedContents;
    } catch (error) {
      console.error("AI generation error:", error);
      // Fall back to template generation
      return platforms.map((platform) =>
        this.generateForPlatform(project, platform, customMessage, mediaUrls)
      );
    }
  }

  /**
   * Build platform-specific prompts for better AI generation
   */
  private buildPlatformSpecificPrompts(
    project: Project,
    platforms: string[],
    customMessage?: string
  ): Record<string, string> {
    const prompts: Record<string, string> = {};
    const projectInfo = `Project: ${project.name}
Description: ${project.description || "N/A"}
Technologies: ${(project.technologies || []).join(", ")}
Tags: ${(project.tags || []).join(", ")}
Live URL: ${project.liveUrl || "N/A"}
GitHub URL: ${project.githubUrl || "N/A"}`;

    for (const platform of platforms) {
      const rules = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;
      
      switch (platform) {
        case "reddit":
          prompts[platform] = `Create a Reddit post for r/programming or r/webdev about this project:

${projectInfo}

${customMessage ? `Incorporate this message: ${customMessage}\n\n` : ""}
Requirements:
- Create a compelling TITLE (max 300 characters) that clearly describes the project
- Create the POST TEXT (max 1000 words) in a conversational, technical tone
- Use markdown formatting (headers, code blocks, lists)
- No hashtags
- Include technical details, challenges faced, and what you learned
- Ask engaging questions to encourage discussion
- Mention tech stack naturally in the text

Format your response as:
TITLE: [title here]
TEXT: [post text here]`;
          break;

        case "linkedin":
          prompts[platform] = `Create a professional LinkedIn post showcasing this developer project:

${projectInfo}

${customMessage ? `Incorporate this message: ${customMessage}\n\n` : ""}
Requirements:
- Professional tone, highlight technical achievements
- Start with a hook (first line is most important)
- Max 1300 characters
- Include 3-5 relevant hashtags (e.g., #WebDevelopment #React #JavaScript)
- Use line breaks for readability
- Mention specific technologies used
- Include a call-to-action
- Format with emojis sparingly (🚀 💻 ⚡)`;
          break;

        case "twitter":
          prompts[platform] = `Create a Twitter/X post for this project:

${projectInfo}

${customMessage ? `Incorporate this message: ${customMessage}\n\n` : ""}
Requirements:
- Max 280 characters (be concise!)
- Engaging, punchy tone
- Include 1-3 relevant hashtags
- Use emojis strategically (🚀 💻 ⚡ 🎨)
- Make it shareable and engaging
- If possible, include a question or interesting fact
- NO line breaks (single paragraph)`;
          break;

        case "instagram":
          prompts[platform] = `Create an Instagram caption for this project:

${projectInfo}

${customMessage ? `Incorporate this message: ${customMessage}\n\n` : ""}
Requirements:
- Visual-first, engaging tone
- Max 2200 characters
- Use emojis liberally (✨ 🚀 💻 🎨 ⚡ 🔥)
- Include 10-20 relevant hashtags (mix of broad and niche)
- Tell a story, be personal
- Line breaks for visual spacing
- Call-to-action at the end`;
          break;

        case "facebook":
          prompts[platform] = `Create a Facebook post for this project:

${projectInfo}

${customMessage ? `Incorporate this message: ${customMessage}\n\n` : ""}
Requirements:
- Casual, friendly tone
- Max 5000 characters
- NO hashtags (Facebook doesn't use them well)
- Personal storytelling approach
- Line breaks for readability
- Emojis are fine
- Ask for engagement/feedback`;
          break;

        case "github":
          prompts[platform] = `Create a GitHub repository description/README introduction for this project:

${projectInfo}

${customMessage ? `Incorporate this: ${customMessage}\n\n` : ""}
Requirements:
- Professional, technical tone
- Max 500 characters
- No hashtags
- Markdown formatting allowed
- Clear, concise technical description`;
          break;

        default:
          prompts[platform] = `Create a social media post for ${platform} about this project:

${projectInfo}

${customMessage ? `Incorporate: ${customMessage}\n\n` : ""}
Max ${rules.maxLength} characters, ${rules.tone} tone.`;
      }
    }

    return prompts;
  }

  /**
   * Get system message for platform-specific generation
   */
  private getSystemMessage(platform: string): string {
    const messages: Record<string, string> = {
      reddit: "You are an expert Reddit poster who creates engaging, technical posts that spark discussions. You understand Reddit culture, use proper markdown formatting, and write in a conversational yet informative tone.",
      linkedin: "You are a professional LinkedIn content creator who writes engaging, career-focused posts that highlight technical achievements and expertise. You understand LinkedIn's professional audience and best practices.",
      twitter: "You are a Twitter/X expert who creates concise, engaging tweets that get likes and retweets. You master the art of saying a lot with few characters.",
      instagram: "You are an Instagram content creator who writes visually-focused, story-driven captions with perfect emoji usage and hashtag strategy.",
      facebook: "You are a Facebook content creator who writes casual, engaging posts that encourage community interaction and sharing.",
      github: "You are a technical writer who creates clear, professional descriptions for developer projects on GitHub.",
    };

    return messages[platform] || "You are an expert social media content creator who generates engaging, platform-appropriate posts.";
  }

  /**
   * Parse Reddit content into title and text
   */
  private parseRedditContent(content: string): { title: string; text: string } {
    // Look for "TITLE:" and "TEXT:" markers
    const titleMatch = content.match(/TITLE:\s*(.+?)(?=\nTEXT:|$)/is);
    const textMatch = content.match(/TEXT:\s*(.+?)$/is);

    if (titleMatch && textMatch) {
      return {
        title: titleMatch[1].trim(),
        text: textMatch[1].trim(),
      };
    }

    // Fallback: split by first double newline or first period after short line
    const lines = content.split("\n");
    if (lines.length >= 2) {
      return {
        title: lines[0].trim().substring(0, 300),
        text: lines.slice(1).join("\n").trim(),
      };
    }

    // Last resort
    const firstSentence = content.split(/[.!?]/)[0];
    return {
      title: firstSentence.substring(0, 300),
      text: content.substring(firstSentence.length).trim() || content,
    };
  }

  /**
   * Post-process AI-generated content for platform
   */
  private postProcessAIContent(
    aiContent: string,
    project: Project,
    platform: string,
    mediaUrls?: string[]
  ): GeneratedContent {
    const rules = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;
    
    // Clean and format the content
    let message = aiContent.trim();
    
    // Extract hashtags if they're in the message
    const hashtagRegex = /#[\w]+/g;
    const foundHashtags = message.match(hashtagRegex) || [];
    const hashtags = foundHashtags
      .slice(0, rules.maxHashtags)
      .map((h) => h.substring(1));

    // Remove hashtags from message if we're going to add them separately (for platforms that support it)
    if (rules.supportsHashtags) {
      message = message.replace(hashtagRegex, "").trim();
    }

    // Add extracted hashtags if platform supports them and we haven't reached the limit
    const projectHashtags = this.extractHashtags(
      project.technologies || [],
      project.tags || [],
      Math.max(0, rules.maxHashtags - hashtags.length)
    );
    const allHashtags = [...hashtags, ...projectHashtags].slice(0, rules.maxHashtags);

    // Add hashtags to message if supported
    if (rules.supportsHashtags && allHashtags.length > 0) {
      message += `\n\n${allHashtags.join(" ")}`;
    }

    // Add links if supported
    if (rules.supportsLinks) {
      message = this.addLinks(message, project, platform);
    }

    // Apply platform rules
    message = this.applyPlatformRules(message, platform);

    // Validate and trim
    const warnings: string[] = [];
    if (message.length > rules.maxLength) {
      message = message.slice(0, rules.maxLength - 3) + "...";
      warnings.push(`Content truncated to ${rules.maxLength} characters`);
    }
    if (message.length < rules.minLength) {
      warnings.push(`Content is below recommended minimum of ${rules.minLength} characters`);
    }

    // Use provided mediaUrls if available, otherwise fall back to project.imageUrl
    let finalMediaUrls: string[] = [];
    if (mediaUrls && mediaUrls.length > 0) {
      finalMediaUrls = [...mediaUrls];
      console.log(`📸 ContentGenerator (AI postProcess) - Platform ${platform}: Using ${finalMediaUrls.length} media URLs from selection:`, finalMediaUrls);
    } else if (project.imageUrl) {
      finalMediaUrls = [project.imageUrl];
      console.log(`📸 ContentGenerator (AI postProcess) - Platform ${platform}: Using fallback project imageUrl`);
    } else {
      console.log(`📸 ContentGenerator (AI postProcess) - Platform ${platform}: No media URLs available`);
    }

    return {
      platform,
      message: message.trim(),
      hashtags: rules.supportsHashtags ? allHashtags : [],
      mediaUrls: finalMediaUrls,
      metadata: {
        characterCount: message.length,
        isValid: message.length <= rules.maxLength && message.length >= rules.minLength,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };
  }

  /**
   * Build AI prompt for content generation (legacy method, kept for fallback)
   */
  private buildAIPrompt(
    project: Project,
    platforms: string[],
    customMessage?: string
  ): string {
    const projectInfo = `Project: ${project.name}
Description: ${project.description || "N/A"}
Technologies: ${(project.technologies || []).join(", ")}
Tags: ${(project.tags || []).join(", ")}
Live URL: ${project.liveUrl || "N/A"}
GitHub URL: ${project.githubUrl || "N/A"}`;

    const platformRules = platforms
      .map((p) => {
        const rules = PLATFORM_RULES[p];
        return `${p}: Max ${rules.maxLength} chars, Tone: ${rules.tone}, Hashtags: ${rules.supportsHashtags ? "Yes (max " + rules.maxHashtags + ")" : "No"}`;
      })
      .join("\n");

    return `Generate social media posts for the following project across these platforms:\n\n${projectInfo}\n\nPlatform requirements:\n${platformRules}\n\n${customMessage ? `Custom message to incorporate: ${customMessage}\n\n` : ""}Return a JSON object with keys: ${platforms.join(", ")}. Each value should be the optimized post content for that platform.`;
  }
}

// Singleton instance
export const contentGenerator = new ContentGenerator();


