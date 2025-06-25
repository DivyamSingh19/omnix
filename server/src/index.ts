import { Hono } from "hono";

const app = new Hono<{
  Bindings: {
    GEMINI_API_KEY: string;
  };
}>();


app.get("/debug", (c) => {
  return c.json({
    env: c.env,
    keys: Object.keys(c.env || {}),
    apiKey: c.env.GEMINI_API_KEY ? "EXISTS" : "MISSING",
    apiKeyLength: c.env.GEMINI_API_KEY?.length || 0,
  });
});


app.post("/agent/think", async (c) => {
  try {
    console.log("Environment check:", c.env);

    const apiKey = c.env.GEMINI_API_KEY;

    if (!apiKey) {
      return c.json(
        {
          error: "GEMINI_API_KEY not found in environment",
          debug: {
            env: c.env,
            keys: Object.keys(c.env || {}),
          },
        },
        500
      );
    }

    const body = await c.req.json();

    if (!body.prompt) {
      return c.json({ error: "Prompt required" }, 400);
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(body.prompt);
    const response = await result.response;
    const text = response.text();

    return c.json({
      success: true,
      response: text.trim(),
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/", (c) => {
  return c.text("Server running!");
});

export default app;
