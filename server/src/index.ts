import { Hono } from "hono";
import agentRoute from "./routes/agent";

const app = new Hono<{
  Bindings: {
    GEMINI_API_KEY: string;
  };
}>();


app.route("/agent", agentRoute);


app.get("/", (c) => c.text("Omnix Agent API running"));


app.get("/debug", (c) =>
  c.json({
    keys: Object.keys(c.env || {}),
    apiKeyExists: !!c.env?.GEMINI_API_KEY,
    keyLength: c.env?.GEMINI_API_KEY?.length || 0,
  })
);

export default app;
