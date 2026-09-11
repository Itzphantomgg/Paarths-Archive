"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileEdit, Layers, Settings, PlusCircle, CheckCircle, FileText } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "ALL STORIES", href: "/admin", icon: BookOpen, exact: true },
    { label: "DRAFTS", href: "/admin/drafts", icon: FileText },
    { label: "PUBLISHED", href: "/admin/published", icon: CheckCircle },
    { label: "CHAPTERS", href: "/admin/chapters", icon: Layers },
    { label: "WRITE STORY", href: "/admin/editor", icon: FileEdit },
    { label: "SETTINGS", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 font-mono text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition whitespace-nowrap ${
              isActive
                ? "border-white bg-white/10 text-white font-medium shadow-inner"
                : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
