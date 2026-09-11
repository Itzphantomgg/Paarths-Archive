import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen bg-[#060606] text-[#EDEDEB] pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Admin Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase block">
              AUTHENTICATED ARCHIVIST // {user.name}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal italic mt-1">
              Private Writing Studio
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/archive"
              target="_blank"
              className="font-mono text-xs tracking-[0.2em] text-neutral-400 hover:text-white uppercase px-4 py-2 rounded-full border border-white/10 hover:border-white/40 transition"
            >
              View Public Archive &rarr;
            </Link>
            <Link
              href="/admin/editor"
              className="font-mono text-xs tracking-[0.2em] text-black bg-white hover:bg-neutral-200 uppercase px-5 py-2 rounded-full font-medium transition shadow-lg"
            >
              + New Story
            </Link>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <AdminNav />

        {/* Tab Content */}
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
