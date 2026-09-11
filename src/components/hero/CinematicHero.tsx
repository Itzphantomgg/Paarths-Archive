"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function CinematicHero() {
  const [animationStage, setAnimationStage] = useState(0);

  // Cinematic opening choreography
  useEffect(() => {
    // Stage 1: Subtle metadata fades in
    const t1 = setTimeout(() => setAnimationStage(1), 400);
    // Stage 2: Background image gradually reveals with low contrast
    const t2 = setTimeout(() => setAnimationStage(2), 900);
    // Stage 3: Large serif title slowly sharpens into focus
    const t3 = setTimeout(() => setAnimationStage(3), 1600);
    // Stage 4: Subtitle and narrative tags fade in
    const t4 = setTimeout(() => setAnimationStage(4), 2400);
    // Stage 5: Pill CTA appears last
    const t5 = setTimeout(() => setAnimationStage(5), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const scrollToArchive = () => {
    const archiveEl = document.getElementById("the-archive-section");
    if (archiveEl) {
      archiveEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#050505] text-[#EDEDEB] select-none pt-28 pb-12 px-6 sm:px-12">
      {/* Background Grayscale Film Photograph with slow Ken Burns effect */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2600ms] ease-out pointer-events-none ${
          animationStage >= 2 ? "opacity-35" : "opacity-0"
        }`}
      >
        <div
          className="w-full h-full bg-cover bg-center filter grayscale contrast-125 brightness-75 scale-105 animate-ken-burns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2400&auto=format&fit=crop')",
          }}
        />
        {/* Soft Radial Vignette & Center Highlight (inspired by reference image) */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 center-spotlight" />
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      {/* Top Metadata Row */}
      <div
        className={`relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between text-neutral-500 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase transition-all duration-1000 ${
          animationStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span>PERSONAL ARCHIVE</span>
          <span className="text-neutral-700">//</span>
          <span>EST. 2026</span>
        </div>
        <div className="mt-2 sm:mt-0 text-neutral-400 hidden sm:block">
          AN OLD COLLECTION OF PRESERVED MEMORIES
        </div>
      </div>

      {/* Center Hero Block: Grand Typography inspired by Reference Image */}
      <div className="relative z-10 my-auto py-16 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Large Serif Title */}
        <div
          className={`transition-all duration-[1800ms] ease-out ${
            animationStage >= 3
              ? "opacity-100 filter-none translate-y-0"
              : "opacity-0 blur-sm translate-y-6"
          }`}
        >
          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] tracking-tight text-white font-normal italic leading-[0.9] drop-shadow-2xl">
            Paarth&apos;s
            <span className="block not-italic font-normal tracking-[-0.03em] text-white/95 mt-1 sm:mt-2">
              Archive
            </span>
          </h1>
        </div>

        {/* Narrative Subtitle */}
        <div
          className={`mt-8 sm:mt-10 max-w-2xl transition-all duration-[1400ms] ease-out ${
            animationStage >= 4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-serif text-lg sm:text-2xl text-neutral-300 font-light italic tracking-wide">
            &ldquo;Stories, memories and fragments worth remembering.&rdquo;
          </p>
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-neutral-400 uppercase mt-4 max-w-lg mx-auto leading-relaxed">
            A collection of things I remember, things I experienced, and things I never want to forget.
          </p>
        </div>

        {/* Metadata Dividers inspired directly by the reference image */}
        <div
          className={`mt-7 hidden sm:flex items-center space-x-3 font-mono text-[10px] tracking-[0.26em] text-neutral-400 uppercase transition-all duration-1000 ${
            animationStage >= 4 ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>MONOCHROME NARRATIVE</span>
          <span className="text-neutral-700">//</span>
          <span>SILENT DISPATCHES</span>
          <span className="text-neutral-700">//</span>
          <span>FILM-FIRST PACING</span>
        </div>

        {/* CTA Button: Pill-shaped with subtle glow, inspired by reference image */}
        <div
          className={`mt-10 sm:mt-12 transition-all duration-1000 ${
            animationStage >= 5
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={scrollToArchive}
            className="group relative inline-flex items-center space-x-3 rounded-full border border-neutral-700/90 bg-neutral-950/60 backdrop-blur-md px-8 py-3.5 text-xs font-mono tracking-[0.25em] text-neutral-300 uppercase transition-all duration-500 hover:border-white hover:text-white hover:bg-neutral-900/80 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] focus:outline-none"
          >
            <span>ENTER ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        className={`relative z-10 w-full flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-neutral-400 uppercase transition-all duration-1000 ${
          animationStage >= 5 ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={scrollToArchive}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition group"
        >
          <ArrowDown className="w-3 h-3 text-neutral-400 group-hover:text-white group-hover:translate-y-0.5 transition" />
          <span>SCROLL TO EXPLORE</span>
        </button>
        <div className="hidden sm:block text-neutral-400">
          AUTOBIOGRAPHICAL VAULT // VOLUME I
        </div>
      </div>
    </section>
  );
}
