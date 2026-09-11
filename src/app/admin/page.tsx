import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Lock, Share2, FileText, Layers } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  let stories: any[] = [];
  let chapters: any[] = [];
  let fetchError = false;

  try {
    const [fetchedStories, fetchedChapters] = await Promise.all([
      prisma.story.findMany({
        where: { authorId: user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          chapter: {
            select: { id: true, title: true, number: true },
          },
        },
      }),
      prisma.chapter.findMany({
        orderBy: { order: "asc" },
      }),
    ]);
    stories = fetchedStories;
    chapters = fetchedChapters;
  } catch (err) {
    console.error("[admin/page] Error loading archive stories:", err);
    fetchError = true;
  }

  const totalStories = stories.length;
  const privateCount = stories.filter((s) => s.status === "PRIVATE").length;
  const sharedCount = stories.filter((s) => s.shareStatus === "SHARED").length;
  const draftCount = stories.filter((s) => s.status === "DRAFT").length;

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
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Archivist: <span className="text-white font-serif italic text-sm">{user.name}</span> ({user.email})
          </p>
        </div>

        <Link
          href="/admin/editor"
          className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black px-6 py-2.5 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW STORY</span>
        </Link>
      </div>

      {fetchError && (
        <div className="border border-rose-900/50 bg-rose-950/20 p-6 text-center space-y-3 font-mono text-xs text-rose-300">
          <p className="font-serif text-lg text-white italic">
            Unable to connect to the archive vault database.
          </p>
          <p className="text-neutral-400">
            Please check your database connection or refresh the page.
          </p>
        </div>
      )}

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

      {/* Thematic Chapters Overview */}
      {chapters.length > 0 && (
        <div className="pt-12 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
                VOLUME INDEX // THEMATIC STRUCTURE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white italic font-normal mt-1">
                Thematic Chapters
              </h2>
            </div>
            <Link
              href="/admin/chapters"
              className="font-mono text-xs tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition"
            >
              Organize Chapters &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {chapters.map((ch) => {
              const count = stories.filter((s) => s.chapter?.id === ch.id).length;
              return (
                <Link
                  key={ch.id}
                  href={`/chapter/${ch.slug}`}
                  className="p-5 border border-white/5 bg-neutral-950/40 hover:border-white/20 transition space-y-2 block group"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                    <span>CHAPTER {String(ch.number).padStart(2, "0")}</span>
                    <span className="text-neutral-500">{count} {count === 1 ? "MEMORY" : "MEMORIES"}</span>
                  </div>
                  <h3 className="font-serif text-lg text-neutral-200 group-hover:text-white group-hover:italic transition">
                    {ch.title}
                  </h3>
                  {ch.subtitle && (
                    <p className="font-serif text-xs text-neutral-400 italic line-clamp-1">
                      &ldquo;{ch.subtitle}&rdquo;
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
