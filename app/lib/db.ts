import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});
export async function checkDatabaseConnection():Promise <boolean> {
    try {
        await prisma.$queryRaw`Select 1`;
        return true;
    } catch (error) {
        console.error("Database Connection failed", error)
        return false;
    }
}
