import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import os from "os";

function getDatabaseUrl(): string {
  // If an external database URL is explicitly configured (PostgreSQL, Supabase, Turso, etc.)
  const existingUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;
  if (existingUrl && !existingUrl.startsWith("file:")) {
    return existingUrl;
  }

  // Serverless execution environment detection (Vercel / AWS Lambda)
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL_ENV
  );

  if (isServerless) {
    const tmpDir = os.tmpdir();
    const tmpDbPath = path.join(tmpDir, "archive.db");

    // Copy bundled seed database to /tmp if it doesn't already exist or is empty
    if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
      const bundledDbPath = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(/*turbopackIgnore: true*/ bundledDbPath)) {
        try {
          fs.copyFileSync(bundledDbPath, tmpDbPath);
        } catch (err) {
          console.error(`[db] Failed to copy database from ${bundledDbPath} to ${tmpDbPath}:`, err);
        }
      }
    }

    const serverlessUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = serverlessUrl;
    return serverlessUrl;
  }

  // Local environment fallback
  if (!existingUrl) {
    process.env.DATABASE_URL = "file:./dev.db";
    return "file:./dev.db";
  }

  return existingUrl;
}

const resolvedUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

