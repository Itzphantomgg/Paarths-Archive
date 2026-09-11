import React from "react";
import { prisma } from "@/lib/db";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export default async function AdminDraftsPage() {
  const stories = await prisma.story.findMany({
    where: { status: "DRAFT" },
    orderBy: { updatedAt: "desc" },
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
          Private Drafts
        </h2>
        <p className="font-mono text-xs text-neutral-400 mt-1">
          Unpublished fragments and memories hidden from public visitors.
        </p>
      </div>

      <StoryManagerTable initialStories={stories} filterStatus="DRAFT" />
    </div>
  );
}
