import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, MapPin, Users, Sparkles, Tag as TagIcon } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatStoryDate } from "@/lib/utils";
import StoryContent from "@/components/story/StoryContent";

export const dynamic = "force-dynamic";

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug },
    select: { title: true, subtitle: true, excerpt: true },
  });

  if (!story) return { title: "Story Not Found // Paarth's Archive" };

  return {
    title: `${story.title} // Paarth's Archive`,
    description: story.subtitle || story.excerpt || "A memory preserved in Paarth's Archive.",
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      chapter: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!story) {
    notFound();
  }

  // Privacy Enforcement: Only authenticated owner can read private stories by slug
  if (!user || (story.authorId !== user.id && user.role !== "ADMIN")) {
    notFound();
  }

  // Fetch adjacent stories within the user's private archive for book-like pagination
  const previousStory = await prisma.story.findFirst({
    where: {
      authorId: user.id,
      createdAt: { lt: story.createdAt },
    },
    orderBy: { createdAt: "desc" },
    select: { title: true, slug: true, chapter: { select: { number: true, title: true } } },
  });

  const nextStory = await prisma.story.findFirst({
    where: {
      authorId: user.id,
      createdAt: { gt: story.createdAt },
    },
    orderBy: { createdAt: "asc" },
    select: { title: true, slug: true, chapter: { select: { number: true, title: true } } },
  });

  const formattedDate = formatStoryDate(
    story.approximateDate,
    story.exactDate,
    story.year
  );

  return (
    <article className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12 relative">
      <div className="max-w-4xl mx-auto">
        {/* Top Minimal Return Link */}
        <div className="mb-14 flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/admin"
            className="group inline-flex items-center space-x-2 font-mono text-[11px] tracking-[0.25em] text-neutral-400 hover:text-white uppercase transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO MY ARCHIVE</span>
          </Link>

          <div className="flex items-center space-x-3">
            {story.status === "DRAFT" ? (
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-800/60">
                PRIVATE DRAFT
              </span>
            ) : story.shareStatus === "SHARED" ? (
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/60">
                SHARED VIA KEY
              </span>
            ) : (
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded bg-neutral-900 text-neutral-400 border border-white/10">
                PRIVATE VAULT
              </span>
            )}

            <Link
              href={`/admin/editor?id=${story.id}`}
              className="font-mono text-[10px] tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition border border-white/20 px-3 py-1 rounded-full hover:border-white"
            >
              EDIT ENTRY
            </Link>
          </div>
        </div>

        {/* Story Header */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          {story.chapter && (
            <div className="font-mono text-[11px] tracking-[0.3em] text-neutral-400 uppercase">
              CHAPTER {String(story.chapter.number).padStart(2, "0")} // {story.chapter.title}
            </div>
          )}

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-tight">
            {story.title}
          </h1>

          {story.subtitle && (
            <p className="font-serif text-xl sm:text-2xl text-neutral-300 italic font-light max-w-2xl mx-auto leading-relaxed">
              &ldquo;{story.subtitle}&rdquo;
            </p>
          )}
        </header>

        {/* Memory Metadata Grid (Optional fields gracefully displayed) */}
        <div className="my-12 py-6 border-y border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center font-mono text-xs">
          <div>
            <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
              RECORDED TIME
            </span>
            <span className="text-neutral-200 tracking-wider">{formattedDate}</span>
          </div>

          {story.location ? (
            <div>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
                LOCATION
              </span>
              <span className="text-neutral-200 tracking-wider truncate block">
                {story.location}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
                READING TIME
              </span>
              <span className="text-neutral-200 tracking-wider">
                {story.readingTimeMinutes} MIN READ
              </span>
            </div>
          )}

          {story.mood && (
            <div>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
                ATMOSPHERE
              </span>
              <span className="text-neutral-200 tracking-wider">{story.mood}</span>
            </div>
          )}

          {story.peopleInvolved ? (
            <div>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
                PEOPLE INVOLVED
              </span>
              <span className="text-neutral-200 tracking-wider truncate block">
                {story.peopleInvolved}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block mb-1">
                CLASSIFICATION
              </span>
              <span className="text-neutral-200 tracking-wider">{story.storyType}</span>
            </div>
          )}
        </div>

        {/* Hero Cover Photography */}
        {story.coverImage && (
          <div className="my-14 overflow-hidden border border-white/10 relative aspect-[16/9] sm:aspect-[21/9] bg-neutral-900">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover filter grayscale contrast-125 brightness-85"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute bottom-3 right-4 font-mono text-[9px] tracking-[0.25em] text-white/50 uppercase">
              ARCHIVE STILL // NO. {story.year || "NULL"}
            </div>
          </div>
        )}

        {/* Editorial Book Body */}
        <div className="max-w-2xl mx-auto py-8">
          <StoryContent content={story.content} />
        </div>

        {/* Tags */}
        {story.tags.length > 0 && (
          <div className="max-w-2xl mx-auto pt-12 pb-6 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mr-2 flex items-center space-x-1">
              <TagIcon className="w-3 h-3" />
              <span>INDEX TAGS:</span>
            </span>
            {story.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/search?q=${encodeURIComponent(tag.name)}`}
                className="font-mono text-[10px] tracking-[0.18em] text-neutral-400 hover:text-white uppercase px-2.5 py-1 rounded border border-white/10 hover:border-white/40 transition bg-neutral-950/40"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Book Chapter Pagination: Previous Story & Next Story */}
        <nav className="mt-16 pt-12 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {previousStory ? (
            <Link
              href={`/story/${previousStory.slug}`}
              className="group border border-white/10 hover:border-white/30 p-6 transition-all duration-300 bg-neutral-950/30 flex flex-col justify-between"
            >
              <div className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase flex items-center space-x-2">
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                <span>PREVIOUS MEMORY</span>
              </div>
              <div className="mt-4">
                {previousStory.chapter && (
                  <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase block mb-1">
                    CHAPTER {previousStory.chapter.number} // {previousStory.chapter.title}
                  </span>
                )}
                <h4 className="font-serif text-xl text-neutral-300 group-hover:text-white group-hover:italic transition-colors">
                  {previousStory.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div className="border border-white/5 p-6 opacity-30">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
                BEGINNING OF ARCHIVE
              </span>
            </div>
          )}

          {nextStory ? (
            <Link
              href={`/story/${nextStory.slug}`}
              className="group border border-white/10 hover:border-white/30 p-6 transition-all duration-300 bg-neutral-950/30 flex flex-col justify-between text-right"
            >
              <div className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase flex items-center justify-end space-x-2">
                <span>NEXT MEMORY</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4">
                {nextStory.chapter && (
                  <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase block mb-1">
                    CHAPTER {nextStory.chapter.number} // {nextStory.chapter.title}
                  </span>
                )}
                <h4 className="font-serif text-xl text-neutral-300 group-hover:text-white group-hover:italic transition-colors">
                  {nextStory.title}
                </h4>
              </div>
            </Link>
          ) : (
            <div className="border border-white/5 p-6 opacity-30 text-right">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
                END OF ARCHIVE
              </span>
            </div>
          )}
        </nav>
      </div>
    </article>
  );
}
