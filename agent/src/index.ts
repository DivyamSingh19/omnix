import { Hono } from "hono";
import agentRoute from "./routes/agent";

const app = new Hono();

app.get("/", (c) => c.text("Agent server is live"));
app.route("/agent", agentRoute);

export default app;
