import { Context } from "hono"
import prisma from "../utils/prisma"
import { comparePassword, hashPassword } from "../utils/hash"
import { signJWT } from "../lib/auth"

export async function registerUser(c: Context) {
  try {
    const { email, password, phantom_wallet } = await c.req.json()

    if (!email || !password || !phantom_wallet) {
      return c.json({ error: "Missing required fields" }, 400)
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phantom_wallet }],
      },
    })

    if (existing) {
      return c.json({ error: "User already exists" }, 409)
    }

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        phantom_wallet,
      },
    })

    const token = signJWT({ id: user.id, email: user.email })

    return c.json({
      message: "User registered",
      token,
      user: { id: user.id, email: user.email, phantom_wallet: user.phantom_wallet },
    })
  } catch (error) {
    return c.json({ error: "Registration failed" }, 500)
  }
}

export async function loginUser(c: Context) {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) return c.json({ error: "Missing credentials" }, 400)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return c.json({ error: "User not found" }, 404)

    const isValid = await comparePassword(password, user.password)
    if (!isValid) return c.json({ error: "Invalid password" }, 401)

    const token = signJWT({ id: user.id, email: user.email })

    return c.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, phantom_wallet: user.phantom_wallet },
    })
  } catch (err) {
    return c.json({ error: "Login failed" }, 500)
  }
}
