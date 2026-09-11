import React from "react";
import { prisma } from "@/lib/db";
import SearchClient from "./SearchClient";

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
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  let results: any[] = [];

  if (query) {
    results = await prisma.story.findMany({
      where: {
        status: "PUBLISHED",
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
