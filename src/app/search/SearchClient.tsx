"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import StoryCard from "@/components/story/StoryCard";

interface SearchClientProps {
  initialQuery: string;
  initialResults: any[];
}

export default function SearchClient({ initialQuery, initialResults }: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/search");
  };

  const sampleKeywords = [
    "Cantonment",
    "Platform 4",
    "Master Ismail",
    "Attic",
    "Blue Gate",
    "Lighthouse",
    "Monsoon",
    "Cassette",
  ];

  return (
    <div className="space-y-12">
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center border-b border-white/20 focus-within:border-white transition-colors py-4">
          <Search className="w-5 h-5 text-neutral-400 mr-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a place, person, keyword, or feeling..."
            className="w-full bg-transparent font-serif text-2xl sm:text-3xl text-white placeholder-neutral-500 focus:outline-none italic"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-neutral-400 hover:text-white transition mr-3"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="font-mono text-xs tracking-[0.25em] text-neutral-300 hover:text-white uppercase px-4 py-2 border border-neutral-700 hover:border-white rounded-full transition bg-neutral-900/40"
          >
            SEARCH
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mr-1">
            EXPLORE SUGGESTIONS:
          </span>
          {sampleKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setQuery(kw);
                router.push(`/search?q=${encodeURIComponent(kw)}`);
              }}
              className="font-mono text-[10px] tracking-[0.18em] text-neutral-400 hover:text-white px-2 py-0.5 border border-white/10 hover:border-white/30 rounded transition"
            >
              {kw}
            </button>
          ))}
        </div>
      </form>

      {/* Results Header */}
      {initialQuery && (
        <div className="flex items-center justify-between font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase pt-4 border-t border-white/5">
          <span>
            SEARCH RESULTS FOR &ldquo;{initialQuery}&rdquo;
          </span>
          <span>{initialResults.length} {initialResults.length === 1 ? "MATCH" : "MATCHES"} FOUND</span>
        </div>
      )}

      {/* Results Listing */}
      {initialQuery ? (
        initialResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialResults.map((story, idx) => (
              <StoryCard
                key={story.id}
                story={story}
                layout="asymmetric"
                index={idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 p-16 text-center bg-neutral-950/40">
            <p className="font-serif text-2xl text-neutral-400 italic">
              No memories were found matching &ldquo;{initialQuery}&rdquo;.
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase mt-4">
              TRY SEARCHING FOR A CHAPTER NAME, LOCATION, OR MOOD
            </p>
          </div>
        )
      ) : (
        <div className="border border-white/5 p-16 text-center bg-neutral-950/20">
          <p className="font-serif text-2xl text-neutral-400 italic">
            Enter a search term above to sift through the digital vault.
          </p>
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block mt-3">
            QUERY ACROSS TITLES, TEXT, TAGS & DATES
          </span>
        </div>
      )}
    </div>
  );
}
