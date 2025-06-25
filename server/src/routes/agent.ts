import { Hono } from "hono";
import { thinkAgent } from "../controllers/agent";

const agentRoute = new Hono();

agentRoute.post("/think", thinkAgent);

export default agentRoute;
