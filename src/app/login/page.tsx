"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const origin = window.location.origin;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        // Humanize error message for archivist feel
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid credentials. Vault access denied.");
        } else if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Email has not been confirmed yet. Please verify your inbox.");
        }
        throw signInError;
      }

      if (data?.user) {
        router.push(redirectPath);
        router.refresh();
      }
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

      {/* Google Login Option */}
      <div className="pt-6 space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full rounded-full border border-white/20 hover:border-white text-white py-3 px-6 text-xs font-mono tracking-[0.2em] uppercase transition duration-300 bg-white/5 hover:bg-white hover:text-black flex items-center justify-center space-x-3 focus:outline-none disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? "CONNECTING..." : "CONTINUE WITH GOOGLE"}</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-4 font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase">
            OR WITH EMAIL
          </span>
          <div className="flex-grow border-t border-white/10" />
        </div>
      </div>

      {/* Email + Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-6 pt-2">
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
            Archivist Email
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-full border border-neutral-700 hover:border-white text-neutral-200 hover:text-white py-3 px-6 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 bg-neutral-900/60 hover:bg-neutral-900 flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-50"
          >
            <span>{loading ? "AUTHENTICATING..." : "ENTER ARCHIVE"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <Link
          href="/register"
          className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition border-b border-transparent hover:border-white"
        >
          Need an archivist key? Create Account &rarr;
        </Link>
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
