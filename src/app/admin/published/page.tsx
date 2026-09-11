import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StoryManagerTable from "@/components/admin/StoryManagerTable";

export const dynamic = "force-dynamic";

export default async function AdminSharedPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const stories = await prisma.story.findMany({
    where: {
      authorId: user.id,
      shareStatus: "SHARED",
    },
    orderBy: { sharedAt: "desc" },
    include: {
      chapter: {
        select: { id: true, title: true, number: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-2xl text-white italic">
          Shared Dispatches
        </h2>
        <p className="font-mono text-xs text-neutral-400 mt-1">
          Stories intentionally shared via private cryptographic links. You may copy links or revoke access at any time.
        </p>
      </div>

      <StoryManagerTable initialStories={stories as any} />
    </div>
  );
}
