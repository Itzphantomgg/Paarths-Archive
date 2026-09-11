"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Trash2,
  ArrowLeft,
  BookOpen,
  Edit3,
  Share2,
  Copy,
  Check,
  Link2Off,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import StoryContent from "@/components/story/StoryContent";

interface ChapterOption {
  id: string;
  title: string;
  number: number;
}

interface StoryEditorClientProps {
  chapters: ChapterOption[];
  storyId?: string | null;
  initialStory?: any;
}

export default function StoryEditorClient({
  chapters,
  storyId,
  initialStory,
}: StoryEditorClientProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialStory?.title || "");
  const [subtitle, setSubtitle] = useState(initialStory?.subtitle || "");
  const [content, setContent] = useState(initialStory?.content || "");
  const [excerpt, setExcerpt] = useState(initialStory?.excerpt || "");
  const [chapterId, setChapterId] = useState(initialStory?.chapterId || (chapters[0]?.id ?? ""));
  const [storyType, setStoryType] = useState(initialStory?.storyType || "CHILDHOOD");
  const [status, setStatus] = useState<"DRAFT" | "PRIVATE">(
    initialStory?.status === "DRAFT" ? "DRAFT" : "PRIVATE"
  );
  const [shareStatus, setShareStatus] = useState<string>(initialStory?.shareStatus || "PRIVATE");
  const [shareToken, setShareToken] = useState<string | null>(initialStory?.shareToken || null);
  const [approximateDate, setApproximateDate] = useState(
    initialStory?.approximateDate || ""
  );
  const [year, setYear] = useState(initialStory?.year?.toString() || "");
  const [location, setLocation] = useState(initialStory?.location || "");
  const [peopleInvolved, setPeopleInvolved] = useState(
    initialStory?.peopleInvolved || ""
  );
  const [mood, setMood] = useState(initialStory?.mood || "");
  const [coverImage, setCoverImage] = useState(initialStory?.coverImage || "");
  const [isFeatured, setIsFeatured] = useState(initialStory?.isFeatured || false);
  const [tagsInput, setTagsInput] = useState(
    initialStory?.tags?.map((t: any) => t.tag?.name || t.name).join(", ") || ""
  );

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Curated monochrome film image presets (Zero gaming imagery)
  const curatedPresets = [
    { label: "Misty Peaks", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop" },
    { label: "Solitary Tree", url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1400&auto=format&fit=crop" },
    { label: "Night Railroad", url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400&auto=format&fit=crop" },
    { label: "Vintage Alley", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400&auto=format&fit=crop" },
    { label: "Notebook & Pen", url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop" },
    { label: "Rainy Window", url: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1400&auto=format&fit=crop" },
    { label: "Desert Shore", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop" },
  ];

  // Save story
  const handleSave = async (targetStatus?: "DRAFT" | "PRIVATE") => {
    if (!title.trim()) {
      setNotification({ type: "error", message: "Please enter a story title." });
      return;
    }
    if (!content.trim()) {
      setNotification({ type: "error", message: "Please enter memory narrative text." });
      return;
    }

    setIsSaving(true);
    setNotification(null);

    const finalStatus = targetStatus || status;

    const payload = {
      title,
      subtitle,
      content,
      excerpt,
      chapterId: chapterId || null,
      storyType,
      status: finalStatus,
      approximateDate,
      year: year ? parseInt(year, 10) : null,
      location,
      peopleInvolved,
      mood,
      coverImage,
      isFeatured,
      tags: tagsInput
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = storyId ? `/api/stories/${storyId}` : "/api/stories";
      const method = storyId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save memory.");
      }

      setStatus(finalStatus);
      setNotification({
        type: "success",
        message: finalStatus === "PRIVATE" ? "Memory saved safely in vault." : "Draft saved securely.",
      });

      if (!storyId && data.story?.id) {
        router.push(`/admin/editor?id=${data.story.id}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Generate private share link
  const handleShareStory = async () => {
    if (!storyId) {
      setNotification({ type: "error", message: "Please save the story before generating a share link." });
      return;
    }

    setIsSharing(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.shareToken) {
        setShareStatus("SHARED");
        setShareToken(data.shareToken);
        const shareUrl = `${window.location.origin}/shared/${data.shareToken}`;
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
        setNotification({
          type: "success",
          message: "Private share link generated and copied to clipboard!",
        });
        router.refresh();
      } else {
        throw new Error(data.error || "Failed to generate share link.");
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsSharing(false);
    }
  };

  // Revoke share link
  const handleRevokeShare = async () => {
    if (!storyId) return;
    if (!confirm("Revoke private share dispatch? Anyone with the existing link will no longer be able to read it.")) {
      return;
    }

    setIsSharing(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/share`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShareStatus("REVOKED");
        setNotification({
          type: "success",
          message: "Share dispatch revoked. Link is now inactive.",
        });
        router.refresh();
      } else {
        throw new Error("Failed to revoke share dispatch.");
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsSharing(false);
    }
  };

  // Copy active link
  const handleCopyLink = () => {
    if (!shareToken) return;
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    setNotification({ type: "success", message: "Share link copied to clipboard!" });
  };

  // Delete story
  const handleDelete = async () => {
    if (!storyId) return;
    if (!confirm("Are you sure you want to permanently delete this memory from the vault?")) return;

    try {
      const res = await fetch(`/api/stories/${storyId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      alert("Failed to delete story.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Top action & back bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to My Archive</span>
        </Link>

        {/* Action Buttons: SAVE DRAFT, SAVE, SHARE, REVOKE SHARE, DELETE */}
        <div className="flex flex-wrap items-center gap-2.5">
          {storyId && initialStory?.slug && (
            <Link
              href={`/story/${initialStory.slug}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 font-mono text-xs tracking-[0.18em] text-neutral-400 hover:text-white uppercase border border-white/10 hover:border-white px-3.5 py-2 rounded-full transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read in Book</span>
            </Link>
          )}

          {/* Delete Action */}
          {storyId && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center space-x-1.5 font-mono text-xs tracking-[0.18em] text-neutral-400 hover:text-rose-400 uppercase border border-transparent hover:border-rose-900/50 px-3.5 py-2 rounded-full transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          {/* Save Draft Action */}
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={isSaving}
            className="inline-flex items-center space-x-1.5 font-mono text-xs tracking-[0.18em] text-neutral-300 hover:text-white uppercase border border-white/20 hover:border-white px-4 py-2 rounded-full transition bg-neutral-900/40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Save / Save Memory Action */}
          <button
            onClick={() => handleSave("PRIVATE")}
            disabled={isSaving}
            className="inline-flex items-center space-x-1.5 font-mono text-xs tracking-[0.2em] text-black bg-white hover:bg-neutral-200 uppercase px-5 py-2 rounded-full font-medium transition shadow-lg"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* Share Actions */}
          {storyId && (
            shareStatus === "SHARED" && shareToken ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center space-x-1.5 font-mono text-xs tracking-[0.18em] text-emerald-300 border border-emerald-800/80 bg-emerald-950/40 hover:bg-emerald-900/50 px-3.5 py-2 rounded-full transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                </button>
                <button
                  onClick={handleRevokeShare}
                  disabled={isSharing}
                  title="Revoke Share"
                  className="inline-flex items-center space-x-1 font-mono text-xs tracking-[0.18em] text-rose-400 border border-rose-900/50 hover:bg-rose-950/40 px-3 py-2 rounded-full transition"
                >
                  <Link2Off className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleShareStory}
                disabled={isSharing}
                className="inline-flex items-center space-x-1.5 font-mono text-xs tracking-[0.18em] text-neutral-300 hover:text-white border border-white/20 hover:border-white px-3.5 py-2 rounded-full transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 border rounded font-mono text-xs flex items-center space-x-3 transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/40 border-emerald-900 text-emerald-300"
              : "bg-rose-950/40 border-rose-900 text-rose-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tabs: Editor vs Book Preview */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-4 font-mono text-xs tracking-[0.2em] uppercase">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition ${
              activeTab === "edit"
                ? "border-white text-white font-medium"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Writing Desk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition ${
              activeTab === "preview"
                ? "border-white text-white font-medium"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Book Preview</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400">
          <span>PRIVACY: <strong className={status === "PRIVATE" ? "text-neutral-200" : "text-amber-400"}>{status}</strong></span>
          {shareStatus === "SHARED" && (
            <span className="text-emerald-400 font-semibold">• SHARED VIA KEY</span>
          )}
        </div>
      </div>

      {activeTab === "edit" ? (
        <div className="space-y-8">
          {/* Primary Story Typography Inputs */}
          <div className="space-y-4 border border-white/10 bg-neutral-950/40 p-6 sm:p-8">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Memory Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The House With The Blue Gate"
                className="w-full bg-transparent font-serif text-3xl sm:text-5xl text-white placeholder-neutral-700 focus:outline-none leading-tight border-b border-white/10 focus:border-white/50 pb-2 transition"
              />
            </div>

            <div className="pt-2">
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Subtitle / Opening Pull Quote
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="&ldquo;I don't remember the exact date. I remember the feeling.&rdquo;"
                className="w-full bg-transparent font-serif text-lg sm:text-xl text-neutral-200 placeholder-neutral-700 focus:outline-none italic border-b border-white/10 focus:border-white/50 pb-2 transition"
              />
            </div>
          </div>

          {/* Metadata & Classification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border border-white/10 bg-neutral-950/40 p-6 sm:p-8">
            {/* Chapter Select */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Chapter / Volume
              </label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {String(ch.number).padStart(2, "0")} {ch.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Story Type */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Classification Type
              </label>
              <select
                value={storyType}
                onChange={(e) => setStoryType(e.target.value)}
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              >
                <option value="CHILDHOOD">Childhood Memory</option>
                <option value="GROWING_UP">Growing Up</option>
                <option value="INCIDENT">Incident / Event</option>
                <option value="PEOPLE">People / Portraits</option>
                <option value="FRAGMENT">Fragment / Unfinished</option>
                <option value="FICTION">Fiction / Imagined</option>
                <option value="LETTER">Unsent Letter</option>
                <option value="REFLECTION">Reflection / Thought</option>
              </select>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Vault Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PRIVATE")}
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              >
                <option value="PRIVATE">PRIVATE (Sealed in Vault)</option>
                <option value="DRAFT">DRAFT (Unfinished Work)</option>
              </select>
            </div>

            {/* Approximate Date */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Approximate Date
              </label>
              <input
                type="text"
                value={approximateDate}
                onChange={(e) => setApproximateDate(e.target.value)}
                placeholder="e.g. Autumn, Circa 2014"
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              />
            </div>

            {/* Approximate Year */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2014"
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Platform 4, Central Junction"
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              />
            </div>

            {/* People Involved */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                People Involved (Optional)
              </label>
              <input
                type="text"
                value={peopleInvolved}
                onChange={(e) => setPeopleInvolved(e.target.value)}
                placeholder="e.g. Master Ismail, Childhood friends"
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Atmosphere / Mood
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. Quiet, Melancholic, Resolute"
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="memory, rain, night, silence"
                className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Cover Photography */}
          <div className="border border-white/10 bg-neutral-950/40 p-6 sm:p-8 space-y-4">
            <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
              Monochrome Cover Photography URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-neutral-900 border border-white/20 text-neutral-200 font-mono text-xs p-2.5 rounded focus:outline-none focus:border-white"
            />

            {/* Preset Selector */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mr-1">
                PRESETS:
              </span>
              {curatedPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className="font-mono text-[10px] tracking-[0.15em] text-neutral-400 hover:text-white px-2.5 py-1 rounded border border-white/10 hover:border-white/30 transition bg-neutral-900/40"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Markdown Writing Desk */}
          <div className="border border-white/10 bg-neutral-950/40 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <label className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                Narrative Text (Markdown: ### Header, &gt; Quote, **bold**, *italic*)
              </label>
              <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400">
                {content.split(/\s+/).filter(Boolean).length} WORDS
              </span>
            </div>

            <textarea
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the memory here as you remember it...&#10;&#10;### Section Heading&#10;&#10;The afternoon had turned cold...&#10;&#10;> An important quote that stayed with you."
              className="w-full bg-neutral-950 text-neutral-200 font-serif text-lg leading-relaxed p-4 border border-white/10 focus:border-white/40 focus:outline-none rounded transition"
            />
          </div>
        </div>
      ) : (
        /* Book Reading Live Preview */
        <div className="border border-white/15 bg-[#050505] p-8 sm:p-14 max-w-3xl mx-auto shadow-2xl">
          <div className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase text-center mb-6">
            LIVE BOOK PREVIEW
          </div>

          <header className="space-y-4 text-center pb-8 border-b border-white/10">
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal leading-tight">
              {title || "Untitled Memory"}
            </h1>
            {subtitle && (
              <p className="font-serif text-xl text-neutral-300 italic font-light">
                &ldquo;{subtitle}&rdquo;
              </p>
            )}
            <div className="font-mono text-xs text-neutral-400 tracking-wider">
              {approximateDate || (year ? `Circa ${year}` : "Unrecorded Date")}
              {location && ` // ${location}`}
            </div>
          </header>

          {coverImage && (
            <div className="my-8 overflow-hidden relative aspect-[16/9] border border-white/10">
              <Image
                src={coverImage}
                alt="Preview cover"
                fill
                className="object-cover filter grayscale contrast-125 brightness-85"
              />
            </div>
          )}

          <div className="py-8">
            <StoryContent content={content || "No narrative content entered yet."} />
          </div>
        </div>
      )}
    </div>
  );
}
