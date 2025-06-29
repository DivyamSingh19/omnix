import { MiddlewareHandler } from "hono"
import { verifyJWT } from "../lib/auth"

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  const token = authHeader.split(" ")[1]
  const user = verifyJWT(token)
  if (!user) return c.json({ error: "Invalid or expired token" }, 401)

  c.set("user", user)
  await next()
}
