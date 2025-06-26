import { Context } from "hono";
import { getGeminiResponse } from "../utils/gemini";
import {
  processProposalPrompt,
  votePrompt,
  grantPrompt,
  gigMatchPrompt,
  summarizePrompt,
} from "../utils/prompts";

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
    const { title, description } = await c.req.json();

    if (!title || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = votePrompt({ title, description });

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
  

export {
  processProposal,
  summarizeProposal,
  recommendVote,
  recommendGrant,
  recommendGigMatch,
};
// processProposal
// summarizeProposal
// recommendVote
// recommendGrant
// recommendGigMatch
