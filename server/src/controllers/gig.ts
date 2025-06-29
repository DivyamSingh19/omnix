import { Context } from "hono";
// import prisma from "../utils/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



const getAllGigs = async (c: Context) => {
  try {
    const gigs = await prisma.gig.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({
      success: true,
      data: gigs,
    });
  } catch (error) {
    console.error("error fetching gigs", error);
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

const postGig = async (c: Context) => {
  try {
    const { title, bounty, status, postedBy } = await c.req.json();

    if (!title || !bounty || !status || !postedBy) {
      return c.json({ error: "Missing fields" }, 400);
    }
    const gig = await prisma.gig.create({
      data: {
        title,
        bounty,
        status,
        postedBy,
      },
    });

    return c.json({ success: true, data: gig });
  } catch (error) {
    return c.json(
      {
        error: "Error creating gig",
        details: String(error),
      },
      500
    );
  }
};

const updateGigStatus = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

    const updated = await prisma.gig.update({
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

export { getAllGigs, postGig, updateGigStatus };
// getAllGigs()
// postGig(data)
// matchAgentToGig(agentId, gigId) (skipping this since its a single agent system)
// updateGigStatus(gigId, status)
