import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About the Archive // Paarth's Archive",
  description: "This isn't a biography. It's a collection of things worth remembering.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b border-white/10 pb-12">
          <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block mb-3">
            MANIFESTO // INTENT
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-white italic">
            About the Archive
          </h1>
          <p className="font-serif text-2xl sm:text-3xl text-neutral-300 italic font-light mt-6 max-w-2xl leading-relaxed">
            &ldquo;This isn&apos;t a biography. It&apos;s a collection of things worth remembering.&rdquo;
          </p>
        </div>

        {/* Featured Atmospheric Still */}
        <div className="my-12 overflow-hidden border border-white/10 relative aspect-[21/9] bg-neutral-900">
          <Image
            src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1600&auto=format&fit=crop"
            alt="Misty landscape still"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover filter grayscale contrast-125 brightness-80"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          <div className="absolute bottom-3 right-4 font-mono text-[9px] tracking-[0.25em] text-white/50 uppercase">
            ARCHIVAL MONOCHROME STILL // 35MM GRAIN
          </div>
        </div>

        {/* Manifesto Content */}
        <div className="space-y-8 font-serif text-lg sm:text-xl text-neutral-300 font-light leading-relaxed my-12 max-w-2xl">
          <p className="drop-cap">
            Most of what happens to us slips away like water through cupped fingers. We remember the dates of exams, the addresses of temporary apartments, and the passwords to accounts we haven&apos;t used in years. But the exact texture of an afternoon in late October—the way the shadows stretched across the brick terrace, or the smell of woodsmoke drifting from a neighbor&apos;s chimney—simply evaporates.
          </p>

          <p>
            This website is an intentional act of resistance against that quiet erosion. It is neither a public blog designed for engagement nor a formal autobiography meant to claim importance. It is a quiet, cinematic chamber where moments are preserved with their original gravity.
          </p>

          <blockquote className="my-10 pl-6 border-l border-white/40 italic font-serif text-2xl text-white font-normal leading-relaxed">
            &ldquo;We don&apos;t write to be noticed; we write so that when we look back across the years, the person standing there isn&apos;t a complete stranger.&rdquo;
          </blockquote>

          <h2 className="font-serif text-2xl sm:text-3xl text-white italic pt-6">
            The Principles of This Vault
          </h2>

          <ul className="space-y-4 font-sans text-sm text-neutral-400 leading-relaxed pt-2">
            <li className="flex items-start space-x-3">
              <span className="font-mono text-neutral-400 text-xs mt-0.5">01</span>
              <div>
                <strong className="text-neutral-200">Emotional Accuracy Over Factual Precision:</strong> Some memories have lost their calendar dates. If a memory only exists as a feeling, it is recorded as a feeling.
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-mono text-neutral-400 text-xs mt-0.5">02</span>
              <div>
                <strong className="text-neutral-200">Cinematic Restraint:</strong> No bright advertisements, no algorithmic feeds, no vanity metrics. Every page is crafted with the contemplative pacing of an art film.
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-mono text-neutral-400 text-xs mt-0.5">03</span>
              <div>
                <strong className="text-neutral-200">Fragments Are Welcome:</strong> Not every story has a resolution. Unfinished thoughts, unsent letters, and half-remembered conversations hold as much truth as complete memoirs.
              </div>
            </li>
          </ul>

          <p className="pt-6">
            Thank you for stepping quietly into this archive. Take your time, read slowly, and perhaps recall a memory of your own that deserves to be preserved.
          </p>
        </div>

        {/* CTA to explore stories */}
        <div className="pt-12 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/archive"
            className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.25em] text-neutral-300 hover:text-white uppercase transition pb-1 border-b border-neutral-700 hover:border-white"
          >
            <span>ENTER THE ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            EST. 2026 // PAARTH
          </span>
        </div>
      </div>
    </div>
  );
}
