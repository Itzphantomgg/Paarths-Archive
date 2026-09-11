"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Lock } from "lucide-react";

interface CinematicHeroProps {
  isAuthenticated?: boolean;
}

export default function CinematicHero({ isAuthenticated = false }: CinematicHeroProps) {
  const [animationStage, setAnimationStage] = useState(0);

  // Cinematic opening choreography: 6 deliberate stages
  useEffect(() => {
    // Stage 1: Initial dark canvas & archival metadata
    const t1 = setTimeout(() => setAnimationStage(1), 300);
    // Stage 2: Atmosphere & subtle dark vignette reveal
    const t2 = setTimeout(() => setAnimationStage(2), 800);
    // Stage 3: Left-side grand serif title sharpens into focus
    const t3 = setTimeout(() => setAnimationStage(3), 1500);
    // Stage 4: Right-side lore quote & narrative description fade in
    const t4 = setTimeout(() => setAnimationStage(4), 2200);
    // Stage 5: Metadata taglines appear
    const t5 = setTimeout(() => setAnimationStage(5), 2900);
    // Stage 6: Enter Archive CTA button emerges
    const t6 = setTimeout(() => setAnimationStage(6), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  const scrollToLore = () => {
    const loreEl = document.getElementById("archive-lore-section");
    if (loreEl) {
      loreEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ctaDestination = isAuthenticated ? "/admin" : "/login";

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#050505] text-[#EDEDEB] select-none pt-28 pb-10 px-6 sm:px-12">
      {/* 1. Dark Atmospheric Background (Zero Gaming / Controller Imagery) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2800ms] ease-out pointer-events-none ${
          animationStage >= 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Deep layered gradients creating filmic vignette & atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#050505] to-[#040404]" />
        
        {/* Soft center spotlight glow */}
        <div className="absolute inset-0 center-spotlight opacity-50" />
        
        {/* Delicate radial shadows */}
        <div className="absolute inset-0 cinematic-vignette opacity-80" />

        {/* Minimal geometric frame lines for editorial book structure */}
        <div className="absolute inset-x-6 sm:inset-x-12 top-24 bottom-12 border-x border-white/[0.03] pointer-events-none" />
      </div>

      {/* 2. Top Archival Metadata Row */}
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-neutral-500 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase transition-all duration-1000 ${
          animationStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span>PERSONAL ARCHIVE</span>
          <span className="text-neutral-700">//</span>
          <span>EST. 2026</span>
          <span className="text-neutral-700">//</span>
          <span className="text-neutral-400">RESTRICTED VAULT</span>
        </div>
        <div className="mt-2 sm:mt-0 text-neutral-500 hidden sm:block">
          AN AUTOBIOGRAPHICAL COLLECTION OF MEMORIES
        </div>
      </div>

      {/* 3. Split Editorial Composition (Left: Grand Title | Right: Lore & CTA) */}
      <div className="relative z-10 my-auto py-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT SIDE: Large Primary Title */}
          <div
            className={`lg:col-span-7 transition-all duration-[1800ms] ease-out ${
              animationStage >= 3
                ? "opacity-100 filter-none translate-y-0"
                : "opacity-0 blur-sm translate-y-6"
            }`}
          >
            <div className="inline-block font-mono text-[9px] tracking-[0.35em] text-neutral-400 uppercase mb-4 pl-1">
              VOL. I &mdash; CHRONICLES &amp; REFLECTIONS
            </div>
            
            <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] tracking-tight text-white font-normal leading-[0.88] drop-shadow-2xl">
              <span className="italic block">Paarth&apos;s</span>
              <span className="not-italic block tracking-[-0.03em] text-white/95 mt-1 sm:mt-2">
                Archive
              </span>
            </h1>

            <div className="mt-6 flex items-center space-x-3 font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase pl-1">
              <Lock className="w-3 h-3 text-neutral-400" />
              <span>PRIVATE DIGITAL SANCTUARY</span>
            </div>
          </div>

          {/* RIGHT SIDE: The Lore / Supporting Copy / Metadata / CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pl-6 lg:border-l lg:border-white/10 space-y-7">
            
            {/* Lore Quote & Narrative Introduction */}
            <div
              className={`transition-all duration-[1400ms] ease-out space-y-4 ${
                animationStage >= 4
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-neutral-200 font-light italic leading-snug">
                &ldquo;Stories, memories and fragments worth remembering.&rdquo;
              </p>
              
              <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
                A private digital sanctuary for personal recollections, quiet reflections, and life experiences. Crafted as an autobiography and personal book of memory—closed by default to preserve the intimacy of the written word.
              </p>
            </div>

            {/* Archival Taglines */}
            <div
              className={`pt-2 transition-all duration-1000 ${
                animationStage >= 5 ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 font-mono text-[10px] tracking-[0.24em] text-neutral-400 uppercase">
                <span>MONOCHROME NARRATIVE</span>
                <span className="text-neutral-700">//</span>
                <span>PRIVATE DISPATCHES</span>
                <span className="text-neutral-700">//</span>
                <span>MEMORIES PRESERVED</span>
              </div>
            </div>

            {/* Subtle Pill CTA */}
            <div
              className={`pt-3 transition-all duration-1000 ${
                animationStage >= 6
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                href={ctaDestination}
                className="group relative inline-flex items-center space-x-3 rounded-full border border-neutral-700/90 bg-neutral-950/60 backdrop-blur-md px-8 py-3.5 text-xs font-mono tracking-[0.25em] text-neutral-200 uppercase transition-all duration-500 hover:border-white hover:text-white hover:bg-neutral-900/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] focus:outline-none"
              >
                <span>ENTER ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-neutral-400 group-hover:text-white" />
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Bottom Row */}
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-neutral-400 uppercase transition-all duration-1000 ${
          animationStage >= 6 ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={scrollToLore}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition group focus:outline-none"
        >
          <ArrowDown className="w-3 h-3 text-neutral-400 group-hover:text-white group-hover:translate-y-0.5 transition" />
          <span>ABOUT THE ARCHIVE</span>
        </button>
        <div className="hidden sm:block text-neutral-400">
          AUTOBIOGRAPHICAL VAULT // PRIVATE EDITION
        </div>
      </div>
    </section>
  );
}
