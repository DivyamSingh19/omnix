import { Hono } from "hono";
import {
  analyzeProposal,
  recommendVote,
  recommendGrant,
  recommendGigMatch,
  analyzeGithubProfile,
  redesign,
  detectSpam,
  eventLog,
} from "../controllers/agent";

const agent = new Hono();

agent.post("/analyze-proposal", analyzeProposal);
agent.post("/recommend-vote", recommendVote);
agent.post("/recommend-grant", recommendGrant);
agent.post("/recommend-gig-match", recommendGigMatch);
agent.post("/analyze-github", analyzeGithubProfile);
agent.post("/rewrite-with-ai", redesign);
agent.post("/filter-applications", detectSpam);
agent.post("/log", eventLog);

export default agent;
