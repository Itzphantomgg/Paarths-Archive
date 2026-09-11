"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Trash2,
  Eye,
  Search,
  Plus,
  Share2,
  Copy,
  Check,
  Lock,
  Link2Off,
  BookOpen,
} from "lucide-react";
import { formatStoryDate } from "@/lib/utils";

export interface StoryItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  status: string;
  shareStatus?: string | null;
  shareToken?: string | null;
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
}

export default function StoryManagerTable({
  initialStories,
}: StoryManagerTableProps) {
  const [stories, setStories] = useState<StoryItem[]>(initialStories);
  const [activeTab, setActiveTab] = useState<"RECENT" | "DRAFTS" | "SHARED">("RECENT");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const router = useRouter();

  // Copy share link
  const handleCopyShareLink = (token: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/shared/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Generate private share link
  const handleGenerateShare = async (story: StoryItem) => {
    setSharingId(story.id);
    try {
      const res = await fetch(`/api/stories/${story.id}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.shareToken) {
        setStories((prev) =>
          prev.map((s) =>
            s.id === story.id
              ? { ...s, shareStatus: "SHARED", shareToken: data.shareToken }
              : s
          )
        );
        handleCopyShareLink(data.shareToken);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to generate share:", err);
    } finally {
      setSharingId(null);
    }
  };

  // Revoke private share link
  const handleRevokeShare = async (story: StoryItem) => {
    if (!confirm(`Revoke private share dispatch for "${story.title}"? Anyone with the existing link will no longer be able to read it.`)) {
      return;
    }

    setSharingId(story.id);
    try {
      const res = await fetch(`/api/stories/${story.id}/share`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStories((prev) =>
          prev.map((s) =>
            s.id === story.id
              ? { ...s, shareStatus: "REVOKED" }
              : s
          )
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to revoke share:", err);
    } finally {
      setSharingId(null);
    }
  };

  // Delete story
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}" from the vault?`)) return;

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

  // Filtering
  const filteredStories = stories.filter((story) => {
    if (activeTab === "DRAFTS" && story.status !== "DRAFT") return false;
    if (activeTab === "SHARED" && story.shareStatus !== "SHARED") return false;

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
      {/* Editorial Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
        
        {/* Navigation Tabs: RECENT, DRAFTS, SHARED, CHAPTERS */}
        <div className="flex items-center space-x-2 sm:space-x-4 font-mono text-xs tracking-[0.2em] uppercase">
          <button
            onClick={() => setActiveTab("RECENT")}
            className={`px-3 py-1.5 transition ${
              activeTab === "RECENT"
                ? "text-white border-b-2 border-white font-medium"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            RECENT ({stories.length})
          </button>
          <button
            onClick={() => setActiveTab("DRAFTS")}
            className={`px-3 py-1.5 transition ${
              activeTab === "DRAFTS"
                ? "text-white border-b-2 border-white font-medium"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            DRAFTS ({stories.filter((s) => s.status === "DRAFT").length})
          </button>
          <button
            onClick={() => setActiveTab("SHARED")}
            className={`px-3 py-1.5 transition ${
              activeTab === "SHARED"
                ? "text-white border-b-2 border-white font-medium"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            SHARED DISPATCHES ({stories.filter((s) => s.shareStatus === "SHARED").length})
          </button>
          <Link
            href="/admin/chapters"
            className="px-3 py-1.5 text-neutral-400 hover:text-white transition"
          >
            CHAPTERS &rarr;
          </Link>
        </div>

        {/* Action: + New Story Button */}
        <Link
          href="/admin/editor"
          className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.25em] text-black bg-white hover:bg-neutral-200 px-4 py-2 rounded-full uppercase transition duration-300 self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW STORY</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault by title, chapter or mood..."
            className="w-full bg-neutral-950/60 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition"
          />
        </div>

        <div className="text-xs font-mono tracking-[0.2em] text-neutral-400">
          SHOWING {filteredStories.length} {filteredStories.length === 1 ? "MEMORY" : "MEMORIES"}
        </div>
      </div>

      {/* Stories Table */}
      <div className="overflow-x-auto border border-white/10 bg-neutral-950/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase bg-neutral-900/40">
              <th className="py-3.5 px-6">Memory Title</th>
              <th className="py-3.5 px-6">Chapter</th>
              <th className="py-3.5 px-6">Classification</th>
              <th className="py-3.5 px-6">Date / Year</th>
              <th className="py-3.5 px-6">Privacy State</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-xs">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => {
                const isDraft = story.status === "DRAFT";
                const isShared = story.shareStatus === "SHARED";
                const dateLabel = formatStoryDate(
                  story.approximateDate,
                  story.exactDate,
                  story.year
                );

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

                    {/* Privacy State */}
                    <td className="py-4 px-6">
                      {isDraft ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase bg-amber-950/40 text-amber-300 border border-amber-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>DRAFT</span>
                        </span>
                      ) : isShared ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase bg-emerald-950/40 text-emerald-300 border border-emerald-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>SHARED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase bg-neutral-900 text-neutral-400 border border-white/10">
                          <Lock className="w-2.5 h-2.5" />
                          <span>PRIVATE</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-3 text-neutral-400">
                        {/* Read Owner Book Page */}
                        <Link
                          href={`/story/${story.slug}`}
                          title="Read Story"
                          className="p-1 hover:text-white transition"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>

                        {/* Share Controls */}
                        {isShared && story.shareToken ? (
                          <>
                            <button
                              onClick={() => handleCopyShareLink(story.shareToken!)}
                              title="Copy Private Share Link"
                              className="p-1 text-emerald-400 hover:text-white transition flex items-center space-x-1"
                            >
                              {copiedToken === story.shareToken ? (
                                <Check className="w-4 h-4 text-emerald-300" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRevokeShare(story)}
                              disabled={sharingId === story.id}
                              title="Revoke Private Share Link"
                              className="p-1 hover:text-rose-400 transition"
                            >
                              <Link2Off className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleGenerateShare(story)}
                            disabled={sharingId === story.id}
                            title="Generate Private Share Link"
                            className="p-1 hover:text-emerald-400 transition"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit Link */}
                        <Link
                          href={`/admin/editor?id=${story.id}`}
                          title="Edit Story"
                          className="p-1 hover:text-white transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
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
                  No memories found matching the current tab or query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
