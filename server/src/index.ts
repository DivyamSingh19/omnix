import { Hono } from 'hono'

const app = new Hono()

interface RequestBody {
  query: string;
  candidates?: string[];
}

app.get("/", (c) => {
  return c.text("Omnix Agent Server is Live");
});

app.post("/think", async (c) => {
  const body = await c.req.json<RequestBody>();

  if (!body.query) {
    return c.json({ error: "Missing query field" }, 400);
  }

  const responseText =
    ` You asked: "${body.query}"` +
    (body.candidates ? `\n Candidates: ${body.candidates.join(", ")}` : "");

  return c.json({ reply: responseText });
});


export default app
