import React from "react";
import { prisma } from "@/lib/db";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stories = await prisma.story.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      chapter: {
        select: { id: true, title: true, number: true },
      },
    },
  });

  const totalStories = stories.length;
  const publishedCount = stories.filter((s) => s.status === "PUBLISHED").length;
  const draftCount = stories.filter((s) => s.status === "DRAFT").length;
  const chaptersCount = await prisma.chapter.count();

  return (
    <div className="space-y-10">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
        <div className="p-6 border border-white/10 bg-neutral-950/40">
          <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            TOTAL MEMORIES
          </span>
          <span className="font-serif text-3xl sm:text-4xl text-white font-light">
            {totalStories}
          </span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950/40">
          <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            PUBLICLY PRESERVED
          </span>
          <span className="font-serif text-3xl sm:text-4xl text-emerald-400 font-light">
            {publishedCount}
          </span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950/40">
          <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            PRIVATE DRAFTS
          </span>
          <span className="font-serif text-3xl sm:text-4xl text-amber-400 font-light">
            {draftCount}
          </span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950/40">
          <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
            ACTIVE CHAPTERS
          </span>
          <span className="font-serif text-3xl sm:text-4xl text-neutral-300 font-light">
            {chaptersCount}
          </span>
        </div>
      </div>

      {/* Story Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-serif text-2xl text-white italic">
            Chronicle Index
          </h2>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
            CLICK ON TITLE TO EDIT IN WRITING STUDIO
          </span>
        </div>

        <StoryManagerTable initialStories={stories} filterStatus="ALL" />
      </div>
    </div>
  );
}
