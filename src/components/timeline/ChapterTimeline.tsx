"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ChapterItem {
  id: string;
  number: number;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  coverImage: string | null;
  _count?: { stories: number };
}

interface ChapterTimelineProps {
  chapters: ChapterItem[];
}

export default function ChapterTimeline({ chapters }: ChapterTimelineProps) {
  const [activeHoverImage, setActiveHoverImage] = useState<string | null>(
    chapters[0]?.coverImage || null
  );

  return (
    <section id="the-archive-section" className="relative py-28 sm:py-36 bg-[#050505] text-[#ededeb] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="mb-20 sm:mb-28 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-10">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block mb-3">
              CHAPTERS // CLASSIFICATION
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white italic">
              The Archive
            </h2>
          </div>
          <div className="mt-6 md:mt-0 max-w-sm text-right">
            <p className="font-serif text-lg sm:text-xl text-neutral-300 italic font-light">
              &ldquo;Some memories have dates. Some only have a feeling.&rdquo;
            </p>
            <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mt-2 block">
              {chapters.length} CHAPTERS PRESERVED
            </span>
          </div>
        </div>

        {/* Vertical Timeline & Editorial Rows */}
        <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
          {chapters.map((chapter) => {
            const formattedNumber = String(chapter.number).padStart(2, "0");

            return (
              <div
                key={chapter.id}
                onMouseEnter={() => chapter.coverImage && setActiveHoverImage(chapter.coverImage)}
                className="group relative transition-colors duration-500 hover:bg-neutral-900/30"
              >
                <Link
                  href={`/chapter/${chapter.slug}`}
                  className="py-10 sm:py-14 px-4 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 block"
                >
                  {/* Left: Number + Title */}
                  <div className="flex items-baseline space-x-6 sm:space-x-12">
                    <span className="font-serif text-3xl sm:text-5xl md:text-6xl text-neutral-400 group-hover:text-white transition-colors duration-500 font-light">
                      {formattedNumber}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-neutral-200 group-hover:text-white group-hover:italic transition-all duration-500 font-normal">
                        {chapter.title}
                      </h3>
                      {chapter.subtitle && (
                        <p className="text-sm sm:text-base text-neutral-400 font-serif italic mt-2">
                          &ldquo;{chapter.subtitle}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Description (Truncated/Subtle) */}
                  <div className="lg:max-w-md text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {chapter.description}
                  </div>

                  {/* Right: Meta & Arrow */}
                  <div className="flex items-center justify-between lg:justify-end space-x-6">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
                      {chapter._count?.stories ?? 0} {chapter._count?.stories === 1 ? "MEMORY" : "MEMORIES"}
                    </span>
                    <div className="w-9 h-9 rounded-full border border-neutral-800 group-hover:border-white/60 flex items-center justify-center transition-all duration-300 bg-black/40">
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
