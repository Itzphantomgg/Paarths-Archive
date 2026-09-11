"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, PenLine, X, BookOpen, Compass, Info, User, LogOut } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-[#050505]/85 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none transition"
          >
            <span className="font-serif text-xl sm:text-2xl tracking-tight text-white/90 group-hover:text-white transition italic">
              Paarth&apos;s Archive
            </span>
            <span className="font-mono text-[9px] tracking-[0.28em] text-neutral-500 uppercase mt-0.5 group-hover:text-neutral-400 transition">
              EST 2026 // DIGITAL VAULT
            </span>
          </Link>

          {/* Desktop Right Links */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <nav className="hidden md:flex items-center space-x-7 text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    className={`transition hover:text-white ${
                      pathname === "/admin" ? "text-white" : ""
                    }`}
                  >
                    Archive
                  </Link>
                  <Link
                    href="/admin/editor"
                    className="flex items-center space-x-1.5 text-neutral-200 border border-neutral-700/80 px-3 py-1 rounded-full hover:border-white transition"
                  >
                    <PenLine className="w-3 h-3" />
                    <span>Write</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className={`transition hover:text-white ${
                      pathname === "/admin/settings" ? "text-white" : ""
                    }`}
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="transition hover:text-rose-400 text-neutral-400 flex items-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/archive"
                    className={`transition hover:text-white ${
                      pathname.startsWith("/archive") ? "text-white" : ""
                    }`}
                  >
                    Archive
                  </Link>
                  <Link
                    href="/about"
                    className={`transition hover:text-white ${
                      pathname === "/about" ? "text-white" : ""
                    }`}
                  >
                    About
                  </Link>
                  <Link
                    href="/login"
                    className="transition hover:text-white text-neutral-300 border-b border-white/20 hover:border-white pb-0.5"
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>

            {/* Circular Menu Button Inspired by Reference Image */}
            <div className="flex items-center space-x-2.5">
              <span className="hidden sm:inline font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                {isMenuOpen ? "CLOSE" : "MENU"}
              </span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-700 hover:border-neutral-400 flex flex-col items-center justify-center space-y-1 bg-black/40 hover:bg-neutral-900/60 transition-all duration-300 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4 text-neutral-300" />
                ) : (
                  <>
                    <span className="w-3.5 h-[1px] bg-neutral-300 transition-all" />
                    <span className="w-3.5 h-[1px] bg-neutral-300 transition-all" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cinematic Fullscreen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#060606]/98 backdrop-blur-xl flex flex-col justify-between p-8 sm:p-16 animate-fade-in">
          {/* Top subtle rule */}
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-6 pt-16">
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
              INDEX // CURATED SECTIONS
            </span>
            <span className="font-mono text-xs tracking-[0.3em] text-neutral-600">
              ARCHIVE EDITION 1.0
            </span>
          </div>

          {/* Large Editorial Menu Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 max-w-5xl">
            <div className="space-y-6">
              <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                {user ? "Vault Navigation" : "Sanctuary Index"}
              </div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-3xl sm:text-4xl text-neutral-300 hover:text-white hover:italic transition block"
                  >
                    The Threshold
                  </Link>
                </li>
                <li>
                  <Link
                    href={user ? "/admin" : "/archive"}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-3xl sm:text-4xl text-neutral-300 hover:text-white hover:italic transition block"
                  >
                    {user ? "My Archive" : "Archive Philosophy"}
                  </Link>
                </li>
                {user && (
                  <>
                    <li>
                      <Link
                        href="/admin/editor"
                        onClick={() => setIsMenuOpen(false)}
                        className="font-serif text-3xl sm:text-4xl text-neutral-300 hover:text-white hover:italic transition block"
                      >
                        Writing Desk
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/search"
                        onClick={() => setIsMenuOpen(false)}
                        className="font-serif text-3xl sm:text-4xl text-neutral-300 hover:text-white hover:italic transition block"
                      >
                        Search Vault
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-3xl sm:text-4xl text-neutral-300 hover:text-white hover:italic transition block"
                  >
                    About the Vault
                  </Link>
                </li>
              </ul>
            </div>

            {/* Chapters / Categories Column */}
            <div className="space-y-6">
              <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                {user ? "Organized Chapters" : "Thematic Volumes (Private)"}
              </div>
              <div className="grid grid-cols-2 gap-y-3 font-mono text-xs tracking-[0.2em] text-neutral-400">
                <span className="text-neutral-500">01 CHILDHOOD</span>
                <span className="text-neutral-500">02 GROWING UP</span>
                <span className="text-neutral-500">03 PEOPLE</span>
                <span className="text-neutral-500">04 INCIDENTS</span>
                <span className="text-neutral-500">05 FRAGMENTS</span>
                <span className="text-neutral-500">06 FICTION</span>
                <span className="text-neutral-500">07 LETTERS</span>
              </div>

              {/* Private Writing System Link */}
              <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
                <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
                  Archivist Portal
                </div>
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-mono text-xs tracking-[0.2em] text-neutral-300 hover:text-white flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{user.name}&apos;s Vault</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 hover:text-rose-400 flex items-center space-x-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Exit Vault</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-xs tracking-[0.2em] text-neutral-300 hover:text-white border-b border-white/20 pb-0.5 inline-block"
                  >
                    Archivist Sign In &rarr;
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Bottom subtle bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between text-[11px] font-mono tracking-[0.25em] text-neutral-600">
            <span>&ldquo;SOME MEMORIES HAVE DATES. SOME ONLY HAVE A FEELING.&rdquo;</span>
            <span className="mt-2 sm:mt-0">PAARTH&apos;S ARCHIVE &copy; 2026</span>
          </div>
        </div>
      )}
    </>
  );
}
