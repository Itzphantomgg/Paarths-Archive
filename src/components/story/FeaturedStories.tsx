import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StoryCard, { StoryCardData } from "./StoryCard";

interface FeaturedStoriesProps {
  stories: StoryCardData[];
}

export default function FeaturedStories({ stories }: FeaturedStoriesProps) {
  if (!stories || stories.length === 0) return null;

  const leadStory = stories[0];
  const secondaryStories = stories.slice(1);

  return (
    <section className="py-28 sm:py-36 bg-[#050505] text-[#ededeb] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block mb-3">
              SELECTED CHRONICLES // CURATED
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white italic">
              Featured Stories
            </h2>
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              href="/archive"
              className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition pb-1 border-b border-neutral-700 hover:border-white"
            >
              <span>EXPLORE ALL CHRONICLES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Lead Story: Wide Panoramic Editorial Card */}
        {leadStory && (
          <div className="mb-12">
            <StoryCard story={leadStory} layout="wide" index={1} />
          </div>
        )}

        {/* Secondary Stories: 2 or 3 column Asymmetrical Editorial Grid */}
        {secondaryStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryStories.map((story, idx) => (
              <StoryCard
                key={story.id}
                story={story}
                layout="asymmetric"
                index={idx + 2}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-20 border border-white/10 p-10 sm:p-14 text-center bg-neutral-950/50 flex flex-col items-center">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
            IMMERSIVE READING
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-white italic mt-3 mb-4 max-w-xl">
            &ldquo;We tell ourselves stories in order to live.&rdquo;
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-light mb-8">
            Every entry in this archive is preserved with its original sensory notes, approximate time, and emotional coordinates.
          </p>
          <Link
            href="/archive"
            className="rounded-full border border-neutral-700 hover:border-white text-neutral-300 hover:text-white px-8 py-3 text-xs font-mono tracking-[0.25em] uppercase transition bg-black/40 hover:bg-neutral-900/60"
          >
            ENTER COMPLETE ARCHIVE &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
