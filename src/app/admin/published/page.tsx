import React from "react";
import { prisma } from "@/lib/db";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export default async function AdminPublishedPage() {
  const stories = await prisma.story.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      chapter: {
        select: { id: true, title: true, number: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-2xl text-white italic">
          Published Chronicles
        </h2>
        <p className="font-mono text-xs text-neutral-400 mt-1">
          Entries currently live and visible in the public digital archive.
        </p>
      </div>

      <StoryManagerTable initialStories={stories} filterStatus="PUBLISHED" />
    </div>
  );
}
