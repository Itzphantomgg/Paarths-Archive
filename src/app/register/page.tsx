"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const origin = window.location.origin;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/admin`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      setError(err.message || "Google registration failed.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: `${origin}/auth/callback?next=/admin`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If user session is returned immediately (email confirmation disabled or auto-confirmed)
      if (data?.session) {
        router.push("/admin");
        router.refresh();
      } else if (data?.user && !data?.session) {
        // Confirmation email was sent
        setConfirmationSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize new archivist credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDEB] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Grayscale Background Still */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full bg-cover bg-center filter grayscale contrast-125 brightness-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      <div className="relative z-10 w-full max-w-md border border-white/10 bg-neutral-950/75 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
        <div className="text-center space-y-3 pb-8 border-b border-white/10">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
            GENESIS // ENROLLMENT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal italic">
            Create Account
          </h1>
          <p className="font-serif text-sm text-neutral-300 italic">
            Create your private digital archive and memory vault.
          </p>
        </div>

        {error && (
          <div className="my-6 p-4 rounded border border-rose-900/50 bg-rose-950/30 text-rose-300 text-xs font-mono tracking-wide flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {confirmationSent ? (
          <div className="py-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border border-emerald-700/50 bg-emerald-950/30 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-white italic">Verify Your Email</h3>
            <p className="font-mono text-xs text-neutral-300 leading-relaxed">
              We dispatched an activation link to <span className="text-white font-bold">{email}</span>.
            </p>
            <p className="font-mono text-[11px] text-neutral-500">
              Please click the link in your email to unlock and enter your archive.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="font-mono text-xs text-neutral-400 hover:text-white uppercase transition border-b border-white/30 hover:border-white pb-1"
              >
                Return to Login &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Google Quick Registration */}
            <div className="pt-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignUp}
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

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                  Archivist Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paarth"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                  Email Address
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
                <label className="block font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase mb-2">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 text-sm text-white font-mono placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full rounded-full border border-neutral-700 hover:border-white text-neutral-200 hover:text-white py-3 px-6 text-xs font-mono tracking-[0.25em] uppercase transition duration-300 bg-neutral-900/60 hover:bg-neutral-900 flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-50"
                >
                  <span>{loading ? "INITIALIZING..." : "INITIALIZE ARCHIVE"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link
            href="/login"
            className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition border-b border-transparent hover:border-white"
          >
            Already possess credentials? Enter vault &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
