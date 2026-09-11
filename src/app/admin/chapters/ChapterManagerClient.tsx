"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Layers, Check, X } from "lucide-react";

interface Chapter {
  id: string;
  number: number;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  coverImage: string | null;
  order: number;
  _count?: { stories: number };
}

export default function ChapterManagerClient({ initialChapters }: { initialChapters: Chapter[] }) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    coverImage: "",
    order: 0,
    number: 1,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      coverImage: "",
      order: 0,
      number: 1,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEditClick = (chapter: Chapter) => {
    setEditingId(chapter.id);
    setIsCreating(false);
    setFormData({
      title: chapter.title,
      subtitle: chapter.subtitle || "",
      description: chapter.description || "",
      coverImage: chapter.coverImage || "",
      order: chapter.order,
      number: chapter.number,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const res = await fetch("/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setChapters((prev) => [...prev, data.chapter]);
        resetForm();
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to create chapter:", err);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const res = await fetch(`/api/chapters/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setChapters((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...data.chapter } : c))
        );
        resetForm();
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update chapter:", err);
    }
  };

  const handleDeleteChapter = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete chapter "${title}"? Associated stories will have their chapter detached.`)) return;

    try {
      const res = await fetch(`/api/chapters/${id}`, { method: "DELETE" });
      if (res.ok) {
        setChapters((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete chapter:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white italic">
            Chapter Directory
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Organize the primary volumes and categories of the archive.
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={() => {
              setIsCreating(true);
              setFormData({
                title: "",
                subtitle: "",
                description: "",
                coverImage: "",
                order: chapters.length + 1,
                number: chapters.length + 1,
              });
            }}
            className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.2em] text-black bg-white hover:bg-neutral-200 uppercase px-4 py-2 rounded-full transition"
          >
            <Plus className="w-4 h-4" />
            <span>ADD CHAPTER</span>
          </button>
        )}
      </div>

      {/* Creation / Editing Form */}
      {(isCreating || editingId) && (
        <form
          onSubmit={isCreating ? handleCreateSubmit : handleUpdateSubmit}
          className="border border-white/20 bg-neutral-950/60 p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-xs tracking-[0.25em] text-white uppercase">
              {isCreating ? "NEW ARCHIVE CHAPTER" : "EDIT CHAPTER SPECIFICATIONS"}
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
                Chapter Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SCHOOL, PLACES, NOW"
                className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-serif uppercase tracking-wider focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
                Chapter Number
              </label>
              <input
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
              Poetic Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. The places that shaped my perspective."
              className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-neutral-200 font-serif italic focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
              Chapter Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Reflective description of this memory category..."
              className="w-full bg-neutral-900/40 border border-white/10 p-3 text-sm text-neutral-300 font-light focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
              Cover Image URL (Dark Grayscale Photography)
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-xs text-neutral-300 font-mono focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-full font-mono text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-neutral-200 transition"
            >
              {isCreating ? "SAVE CHAPTER" : "UPDATE CHAPTER"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-full font-mono text-xs tracking-[0.2em] uppercase border border-white/20 text-neutral-400 hover:text-white hover:border-white transition"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Chapters Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-white/10 bg-neutral-950/40 p-6 sm:p-8 flex flex-col justify-between group hover:border-white/30 transition-all duration-500"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <span className="font-serif text-3xl text-neutral-400 font-light">
                  {String(chapter.number).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                  {chapter._count?.stories ?? 0} STORIES
                </span>
              </div>

              <h3 className="font-serif text-2xl text-white font-normal group-hover:italic transition">
                {chapter.title}
              </h3>

              {chapter.subtitle && (
                <p className="font-serif text-sm text-neutral-300 italic font-light mt-1">
                  &ldquo;{chapter.subtitle}&rdquo;
                </p>
              )}

              {chapter.description && (
                <p className="text-xs text-neutral-400 font-light mt-3 line-clamp-2">
                  {chapter.description}
                </p>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between font-mono text-xs text-neutral-400">
              <span>ORDER: {chapter.order}</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleEditClick(chapter)}
                  className="hover:text-white transition flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                  className="hover:text-rose-400 transition flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DELETE</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
