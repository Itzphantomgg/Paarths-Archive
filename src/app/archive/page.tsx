import React from "react";
import { prisma } from "@/lib/db";
import ArchiveExplorer from "./ArchiveExplorer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Complete Archive // Paarth's Archive",
  description: "A chronological catalog of memories, stories, and fragments.",
};

export default async function ArchivePage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true, number: true },
  });

  const stories = await prisma.story.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [{ year: "asc" }, { createdAt: "desc" }],
    include: {
      chapter: {
        select: {
          number: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Archive Header */}
        <div className="mb-16 border-b border-white/10 pb-12 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block mb-3">
              COMPLETE CHRONOLOGY // 2007 — 2026
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white italic">
              The Archive
            </h1>
          </div>
          <div className="mt-6 md:mt-0 text-left md:text-right font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
            <span>{stories.length} MEMORIES PRESERVED</span>
          </div>
        </div>

        {/* Interactive Explorer with Filtering */}
        <ArchiveExplorer chapters={chapters} initialStories={stories} />
      </div>
    </div>
  );
}
