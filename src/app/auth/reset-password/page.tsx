"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error(
          "Authentication configuration incomplete: Supabase API key is missing. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
      }

      const { error: resetError } = await supabase.auth.updateUser({
        password,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update master password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md border border-white/10 bg-neutral-950/75 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
        <div className="text-center space-y-3 pb-8 border-b border-white/10">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
            RECOVERY // NEW CREDENTIALS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal italic">
            Reset Password
          </h1>
          <p className="font-serif text-sm text-neutral-300 italic">
            Define a new master password for your private archive.
          </p>
        </div>

        {error && (
          <div className="my-6 p-4 rounded border border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-mono tracking-wide flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border border-emerald-700/50 bg-emerald-950/30 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white italic">Password Updated</h3>
            <p className="font-mono text-xs text-neutral-400">
              Your credentials have been renewed. Entering archive...
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6 pt-6">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                New Master Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>{loading ? "UPDATING..." : "SAVE NEW PASSWORD"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition"
              >
                &larr; Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
