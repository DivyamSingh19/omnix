import { Context } from "hono";
import prisma from "../utils/prisma";

const getAllGrants = async (c: Context) => {
  try {
    const grant = await prisma.grant.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ success: true, data: grant });
  } catch (error) {
    console.error("error fetching grants", error);
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

const getGrantById = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const grant = await prisma.grant.findUnique({ where: { id } });

    if (!grant) {
      return c.json({ error: "Grant not found" }, 404);
    }

    return c.json({
      success: true,
      data: grant,
    });
  } catch (error) {
    console.error("error fetching grants by id", error);
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

const createGrant = async (c: Context) => {
  try {
    const { applicant, goal, amount, score, status, proposalId } =
      await c.req.json();

    if (!applicant || !goal || !amount || !score || !status || !proposalId) {
        return c.json({ error: "Missing fields" }, 400);
      }  
    const grant = await prisma.grant.create({
      data: {
        applicant,
        goal,
        amount,
        score,
        status,
        proposalId,
      },
    });

    return c.json({ success: true, data: grant });
  } catch (error) {
    return c.json(
      {
        error: "Error creating grant",
        details: String(error),
      },
      500
    );
  }
};
  
const updateGrantStatus = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

    const updated = await prisma.grant.update({
      where: { id },
      data: { status },
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json(
      {
        error: "Error updating status",
        details: String(error),
      },
      500
    );
  }
};
  
const assignGrantToProposal = async (c: Context) => {
  try {
    const { grantId, proposalId } = await c.req.json();

    const updated = await prisma.grant.update({
      where: { id: grantId },
      data: { proposalId },
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    return c.json(
      { error: "Error assigning grant", details: String(error) },
      500
    );
  }
};
  

export {
  getAllGrants,
  getGrantById,
  createGrant,
  updateGrantStatus,
  assignGrantToProposal,
};

// getAllGrants()
// getGrantById(id)
// createGrant(data)
// updateGrantStatus(id, status)
// assignGrantToProposal(grantId, proposalId)
