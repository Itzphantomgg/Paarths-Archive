import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import StoryCard from "@/components/story/StoryCard";
import { getCurrentUser } from "@/lib/auth";

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
  const user = await getCurrentUser();

  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    include: user
      ? {
          stories: {
            where: {
              authorId: user.id,
            },
            orderBy: [{ year: "asc" }, { createdAt: "asc" }],
          },
        }
      : undefined,
  });

  if (!chapter) {
    notFound();
  }

  const formattedNumber = String(chapter.number).padStart(2, "0");
  const stories = (chapter as any).stories || [];

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back navigation */}
        <div className="mb-12 border-b border-white/10 pb-6 flex items-center justify-between">
          <Link
            href={user ? "/admin" : "/archive"}
            className="group inline-flex items-center space-x-2 font-mono text-[11px] tracking-[0.25em] text-neutral-400 hover:text-white uppercase transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{user ? "RETURN TO MY ARCHIVE" : "RETURN TO ARCHIVE INDEX"}</span>
          </Link>
          <div className="flex items-center space-x-2 font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            <Lock className="w-3 h-3 text-neutral-400" />
            <span>PRIVATE VOLUME</span>
          </div>
        </div>

        {/* Chapter Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-12 border-b border-white/10">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block">
              VOLUME {formattedNumber}
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white italic">
              {chapter.title}
            </h1>
            {chapter.subtitle && (
              <p className="font-serif text-xl sm:text-2xl text-neutral-300 italic font-light">
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
            <div>ACCESS: RESTRICTED</div>
            <div>STATUS: SEALED IN VAULT</div>
          </div>
        </div>

        {/* Content: If Authenticated, show stories. If Unauthenticated, show privacy card. */}
        {user ? (
          stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story: any, idx: number) => (
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
            <div className="border border-white/10 p-16 text-center bg-neutral-950/40 space-y-4">
              <p className="font-serif text-2xl text-neutral-400 italic">
                No memories recorded in this chapter yet.
              </p>
              <Link
                href={`/admin/editor?chapterId=${chapter.id}`}
                className="inline-block font-mono text-xs tracking-[0.2em] text-neutral-300 hover:text-white uppercase border-b border-white/30 pb-1"
              >
                Write First Story for Chapter {formattedNumber} &rarr;
              </Link>
            </div>
          )
        ) : (
          <div className="border border-white/10 p-12 sm:p-16 text-center bg-neutral-950/50 max-w-2xl mx-auto space-y-6">
            <div className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 flex items-center justify-center mx-auto text-neutral-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-3xl text-white font-normal italic">
              Chapter Sealed
            </h3>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
              Memories collected inside Chapter {formattedNumber} are confidential to the personal archive. Sign in with archivist credentials to open this volume.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.25em] text-white uppercase border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition duration-300"
              >
                <span>Archivist Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
