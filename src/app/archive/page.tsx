import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, BookOpen, Plus, FileText, Share2, Layers } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Archive // Paarth's Archive",
  description: "Personal storytelling and private memory vault.",
};

export default async function ArchivePage() {
  const user = await getCurrentUser();

  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
  });

  // If user is authenticated, display their personal private archive directly
  if (user) {
    let stories: any[] = [];
    let fetchError = false;

    try {
      stories = await prisma.story.findMany({
        where: { authorId: user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          chapter: {
            select: { id: true, title: true, number: true },
          },
        },
      });
    } catch (err) {
      console.error("[archive/page] Error loading stories:", err);
      fetchError = true;
    }

    const totalStories = stories.length;
    const privateCount = stories.filter((s) => s.status === "PRIVATE").length;
    const sharedCount = stories.filter((s) => s.shareStatus === "SHARED").length;
    const draftCount = stories.filter((s) => s.status === "DRAFT").length;

    return (
      <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-8 gap-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase block mb-2">
                AUTHENTICATED ARCHIVIST VAULT // {user.name}
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal italic tracking-tight">
                My Archive
              </h1>
              <p className="font-serif text-base sm:text-lg text-neutral-400 italic mt-2">
                A private collection of memories, reflections, and unwritten letters.
              </p>
            </div>

            <Link
              href="/admin/editor"
              className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white hover:bg-neutral-200 text-black px-7 py-3 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 self-start sm:self-auto shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>WRITE NEW STORY</span>
            </Link>
          </div>

          {fetchError && (
            <div className="border border-rose-900/50 bg-rose-950/20 p-8 text-center space-y-3 font-mono text-xs text-rose-300">
              <span className="text-rose-400 tracking-[0.3em] uppercase block">SYSTEM NOTICE</span>
              <h2 className="font-serif text-2xl text-white italic">
                Unable to Load Archive
              </h2>
              <p className="text-neutral-400 max-w-md mx-auto">
                Something prevented your archive from loading. Please refresh or verify the database connection.
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

          {/* Stories Management with Tabs & Empty State */}
          <StoryManagerTable initialStories={stories as any} />

          {/* Thematic Chapters Overview */}
          {chapters.length > 0 && (
            <div className="pt-12 border-t border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
                    VOLUME INDEX // SEVEN THEMATIC CHAPTERS
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white italic font-normal mt-1">
                    Chapters
                  </h2>
                </div>
                <Link
                  href="/admin/chapters"
                  className="font-mono text-xs tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition"
                >
                  Manage Chapters &rarr;
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
                        <span className="text-neutral-500">
                          {count} {count === 1 ? "MEMORY" : "MEMORIES"}
                        </span>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-12 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block mb-3">
              ARCHITECTURAL OVERVIEW // PRIVATE VAULT
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white italic">
              The Archive
            </h1>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-2 font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>PRIVATE BY DEFAULT</span>
          </div>
        </div>

        {/* Narrative Concept */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
            STRUCTURE &amp; PURPOSE
          </div>
          <div className="md:col-span-8 space-y-6 text-neutral-300 font-light leading-relaxed">
            <p className="font-serif text-2xl text-white italic leading-snug">
              &ldquo;An archive is not built for an audience. It is built for permanence.&rdquo;
            </p>
            <p className="text-sm sm:text-base">
              Paarth&apos;s Archive functions as an autobiographical memory system. Memories are grouped across seven distinct thematic chapters—tracing childhood beginnings, quiet turns of youth, and portraits of people who altered the trajectory of time.
            </p>
            <p className="text-sm sm:text-base">
              Because this vault preserves genuine life incidents and personal reflections, stories are sealed from public indexing. Access to individual memories is granted strictly via intentional private dispatches.
            </p>
          </div>
        </div>

        {/* Thematic Chapters List */}
        <div className="pt-8 border-t border-white/10 space-y-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
            THE SEVEN THEMATIC VOLUMES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="p-8 border border-white/5 bg-neutral-950/40 hover:border-white/20 transition space-y-4"
              >
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.28em] text-neutral-400 uppercase">
                  <span>CHAPTER {String(ch.number).padStart(2, "0")}</span>
                  <Lock className="w-3 h-3 text-neutral-400" />
                </div>
                <h2 className="font-serif text-2xl text-white font-normal italic">
                  {ch.title}
                </h2>
                {ch.subtitle && (
                  <p className="font-serif text-sm text-neutral-300 italic">
                    &ldquo;{ch.subtitle}&rdquo;
                  </p>
                )}
                {ch.description && (
                  <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
                    {ch.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Archivist Login Prompt */}
        <div className="p-8 sm:p-12 border border-white/10 bg-neutral-950/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
              VAULT ACCESS
            </span>
            <h3 className="font-serif text-2xl text-white font-normal italic">
              Are you the archivist?
            </h3>
            <p className="font-sans text-xs text-neutral-400 max-w-md">
              Sign in with your archivist credentials to unlock the writing desk, manage stories, and review private drafts.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center space-x-3 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black px-8 py-3.5 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 flex-shrink-0 focus:outline-none"
          >
            <span>Archivist Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
