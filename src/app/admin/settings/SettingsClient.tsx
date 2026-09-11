"use client";

import React, { useState } from "react";
import { Download, Database, User, ShieldCheck, LogOut, ExternalLink, Check } from "lucide-react";

interface SettingsClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  counts: {
    stories: number;
    chapters: number;
    tags: number;
  };
}

export default function SettingsClient({ user, counts }: SettingsClientProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    window.location.href = "/api/export";
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-2xl text-white italic">
          Vault Settings &amp; Data Permanence
        </h2>
        <p className="font-mono text-xs text-neutral-400 mt-1">
          Archive integrity, identity, and raw data export.
        </p>
      </div>

      {/* Identity Card */}
      <div className="border border-white/10 bg-neutral-950/40 p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase border-b border-white/10 pb-3">
          <User className="w-4 h-4 text-neutral-300" />
          <span>Archivist Identity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase block mb-1">
              ARCHIVIST NAME
            </span>
            <span className="text-white text-sm font-serif">{user.name}</span>
          </div>

          <div>
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase block mb-1">
              VAULT EMAIL
            </span>
            <span className="text-neutral-300">{user.email}</span>
          </div>

          <div>
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase block mb-1">
              ROLE &amp; AUTHORIZATION
            </span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user.role} // FULL WRITE PRIVILEGES</span>
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.2em] text-rose-400 hover:text-rose-300 uppercase transition border border-rose-900/40 hover:border-rose-800 px-4 py-2 rounded-full bg-rose-950/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock &amp; Exit Vault</span>
          </button>
        </div>
      </div>

      {/* Backup & Export Card */}
      <div className="border border-white/10 bg-neutral-950/40 p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase border-b border-white/10 pb-3">
          <Download className="w-4 h-4 text-neutral-300" />
          <span>Data Permanence &amp; Archive Backup</span>
        </div>

        <p className="text-sm text-neutral-300 font-serif leading-relaxed">
          Your memories belong to you. Download a complete JSON archive of all stories, unedited drafts, chapter structures, and memory coordinates with a single dispatch.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="font-mono text-xs text-neutral-400 space-x-4">
            <span>{counts.stories} STORIES</span>
            <span>&bull;</span>
            <span>{counts.chapters} CHAPTERS</span>
            <span>&bull;</span>
            <span>{counts.tags} TAGS</span>
          </div>

          <button
            onClick={handleExport}
            disabled={downloading}
            className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.2em] text-black bg-white hover:bg-neutral-200 uppercase px-6 py-2.5 rounded-full transition font-medium shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "GENERATING BACKUP..." : "EXPORT COMPLETE ARCHIVE"}</span>
          </button>
        </div>
      </div>

      {/* Database & Cloud Sync Info */}
      <div className="border border-white/10 bg-neutral-950/40 p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-3 font-mono text-xs tracking-[0.2em] text-neutral-400 uppercase border-b border-white/10 pb-3">
          <Database className="w-4 h-4 text-neutral-300" />
          <span>Storage Engine &amp; Supabase Integration</span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          The archive is presently operating on a high-speed relational database (<code className="text-neutral-300 font-mono">dev.db</code> via Prisma). To sync with Supabase PostgreSQL in the cloud, simply provide your <code className="text-neutral-300 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-neutral-300 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code className="text-neutral-300 font-mono">.env.local</code>. The schema is pre-configured in <code className="text-neutral-300 font-mono">supabase/schema.sql</code>.
        </p>
      </div>
    </div>
  );
}
