import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = (await getCurrentUser())!;

  const [storiesCount, chaptersCount, tagsCount] = await Promise.all([
    prisma.story.count(),
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
