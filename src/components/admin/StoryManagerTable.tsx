"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Eye, ToggleLeft, ToggleRight, Search, Plus } from "lucide-react";
import { formatStoryDate } from "@/lib/utils";

interface StoryItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  status: string;
  storyType: string;
  year: number | null;
  approximateDate: string | null;
  exactDate: Date | string | null;
  readingTimeMinutes: number;
  chapter?: {
    id: string;
    title: string;
    number: number;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface StoryManagerTableProps {
  initialStories: StoryItem[];
  filterStatus?: "ALL" | "DRAFT" | "PUBLISHED";
}

export default function StoryManagerTable({
  initialStories,
  filterStatus = "ALL",
}: StoryManagerTableProps) {
  const [stories, setStories] = useState<StoryItem[]>(initialStories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleToggleStatus = async (story: StoryItem) => {
    const newStatus = story.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      const res = await fetch(`/api/stories/${story.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStories((prev) =>
          prev.map((s) => (s.id === story.id ? { ...s, status: newStatus } : s))
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to erase "${title}" from the archive?`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete story:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredStories = stories.filter((story) => {
    if (filterStatus === "DRAFT" && story.status !== "DRAFT") return false;
    if (filterStatus === "PUBLISHED" && story.status !== "PUBLISHED") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = story.title.toLowerCase().includes(q);
      const matchesChapter = story.chapter?.title.toLowerCase().includes(q);
      const matchesType = story.storyType.toLowerCase().includes(q);
      return matchesTitle || matchesChapter || matchesType;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Stats Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, chapter or type..."
            className="w-full bg-neutral-950/60 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono tracking-[0.2em] text-neutral-400">
          <span>{filteredStories.length} {filteredStories.length === 1 ? "STORY" : "STORIES"}</span>
          <Link
            href="/admin/editor"
            className="inline-flex items-center space-x-1.5 text-neutral-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-full hover:border-white transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW STORY</span>
          </Link>
        </div>
      </div>

      {/* Stories Table */}
      <div className="overflow-x-auto border border-white/10 bg-neutral-950/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase bg-neutral-900/30">
              <th className="py-3.5 px-6">Story Title</th>
              <th className="py-3.5 px-6">Chapter</th>
              <th className="py-3.5 px-6">Classification</th>
              <th className="py-3.5 px-6">Time / Date</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-xs">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => {
                const isDraft = story.status === "DRAFT";
                const dateLabel = formatStoryDate(story);

                return (
                  <tr
                    key={story.id}
                    className="hover:bg-neutral-900/30 transition-colors group"
                  >
                    {/* Title */}
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/editor?id=${story.id}`}
                        className="font-serif text-lg text-neutral-200 group-hover:text-white group-hover:italic transition block"
                      >
                        {story.title}
                      </Link>
                      {story.subtitle && (
                        <p className="text-[11px] font-sans text-neutral-400 italic line-clamp-1 mt-0.5">
                          &ldquo;{story.subtitle}&rdquo;
                        </p>
                      )}
                    </td>

                    {/* Chapter */}
                    <td className="py-4 px-6 text-neutral-400 tracking-wider">
                      {story.chapter ? (
                        <span>
                          {String(story.chapter.number).padStart(2, "0")} {story.chapter.title}
                        </span>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6 text-neutral-400 uppercase tracking-wider">
                      {story.storyType}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-6 text-neutral-400">{dateLabel}</td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(story)}
                        title="Click to toggle status"
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase transition ${
                          isDraft
                            ? "bg-amber-950/40 text-amber-300 border border-amber-900/50 hover:bg-amber-900/50"
                            : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 hover:bg-emerald-900/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDraft ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                        />
                        <span>{story.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-3 text-neutral-400">
                        {story.status === "PUBLISHED" && (
                          <Link
                            href={`/story/${story.slug}`}
                            target="_blank"
                            title="View Public Story"
                            className="p-1 hover:text-white transition"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/editor?id=${story.id}`}
                          title="Edit Story"
                          className="p-1 hover:text-white transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(story.id, story.title)}
                          disabled={isDeleting === story.id}
                          title="Delete Story"
                          className="p-1 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono text-xs">
                  No memories found matching the current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
