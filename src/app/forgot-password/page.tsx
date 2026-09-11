"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error(
          "Authentication configuration incomplete: Supabase API key is missing. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
      }

      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${origin}/auth/reset-password`,
        }
      );

      if (resetError) {
        const msg = resetError.message || "";
        if (msg.includes("Invalid API key") || msg.includes("No API key")) {
          throw new Error("Authentication service configuration error: Supabase API key is invalid or unconfigured.");
        }
        throw resetError;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to dispatch password recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md border border-white/10 bg-neutral-950/75 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
        <div className="text-center space-y-3 pb-8 border-b border-white/10">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
            RECOVERY // ARCHIVIST IDENTITY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal italic">
            Key Recovery
          </h1>
          <p className="font-serif text-sm text-neutral-300 italic">
            &ldquo;Memories are persistent; passwords can be reset.&rdquo;
          </p>
        </div>

        {error && (
          <div className="my-6 p-4 rounded border border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-mono tracking-wide flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="py-8 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full border border-neutral-700 mx-auto flex items-center justify-center text-neutral-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-serif text-base text-neutral-200">
              Recovery instructions dispatched to <span className="text-white font-mono text-xs">{email}</span>.
            </p>
            <p className="font-mono text-[11px] tracking-[0.15em] text-neutral-400">
              Please check your inbox and click the reset link to choose a new password.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 font-mono text-xs tracking-[0.2em] text-neutral-300 hover:text-white uppercase border-b border-white/40 pb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="archivist@vault.local"
                className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-neutral-700 hover:border-white text-neutral-200 hover:text-white py-3 px-6 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 bg-neutral-900/60 hover:bg-neutral-900 flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-50"
              >
                <span>{loading ? "DISPATCHING..." : "SEND RECOVERY DISPATCH"}</span>
              </button>
            </div>

            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition"
              >
                &larr; Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
