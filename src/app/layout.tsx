import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import AmbientSound from "@/components/audio/AmbientSound";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paarth's Archive // Personal Storytelling & Memory Vault",
  description: "An old collection of memories preserved inside a modern cinematic digital archive. Stories, memories and fragments worth remembering.",
  keywords: ["archive", "memories", "storytelling", "cinematic", "journal", "autobiography"],
  authors: [{ name: "Paarth" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#050505] text-[#ededeb] selection:bg-white/20 selection:text-white flex flex-col font-sans relative antialiased`}
      >
        {/* Procedural Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />

        {/* Global Minimalist Navigation */}
        <Header />

        {/* Main Content View */}
        <main className="flex-1 relative z-10">{children}</main>

        {/* Global Cinematic Footer */}
        <Footer />

        {/* Subtle Ambient Tape Hiss / Rain Player (Web Audio API) */}
        <AmbientSound />
      </body>
    </html>
  );
}
