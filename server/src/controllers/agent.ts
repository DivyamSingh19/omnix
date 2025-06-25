import { Context } from "hono";
import { getGeminiResponse } from "../utils/gemini";

export const thinkAgent = async (c: Context) => {
  try {
    const body = await c.req.json();

    console.log("Full env object:", c.env);
    console.log("All env keys:", Object.keys(c.env || {}));
    console.log("GEMINI_API_KEY value:", c.env?.GEMINI_API_KEY);
    console.log("GEMINI_API_KEY type:", typeof c.env?.GEMINI_API_KEY);

    const apiKey = c.env?.GEMINI_API_KEY;

    if (!apiKey) {
      return c.json(
        {
          error: "GEMINI_API_KEY not found in environment variables",
          debug: {
            envKeys: Object.keys(c.env || {}),
            hasEnv: !!c.env,
          },
        },
        500
      );
    }

    if (!body.prompt) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    const response = await getGeminiResponse(body.prompt, apiKey);

    return c.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error("Think agent error:", error);
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
