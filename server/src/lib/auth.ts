//jwt helpers
import jwt from  "jsonwebtoken"
const secret = process.env.JWT_SECRET as string

export function signJWT(payload:object){
    return jwt.sign(payload,secret,{expiresIn:"7d"})
}

export function verifyJWT(token:string){
    try {
        return jwt.verify(token,secret) as any
    } catch (error) {
        return null
    }
}