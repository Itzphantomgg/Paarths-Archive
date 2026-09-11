"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#050505] relative z-10 pt-16 pb-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-white italic">
              Paarth&apos;s Archive
            </h3>
            <p className="text-neutral-400 text-sm max-w-md font-light leading-relaxed">
              A private digital archive and memory vault. Stories, reflections,
              incidents, and unfinished fragments preserved against the quiet
              erosion of time.
            </p>
            <div className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase pt-2">
              EST. 2026 // PERSONAL ARCHIVE // EDITION NO. 01
            </div>
          </div>

          {/* Chapters Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
              Chapters
            </div>
            <ul className="space-y-2 text-xs font-mono tracking-[0.18em] text-neutral-400">
              <li>
                <Link href="/chapter/childhood" className="hover:text-white transition">
                  01 Childhood
                </Link>
              </li>
              <li>
                <Link href="/chapter/growing-up" className="hover:text-white transition">
                  02 Growing Up
                </Link>
              </li>
              <li>
                <Link href="/chapter/people" className="hover:text-white transition">
                  03 People
                </Link>
              </li>
              <li>
                <Link href="/chapter/incidents" className="hover:text-white transition">
                  04 Incidents
                </Link>
              </li>
              <li>
                <Link href="/chapter/fragments" className="hover:text-white transition">
                  05 Fragments
                </Link>
              </li>
              <li>
                <Link href="/chapter/fiction" className="hover:text-white transition">
                  06 Fiction
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access & Studio */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
              The Vault
            </div>
            <ul className="space-y-2 text-xs font-mono tracking-[0.18em] text-neutral-400">
              <li>
                <Link href="/archive" className="hover:text-white transition">
                  All Stories
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Search Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About the Vault
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/login"
                  className="text-neutral-300 hover:text-white transition inline-flex items-center space-x-1 border-b border-neutral-700 hover:border-white pb-0.5"
                >
                  <span>Enter Private Studio &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-[0.2em] text-neutral-400 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} PAARTH&apos;S ARCHIVE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-6">
            <span>FILM-FIRST NARRATIVE VAULT</span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 text-neutral-400 hover:text-white transition"
              aria-label="Scroll back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
