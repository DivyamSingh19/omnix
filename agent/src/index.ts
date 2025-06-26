import { Hono } from "hono";


const app = new Hono();

app.get("/", (c) => c.text("Agent server is live"));


export default app;
