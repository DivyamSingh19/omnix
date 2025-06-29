import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
 
const prisma = new PrismaClient({
    datasourceurl : process.env.DATABASE_URL as string
}).$extends(withAccelerate())
export default prisma;
