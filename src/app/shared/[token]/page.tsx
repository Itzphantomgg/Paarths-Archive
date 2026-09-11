import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Lock, Clock, MapPin, Sparkles, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatStoryDate } from "@/lib/utils";
import StoryContent from "@/components/story/StoryContent";

export const dynamic = "force-dynamic";

interface SharedStoryPageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({ params }: SharedStoryPageProps) {
  const { token } = await params;
  const story = await prisma.story.findUnique({
    where: { shareToken: token },
    select: { title: true, subtitle: true, excerpt: true, shareStatus: true },
  });

  if (!story || story.shareStatus !== "SHARED") {
    return { title: "Private Dispatch // Paarth's Archive" };
  }

  return {
    title: `${story.title} // Private Dispatch // Paarth's Archive`,
    description: story.subtitle || story.excerpt || "A private dispatch from Paarth's Archive.",
  };
}

export default async function SharedStoryPage({ params }: SharedStoryPageProps) {
  const { token } = await params;

  const story = await prisma.story.findUnique({
    where: { shareToken: token },
    include: {
      chapter: {
        select: {
          title: true,
          number: true,
        },
      },
    },
  });

  // If story doesn't exist or sharing is not actively SHARED
  if (!story || story.shareStatus !== "SHARED") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#EDEDEB] flex flex-col items-center justify-center px-6 py-24 select-none">
        <div className="max-w-md w-full border border-white/10 bg-neutral-950/60 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 flex items-center justify-center mx-auto mb-6 text-neutral-400">
            <Lock className="w-4 h-4" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase block mb-3">
            SEALED DISPATCH
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal italic mb-4">
            Memory Unavailable
          </h1>
          <p className="font-mono text-xs text-neutral-400 leading-relaxed mb-8">
            This private dispatch has been revoked by the archivist, returned to the vault, or the link has expired.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 font-mono text-[11px] tracking-[0.25em] text-neutral-300 hover:text-white uppercase border-b border-white/30 hover:border-white pb-1 transition"
          >
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = formatStoryDate(story.approximateDate, story.exactDate, story.year);

  return (
    <article className="min-h-screen bg-[#050505] text-[#EDEDEB] selection:bg-white selection:text-black">
      {/* Minimal Shared Header — Zero leak to owner archive */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 py-5 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg tracking-tight text-white/90 hover:text-white transition italic"
          >
            Paarth&apos;s Archive
          </Link>
          <div className="flex items-center space-x-2 font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            <Lock className="w-3 h-3 text-neutral-500" />
            <span>PRIVATE DISPATCH</span>
          </div>
        </div>
      </header>

      {/* Main Reading Container */}
      <main className="pt-36 pb-32 px-6 sm:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Chapter / Context Badge */}
          {story.chapter && (
            <div className="mb-6 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] text-neutral-400 uppercase">
              CHAPTER {String(story.chapter.number).padStart(2, "0")} // {story.chapter.title}
            </div>
          )}

          {/* Grand Story Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-normal italic tracking-tight leading-[1.05] mb-6">
            {story.title}
          </h1>

          {/* Subtitle */}
          {story.subtitle && (
            <p className="font-serif text-lg sm:text-2xl text-neutral-300 font-light italic leading-relaxed mb-8">
              &ldquo;{story.subtitle}&rdquo;
            </p>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 py-4 border-y border-white/10 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-neutral-400 uppercase mb-12">
            {formattedDate && (
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>{formattedDate}</span>
              </div>
            )}
            {story.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{story.location}</span>
              </div>
            )}
            {story.mood && (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                <span>{story.mood}</span>
              </div>
            )}
            <div>{story.readingTimeMinutes} MIN READ</div>
          </div>

          {/* Cover Photograph if present */}
          {story.coverImage && (
            <div className="relative w-full aspect-[16/9] mb-14 overflow-hidden border border-white/10 bg-neutral-900">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                priority
                className="object-cover filter grayscale contrast-110 brightness-90"
              />
            </div>
          )}

          {/* Editorial Book Typography */}
          <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed font-sans">
            <StoryContent content={story.content} />
          </div>

          {/* End of Dispatch Ornament */}
          <div className="mt-20 pt-10 border-t border-white/10 text-center font-mono text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
            <span>&bull; &bull; &bull;</span>
            <p className="mt-3 text-neutral-600">
              SHARED PRIVATELY FROM PAARTH&apos;S ARCHIVE
            </p>
          </div>
        </div>
      </main>
    </article>
  );
}
