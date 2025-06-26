import { Hono } from "hono";
import {
  processProposal,
  summarizeProposal,
  recommendVote,
  recommendGrant,
  recommendGigMatch,
} from "../controllers/agent";

const agent = new Hono();

agent.post("/process-proposal", processProposal);
agent.post("/summarize-proposal", summarizeProposal);
agent.post("/recommend-vote", recommendVote);
agent.post("/recommend-grant", recommendGrant);
agent.post("/recommend-gig-match", recommendGigMatch);

export default agent;
