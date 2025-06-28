import { Context } from "hono";
import prisma from "../utils/prisma";
import { User } from "../types/user";

async function loginUser(c:Context) {
    try {
        const {email,password,phantom_wallet} = await c.req.json() as User
        if(!email||!password||!phantom_wallet){
            return c.json({
                error:"Missing required fields"
            },400)
        }
        const existing = await prisma.user.findFirst({
            where:{
                OR:[{email},{phantom_wallet}]
            },
        })
        if(existing){
            return c.json({error})
        }
    } catch (error) {
        
    }
}

async function registerUser(c:Context) {
    try {
        
    } catch (error) {
        
    }
}
export {loginUser,registerUser}