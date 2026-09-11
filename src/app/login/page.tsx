"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Vault access denied.");
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md border border-white/10 bg-neutral-950/75 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b border-white/10">
        <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
          AUTHENTICATION // PRIVATE ENTRY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal italic">
          Welcome Back
        </h1>
        <p className="font-serif text-sm text-neutral-300 italic">
          &ldquo;Paarth&apos;s Archive&rdquo;
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="my-6 p-4 rounded border border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-mono tracking-wide flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-6">
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
            Archivist Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="paarth@archive.local"
            className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
              Access Password
            </label>
            <Link
              href="/forgot-password"
              className="font-mono text-[9px] tracking-[0.2em] text-neutral-400 hover:text-neutral-200 transition uppercase"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-neutral-700 hover:border-white text-neutral-200 hover:text-white py-3 px-6 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 bg-neutral-900/60 hover:bg-neutral-900 flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-50"
          >
            <span>{loading ? "AUTHENTICATING..." : "ENTER ARCHIVE"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick Demo Credentials Hint */}
      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="font-mono text-[10px] tracking-[0.18em] text-neutral-400 uppercase">
          PRIMARY VAULT CREDENTIALS:
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em] text-neutral-400 mt-1">
          paarth@archive.local &bull; archive2026
        </p>
        <div className="mt-4">
          <Link
            href="/register"
            className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition border-b border-transparent hover:border-white"
          >
            Need a new archivist key? Register &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Dark Grayscale Background Film Still with Vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full bg-cover bg-center filter grayscale contrast-125 brightness-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      <Suspense fallback={<div className="font-mono text-xs text-neutral-500">Loading vault portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
