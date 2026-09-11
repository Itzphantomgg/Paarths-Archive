import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import StoryCard from "@/components/story/StoryCard";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { slug } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    select: { title: true, subtitle: true },
  });

  if (!chapter) return { title: "Chapter Not Found // Paarth's Archive" };

  return {
    title: `Chapter ${chapter.title} // Paarth's Archive`,
    description: chapter.subtitle || "A curated chapter of memories.",
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    include: {
      stories: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: [{ year: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  const formattedNumber = String(chapter.number).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back navigation */}
        <div className="mb-12 border-b border-white/10 pb-6">
          <Link
            href="/archive"
            className="group inline-flex items-center space-x-2 font-mono text-[11px] tracking-[0.25em] text-neutral-400 hover:text-white uppercase transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO ARCHIVE INDEX</span>
          </Link>
        </div>

        {/* Chapter Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20 border-b border-white/10 pb-16">
          <div className="lg:col-span-8 space-y-6">
            <span className="font-serif text-5xl sm:text-7xl md:text-8xl text-neutral-400 font-light block">
              {formattedNumber}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white italic">
              {chapter.title}
            </h1>
            {chapter.subtitle && (
              <p className="font-serif text-xl sm:text-2xl text-neutral-300 italic font-light max-w-2xl">
                &ldquo;{chapter.subtitle}&rdquo;
              </p>
            )}
            {chapter.description && (
              <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl leading-relaxed">
                {chapter.description}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 text-left lg:text-right font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase space-y-2">
            <div>TOTAL ENTRIES: {chapter.stories.length}</div>
            <div>STATUS: PRESERVED IN VAULT</div>
          </div>
        </div>

        {/* Stories in this Chapter */}
        {chapter.stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapter.stories.map((story, idx) => (
              <StoryCard
                key={story.id}
                story={{
                  ...story,
                  chapter: {
                    number: chapter.number,
                    title: chapter.title,
                    slug: chapter.slug,
                  },
                }}
                layout="asymmetric"
                index={idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 p-16 text-center bg-neutral-950/40">
            <p className="font-serif text-2xl text-neutral-400 italic">
              This chapter holds silent fragments that are still being recalled.
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-neutral-600 uppercase mt-4">
              NO PUBLIC MEMORIES PUBLISHED YET
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
