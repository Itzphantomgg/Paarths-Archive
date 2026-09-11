import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
  });

  const stories = await prisma.story.findMany({
    include: {
      chapter: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const exportPayload = {
    archiveTitle: "Paarth's Archive",
    exportDate: new Date().toISOString(),
    totalStories: stories.length,
    totalChapters: chapters.length,
    chapters,
    stories,
  };

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="paarths-archive-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
