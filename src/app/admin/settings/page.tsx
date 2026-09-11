import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const [storiesCount, chaptersCount, tagsCount] = await Promise.all([
    prisma.story.count({ where: { authorId: user.id } }),
    prisma.chapter.count(),
    prisma.tag.count(),
  ]);

  return (
    <SettingsClient
      user={user}
      counts={{
        stories: storiesCount,
        chapters: chaptersCount,
        tags: tagsCount,
      }}
    />
  );
}
