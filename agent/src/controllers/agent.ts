import { Context } from "hono";
import { getGeminiResponse } from "../utils/gemini";
import {
  processProposalPrompt,
  votePrompt,
  grantPrompt,
  gigMatchPrompt,
  summarizePrompt,
} from "../utils/prompts";
import { analyzeGitHubProfileViaAPI } from "../utils/github";
import { cleanMarkdown } from "../utils/markdown";

const processProposal = async (c: Context) => {
  try {
    const { title, description, id } = await c.req.json();

    if (!title || !description || !id) {
      return c.json({ error: "Missing required fields." }, 400);
    }

    const prompt = processProposalPrompt({ title, description });

    const aiResponse = await getGeminiResponse(prompt, c.env.GEMINI_API_KEY);

    return c.json({
      success: true,
      aiResponse,
    });
  } catch (error) {
    console.error("processProposal error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to process proposal",
        details: String(error),
      },
      500
    );
  }
};

const summarizeProposal = async (c: Context) => {
  try {
    const { title, description } = await c.req.json();

    if (!title || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = summarizePrompt({ title, description });

    const summary = await getGeminiResponse(prompt, c.env.GEMINI_API_KEY);

    return c.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("summarizeProposal error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to summarize proposal",
        details: String(error),
      },
      500
    );
  }
};

const recommendVote = async (c: Context) => {
  try {
    const { title, description, goal, amount } = await c.req.json();

    if (!goal || !amount || !title || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const prompt = votePrompt({ goal, amount, title, description });

    const recommendation = await getGeminiResponse(
      prompt,
      c.env.GEMINI_API_KEY
    );

    return c.json({
      success: true,
      vote: recommendation.trim().toLowerCase(),
    });
  } catch (error) {
    console.error("recommendVote error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to vote on the proposal",
        details: String(error),
      },
      500
    );
  }
};

const recommendGrant = async (c: Context) => {
  try {
    const { goal, amount, title, description } = await c.req.json();

    if (!goal || !amount || !title || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const prompt = grantPrompt({ goal, amount, title, description });

    const decision = await getGeminiResponse(prompt, c.env.GEMINI_API_KEY);

    return c.json({ success: true, grantDecision: decision });
  } catch (error) {
    console.error("recommendGrant error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to assign grant for the proposal",
        details: String(error),
      },
      500
    );
  }
};

const recommendGigMatch = async (c: Context) => {
  try {
    const { proposalTitle, proposalDesc, gigTitle, gigDesc } =
      await c.req.json();

    if (!proposalTitle || !proposalDesc || !gigTitle || !gigDesc) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = gigMatchPrompt({
      proposalTitle,
      proposalDesc,
      gigTitle,
      gigDesc,
    });

    const matchDecision = await getGeminiResponse(prompt, c.env.GEMINI_API_KEY);

    return c.json({ success: true, matchDecision });
  } catch (error) {
    console.error("recommendGigMatch error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to recommend gig",
        details: String(error),
      },
      500
    );
  }
};

const analyzeGithubProfile = async (c: Context) => {
  try {
    const { username } = await c.req.json();

    if (!username) {
      return c.json({ error: "GitHub username is required" }, 400);
    }

    const cleanUsername = username.replace("@", "").trim();
    if (
      !/^[a-zA-Z0-9]([a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(cleanUsername)
    ) {
      return c.json(
        {
          error: "Invalid GitHub username format",
          details:
            "Username can only contain alphanumeric characters and hyphens",
        },
        400
      );
    }

    console.log(`Analyzing GitHub profile for: ${cleanUsername}`);

    let profile;

    try {
      const githubToken = c.env.GITHUB_TOKEN;
      profile = await analyzeGitHubProfileViaAPI(cleanUsername);
      console.log("Successfully analyzed profile using GitHub API");
    } catch (apiError: any) {
      console.log("GitHub API failed:", apiError.message);
      throw apiError;
    }

    const contentString = JSON.stringify(profile);
    if (!contentString || contentString.length < 50) {
      return c.json(
        {
          error: "GitHub profile analysis incomplete",
          details: "Profile content could not be retrieved or is too short",
        },
        422
      );
    }

    return c.json({
      success: true,
      username: cleanUsername,
      contentLength: contentString.length,
      profile, 
    });
  } catch (error: any) {
    console.error("GitHub profile analysis failed:", {
      error: error.message,
      stack: error.stack,
    });

    if (error.message.includes("not found")) {
      return c.json(
        {
          success: false,
          error: "GitHub user not found",
          details: error.message,
        },
        404
      );
    }

    if (error.message.includes("rate limit")) {
      return c.json(
        {
          success: false,
          error: "Rate limit exceeded",
          details:
            "GitHub API rate limit reached. Try again later or add a GitHub token.",
        },
        429
      );
    }

    if (error.message.includes("too large")) {
      return c.json(
        { success: false, error: "Profile too large", details: error.message },
        413
      );
    }

    if (
      error.message.includes("Invalid API key") ||
      error.message.includes("configuration")
    ) {
      return c.json(
        { success: false, error: "Service configuration error" },
        500
      );
    }

    if (error.message.includes("unavailable")) {
      return c.json(
        {
          success: false,
          error: "External service unavailable",
          details: "Please try again later",
        },
        503
      );
    }

    return c.json(
      {
        success: false,
        error: "Failed to analyze GitHub profile",
        details:
          c.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      },
      500
    );
  }
};


export {
  processProposal,
  summarizeProposal,
  recommendVote,
  recommendGrant,
  recommendGigMatch,
  analyzeGithubProfile,
};
// processProposal
// summarizeProposal
// recommendVote
// recommendGrant
// recommendGigMatch
