import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatStoryDate } from "@/lib/utils";

export interface StoryCardData {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  coverImage: string | null;
  storyType: string;
  year: number | null;
  approximateDate: string | null;
  exactDate: Date | string | null;
  location: string | null;
  readingTimeMinutes: number;
  chapter?: {
    number: number;
    title: string;
    slug: string;
  } | null;
}

interface StoryCardProps {
  story: StoryCardData;
  layout?: "asymmetric" | "horizontal" | "wide";
  index?: number;
}

export default function StoryCard({ story, layout = "asymmetric", index = 1 }: StoryCardProps) {
  const dateString = formatStoryDate(story);
  const memoryNumber = String(index).padStart(2, "0");

  if (layout === "wide") {
    return (
      <article className="group border border-white/10 hover:border-white/30 transition-all duration-700 bg-neutral-950/40 p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              <span>MEMORY {memoryNumber}</span>
              <span className="text-neutral-700">//</span>
              <span>{dateString}</span>
              {story.location && (
                <>
                  <span className="text-neutral-700">//</span>
                  <span>{story.location}</span>
                </>
              )}
            </div>

            <h3 className="font-serif text-3xl sm:text-5xl text-white font-normal group-hover:italic transition-all duration-500 leading-tight">
              <Link href={`/story/${story.slug}`}>{story.title}</Link>
            </h3>

            {story.subtitle && (
              <p className="font-serif text-base sm:text-lg text-neutral-300 italic font-light">
                &ldquo;{story.subtitle}&rdquo;
              </p>
            )}

            {story.excerpt && (
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-xl">
                {story.excerpt}
              </p>
            )}

            <div className="pt-2">
              <Link
                href={`/story/${story.slug}`}
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.2em] text-neutral-300 group-hover:text-white uppercase transition pb-1 border-b border-neutral-700 group-hover:border-white"
              >
                <span>READ STORY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Cinematic Grayscale Image */}
          {story.coverImage && (
            <div className="lg:col-span-6 overflow-hidden border border-white/5 relative aspect-[16/10] bg-neutral-900">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            </div>
          )}
        </div>
      </article>
    );
  }

  // Asymmetric Editorial Card
  return (
    <article className="group border border-white/10 hover:border-white/30 transition-all duration-700 bg-neutral-950/40 p-6 sm:p-8 flex flex-col justify-between">
      <div>
        {/* Memory Metadata */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase pb-6 border-b border-white/5">
          <span>MEMORY {memoryNumber}</span>
          <span>{dateString}</span>
        </div>

        {/* Cover Photo if available */}
        {story.coverImage && (
          <div className="mt-6 mb-6 overflow-hidden border border-white/5 relative aspect-[16/9] bg-neutral-900">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover filter grayscale contrast-125 brightness-85 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        )}

        {/* Title & Quote */}
        <div className="space-y-4 pt-2">
          {story.chapter && (
            <span className="inline-block font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase">
              CHAPTER {String(story.chapter.number).padStart(2, "0")} // {story.chapter.title}
            </span>
          )}

          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:italic transition-all duration-500 leading-snug">
            <Link href={`/story/${story.slug}`}>{story.title}</Link>
          </h3>

          {story.subtitle && (
            <p className="font-serif text-sm sm:text-base text-neutral-300 italic font-light leading-relaxed">
              &ldquo;{story.subtitle}&rdquo;
            </p>
          )}

          {story.excerpt && (
            <p className="text-xs text-neutral-400 font-light line-clamp-3 leading-relaxed">
              {story.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-8 mt-6 border-t border-white/5 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 uppercase">
          {story.readingTimeMinutes} MIN READ
        </span>
        <Link
          href={`/story/${story.slug}`}
          className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.2em] text-neutral-300 group-hover:text-white uppercase transition"
        >
          <span>READ STORY</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
