import { Hono } from "hono";
import { loginUser,registerUser } from "../controllers/auth";


const authRouter = new Hono()


authRouter.post("/login-user",loginUser)

authRouter.post("/register-user",registerUser)


export default authRouter;