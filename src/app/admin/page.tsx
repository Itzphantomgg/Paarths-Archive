import React from "react";
import Link from "next/link";
import { Plus, Lock, Share2, FileText, Layers } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  const stories = await prisma.story.findMany({
    where: user ? { authorId: user.id } : {},
    orderBy: { updatedAt: "desc" },
    include: {
      chapter: {
        select: { id: true, title: true, number: true },
      },
    },
  });

  const totalStories = stories.length;
  const privateCount = stories.filter((s) => s.status === "PRIVATE").length;
  const sharedCount = stories.filter((s) => s.shareStatus === "SHARED").length;
  const draftCount = stories.filter((s) => s.status === "DRAFT").length;
  const chaptersCount = await prisma.chapter.count();

  return (
    <div className="space-y-10">
      {/* Top Banner: MY ARCHIVE */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase block mb-2">
            AUTHENTICATED ARCHIVIST VAULT
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal italic">
            My Archive
          </h1>
        </div>

        <Link
          href="/admin/editor"
          className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black px-6 py-2.5 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW STORY</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
        <div className="p-6 border border-white/10 bg-neutral-950/50 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] tracking-[0.25em] uppercase">
            <span>TOTAL MEMORIES</span>
            <FileText className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl text-white font-light block">
            {totalStories}
          </span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950/50 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] tracking-[0.25em] uppercase">
            <span>PRIVATE VAULT</span>
            <Lock className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl text-neutral-200 font-light block">
            {privateCount}
          </span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950/50 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] tracking-[0.25em] uppercase">
            <span>SHARED DISPATCHES</span>
            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl text-emerald-400 font-light block">
            {sharedCount}
          </span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950/50 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] tracking-[0.25em] uppercase">
            <span>DRAFTS</span>
            <Layers className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl text-amber-400 font-light block">
            {draftCount}
          </span>
        </div>
      </div>

      {/* Stories Table with Tabs */}
      <StoryManagerTable initialStories={stories as any} />
    </div>
  );
}
