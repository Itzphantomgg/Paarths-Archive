import React from "react";
import Link from "next/link";
import { Lock, BookOpen, Key, Shield, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import CinematicHero from "@/components/hero/CinematicHero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  const chaptersOverview = [
    {
      number: "01",
      title: "CHILDHOOD",
      theme: "Before I understood what growing up meant.",
    },
    {
      number: "02",
      title: "GROWING UP",
      theme: "Transitions that occurred without ceremony; the shift of identity.",
    },
    {
      number: "03",
      title: "PEOPLE",
      theme: "Portraits of individuals whose paths crossed mine, leaving quiet marks.",
    },
    {
      number: "04",
      title: "INCIDENTS",
      theme: "Unplanned afternoons and moments when the ordinary turned memorable.",
    },
    {
      number: "05",
      title: "FRAGMENTS",
      theme: "Small observations, sensory details, and unfinished lines.",
    },
    {
      number: "06",
      title: "FICTION",
      theme: "Imagined landscapes and dreams that lingered into daylight.",
    },
    {
      number: "07",
      title: "LETTERS",
      theme: "Words addressed to people across distances and years.",
    },
  ];

  return (
    <div className="w-full bg-[#050505] text-[#EDEDEB]">
      {/* 1. Split Editorial Hero */}
      <CinematicHero isAuthenticated={Boolean(user)} />

      {/* 2. Conceptual Archive Lore & Purpose Section */}
      <section
        id="archive-lore-section"
        className="relative z-10 py-24 sm:py-32 px-6 sm:px-12 border-t border-white/5 bg-[#070707]"
      >
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Section Introduction */}
          <div className="max-w-3xl">
            <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase block mb-4">
              THE PHILOSOPHY OF THE VAULT
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal italic tracking-tight leading-tight mb-6">
              A private digital volume of moments preserved before they fade.
            </h2>
            <p className="font-sans text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
              Paarth&apos;s Archive is not a traditional blog, public storytelling platform, or social feed. It is an intimate autobiographical sanctuary engineered as a digital book. It preserves personal incidents, childhood recollections, quiet observations, and unwritten letters—sealed by default to protect the authenticity and intimacy of memory.
            </p>
          </div>

          {/* Three Archival Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-4">
            
            <div className="p-8 border border-white/10 bg-neutral-950/50 space-y-4">
              <div className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
                PRINCIPLE 01
              </span>
              <h3 className="font-serif text-2xl text-white font-normal italic">
                Private by Default
              </h3>
              <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Every entry is strictly confidential. Stories are never automatically exposed to public discovery, indexers, or feeds.
              </p>
            </div>

            <div className="p-8 border border-white/10 bg-neutral-950/50 space-y-4">
              <div className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
                PRINCIPLE 02
              </span>
              <h3 className="font-serif text-2xl text-white font-normal italic">
                Digital Book Format
              </h3>
              <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Written and styled with classical editorial typography, generous whitespace, and filmic restraint reminiscent of vintage literature.
              </p>
            </div>

            <div className="p-8 border border-white/10 bg-neutral-950/50 space-y-4">
              <div className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-400">
                <Key className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
                PRINCIPLE 03
              </span>
              <h3 className="font-serif text-2xl text-white font-normal italic">
                Private Dispatches
              </h3>
              <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Individual stories may be shared intentionally using secure, cryptographic private keys that the archivist can revoke at any time.
              </p>
            </div>

          </div>

          {/* Chapter Architecture Overview */}
          <div className="pt-12 border-t border-white/10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase block mb-2">
                  THE ARCHITECTURAL VOLUMES
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal italic">
                  Seven Thematic Chapters
                </h3>
              </div>
              <p className="mt-4 sm:mt-0 font-mono text-xs text-neutral-400 tracking-[0.2em] uppercase">
                SEALED INSIDE THE VAULT
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {chaptersOverview.map((ch) => (
                <div
                  key={ch.number}
                  className="p-6 border border-white/5 bg-neutral-950/30 space-y-2.5 hover:border-white/20 transition duration-300"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                    <span>CHAPTER {ch.number}</span>
                    <Lock className="w-3 h-3 text-neutral-400" />
                  </div>
                  <h4 className="font-serif text-xl text-neutral-100 font-normal italic">
                    {ch.title}
                  </h4>
                  <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
                    {ch.theme}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Archivist Access Portal Card */}
          <div className="pt-8">
            <div className="p-8 sm:p-12 border border-white/10 bg-gradient-to-r from-neutral-950 via-neutral-900/40 to-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center sm:text-left">
                <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase block">
                  RESTRICTED ENTRY
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-white font-normal italic">
                  {user ? "Archivist Session Active" : "Archivist Authentication"}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light max-w-md">
                  {user
                    ? `Authenticated as ${user.name}. You may enter your writing studio, organize chapters, and manage memory dispatches.`
                    : "Authorized credentials are required to unlock private writing, draft memories, and manage the personal archive."}
                </p>
              </div>

              <Link
                href={user ? "/admin" : "/login"}
                className="inline-flex items-center space-x-3 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black px-8 py-3.5 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 flex-shrink-0 focus:outline-none"
              >
                <span>{user ? "ENTER STUDIO & ARCHIVE" : "ARCHIVIST SIGN IN"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
