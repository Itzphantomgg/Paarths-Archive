import React from "react";
import { prisma } from "@/lib/db";
import SearchClient from "./SearchClient";

import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search the Archive // Paarth's Archive",
  description: "Search across memories, people, places, and fragments.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-36 pb-24 px-6 sm:px-12 flex items-center justify-center">
        <div className="max-w-md w-full border border-white/10 bg-neutral-950/50 p-10 text-center space-y-6">
          <div className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/80 flex items-center justify-center mx-auto text-neutral-400">
            <Lock className="w-4 h-4" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
            INDEX LOCKED
          </span>
          <h2 className="font-serif text-3xl text-white font-normal italic">
            Private Vault Search
          </h2>
          <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
            Archive searches query confidential memories and unwritten letters. Sign in with archivist credentials to query the vault.
          </p>
          <div className="pt-2">
            <Link
              href="/login?redirect=/search"
              className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.25em] text-white uppercase border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition duration-300"
            >
              <span>Sign In to Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let results: any[] = [];

  if (query) {
    results = await prisma.story.findMany({
      where: {
        authorId: user.id,
        OR: [
          { title: { contains: query } },
          { subtitle: { contains: query } },
          { content: { contains: query } },
          { location: { contains: query } },
          { peopleInvolved: { contains: query } },
          { mood: { contains: query } },
          {
            chapter: {
              title: { contains: query },
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: { contains: query },
                },
              },
            },
          },
        ],
      },
      include: {
        chapter: {
          select: {
            number: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { year: "desc" },
    });
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <span className="font-mono text-xs tracking-[0.3em] text-neutral-400 uppercase block mb-3">
            VAULT REPOSITORY // INDEX QUERY
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white italic">
            Search Archive
          </h1>
          <p className="font-serif text-lg text-neutral-300 italic mt-3">
            Search across story titles, locations, people, time periods, and fragments.
          </p>
        </div>

        {/* Search Input & Dynamic Results */}
        <SearchClient initialQuery={query} initialResults={results} />
      </div>
    </div>
  );
}
