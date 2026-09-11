import React from "react";
import { prisma } from "@/lib/db";
import ChapterManagerClient from "./ChapterManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminChaptersPage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { stories: true },
      },
    },
  });

  return <ChapterManagerClient initialChapters={chapters} />;
}
