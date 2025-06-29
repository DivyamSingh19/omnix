import { Context } from "hono";
import prisma from "../utils/prisma";

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
    return c.json({ success: true, data: proposals });
  } catch (error) {
    return c.json({ success: false, error: "Error fetching proposals" }, 500);
  }
};

const getProposalById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        votes: true,
        createdBy: true,
      },
    });
    if (!proposal) {
      return c.json({ success: false, error: "Proposal not found" }, 404);
    }
    return c.json({ success: true, data: proposal });
  } catch (error) {
    return c.json({ success: false, error: "Error fetching proposal" }, 500);
  }
};

const createProposal = async (c: Context) => {
  try {
    const { title, description, createdById } = await c.req.json();
    if (!title || !description || !createdById) {
      return c.json({ success: false, error: "Missing fields" }, 400);
    }

    const proposal = await prisma.proposal.create({
      data: {
        title,
        description,
        createdById,
        status: "pending",
        aiSummary: "", 
      },
    });

    return c.json({ success: true, data: proposal });
  } catch (error) {
    return c.json({ success: false, error: "Error creating proposal" }, 500);
  }
};


const updateProposalStatus = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const proposal = await prisma.proposal.findUnique({ where: { id } });

    if (!proposal) {
      return c.json({ success: false, error: "Proposal not found" }, 404);
    }

    let newStatus = proposal.status === "pending" ? "approved" : "completed";

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status: newStatus },
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json({ success: false, error: "Error updating status" }, 500);
  }
};

const addVoteToProposal = async (c: Context) => {
  try {
    const { proposalId, voterAddress, voteChoice, txHash } = await c.req.json();

    const existing = await prisma.vote.findFirst({
      where: { proposalId, voterAddress },
    });

    if (existing) {
      return c.json({ success: false, error: "Already voted" }, 400);
    }

    const vote = await prisma.vote.create({
      data: { proposalId, voterAddress, voteChoice, txHash },
    });

    return c.json({ success: true, data: vote });
  } catch (error) {
    return c.json({ success: false, error: "Error casting vote" }, 500);
  }
};

export {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposalStatus,
  addVoteToProposal,
};
