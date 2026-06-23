import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.env.VERCEL) {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const tempDbPath = "/tmp/dev.db";

  if (!fs.existsSync(tempDbPath)) {
    try {
      const dir = path.dirname(tempDbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.copyFileSync(dbPath, tempDbPath);
    } catch (error) {
      console.error("Failed to copy database to /tmp:", error);
    }
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

