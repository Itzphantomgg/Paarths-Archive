"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Vault Error Boundary Caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#050505] text-[#EDEDEB]">
      <div className="max-w-md w-full border border-white/10 bg-neutral-950/70 p-10 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="w-12 h-12 rounded-full border border-rose-900/40 bg-rose-950/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
            SYSTEM NOTICE // VAULT ACCESS
          </span>
          <h2 className="font-serif text-3xl text-white italic font-normal">
            Unable to Load Archive
          </h2>
          <p className="font-serif text-sm text-neutral-400 italic max-w-sm mx-auto leading-relaxed">
            &ldquo;Something prevented your archive from loading.&rdquo;
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 transition font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
