"use client";

import React, { useState, useMemo } from "react";
import StoryCard, { StoryCardData } from "@/components/story/StoryCard";

interface ChapterOption {
  id: string;
  title: string;
  slug: string;
  number: number;
}

interface ArchiveExplorerProps {
  chapters: ChapterOption[];
  initialStories: any[];
}

export default function ArchiveExplorer({ chapters, initialStories }: ArchiveExplorerProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const storyTypes = [
    { label: "ALL TYPES", value: "all" },
    { label: "CHILDHOOD", value: "CHILDHOOD" },
    { label: "GROWING UP", value: "GROWING_UP" },
    { label: "INCIDENT", value: "INCIDENT" },
    { label: "PEOPLE", value: "PEOPLE" },
    { label: "FRAGMENT", value: "FRAGMENT" },
    { label: "FICTION", value: "FICTION" },
    { label: "LETTER", value: "LETTER" },
  ];

  const filteredStories = useMemo(() => {
    let result = [...initialStories];

    if (selectedChapter !== "all") {
      result = result.filter((s) => s.chapter?.slug === selectedChapter);
    }

    if (selectedType !== "all") {
      result = result.filter((s) => s.storyType === selectedType);
    }

    result.sort((a, b) => {
      const yearA = a.year || 9999;
      const yearB = b.year || 9999;
      return sortOrder === "asc" ? yearA - yearB : yearB - yearA;
    });

    return result;
  }, [initialStories, selectedChapter, selectedType, sortOrder]);

  return (
    <div>
      {/* Chapter Filter Tabs */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar border-b border-white/10 mb-8">
        <button
          onClick={() => setSelectedChapter("all")}
          className={`font-mono text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition whitespace-nowrap ${
            selectedChapter === "all"
              ? "border-white bg-white text-black font-medium"
              : "border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
          }`}
        >
          ALL CHAPTERS
        </button>
        {chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChapter(ch.slug)}
            className={`font-mono text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition whitespace-nowrap ${
              selectedChapter === ch.slug
                ? "border-white bg-white text-black font-medium"
                : "border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
            }`}
          >
            {String(ch.number).padStart(2, "0")} {ch.title}
          </button>
        ))}
      </div>

      {/* Sub-Filters: Story Type & Chronology Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mr-2">
            TYPE:
          </span>
          {storyTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded transition ${
                selectedType === type.value
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
          <span>SORT:</span>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="text-neutral-300 hover:text-white transition underline underline-offset-4"
          >
            {sortOrder === "asc" ? "OLDEST FIRST (2007 →)" : "NEWEST FIRST (2026 →)"}
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, idx) => (
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
            No memories match the selected filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedChapter("all");
              setSelectedType("all");
            }}
            className="mt-6 font-mono text-xs tracking-[0.2em] text-white uppercase border-b border-white pb-1"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
