import { Context } from "hono";
import prisma from "../utils/prisma";
import { getGeminiResponse } from "../utils/gemini";

const getAllProposals = async (c: Context) => {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        votes: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    console.error("error fetching proposals", error);
    return c.json(
      {
        error: "Internal server error",
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

const getProposalById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const proposalsById = await prisma.proposal.findUnique({
      select: { id },
      include: {
        votes: true,
        createdBy: true,
      },
    });

    if (!proposalsById) {
      return c.json({ error: "Proposal not found" }, 404);
    }

    return c.json({
      success: true,
      data: proposalsById,
    });
  } catch (error) {
    console.error("error fetching proposals by id", error);
    return c.json(
      {
        error: "Internal server error",
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

const createProposal = async (c: Context) => {
  try {
    // assuming the user is logged in
    const { title, description, createdById } = await c.req.json();

    if (!title || !description || !createdById) {
      return c.json({ error: "Missing fields" }, 400);
    }

    const proposal = await prisma.proposal.create({
      data: {
        title,
        description,
        createdById,
        status: "pending",
        aiSummary: "AI summary placeholder",
      },
    });

    return c.json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return c.json(
      {
        error: "Internal server error",
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};

const updateProposalStatus = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const proposal = await prisma.proposal.findUnique({ where: { id } });

    if (!proposal) {
      return c.json({ error: "Proposal not found" }, 404);
    }
    // just test logic not the actual thing
    // pending,approved,completed
    let newStatus = proposal.status;
    if (proposal.status === "pending") newStatus = "approved";
    else if (proposal.status === "approved") newStatus = "completed";

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status: newStatus },
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json(
      { error: "Error updating status", details: String(error) },
      500
    );
  }
};

const addVoteToProposal = async (c: Context) => {
  try {
    const { proposalId, voterAddress, voteChoice, txHash } = await c.req.json();

    const existingVote = await prisma.vote.findFirst({
      where: { proposalId, voterAddress },
    });

    if (existingVote) {
      return c.json({ error: "You have already voted." }, 400);
    }

    const vote = await prisma.vote.create({
      data: {
        proposalId,
        voterAddress,
        voteChoice,
        txHash,
      },
    });

    return c.json({ success: true, data: vote });
  } catch (error) {
    return c.json({ error: "Error casting vote", details: String(error) }, 500);
  }
};

const generateProposalSummary = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const proposal = await prisma.proposal.findUnique({ where: { id } });

    if (!proposal) {
      return c.json({ error: "Proposal not found" }, 404);
    }

    const prompt = `Summarize the following proposal: 
        Title: ${proposal.title}
        Description: ${proposal.description}`;

    const summary = await getGeminiResponse(prompt, c.env.GEMINI_API_KEY);

    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: { aiSummary: summary },
    });

    return c.json({ success: true, data: updatedProposal });
  } catch (error) {
    return c.json(
      { error: "Error generating summary", details: String(error) },
      500
    );
  }
};

export {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposalStatus,
  addVoteToProposal,
  generateProposalSummary,
};
