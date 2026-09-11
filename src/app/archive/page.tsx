import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Archive Philosophy // Paarth's Archive",
  description: "Conceptual architecture and structure of the personal archive.",
};

export default async function ArchivePage() {
  const user = await getCurrentUser();

  // If user is authenticated, direct them straight to their private archive dashboard
  if (user) {
    redirect("/admin");
  }

  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
  });

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
