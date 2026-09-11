import React from "react";
import { prisma } from "@/lib/db";
import StoryEditorClient from "./StoryEditorClient";

export const dynamic = "force-dynamic";

interface EditorPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function AdminEditorPage({ searchParams }: EditorPageProps) {
  const resolvedParams = await searchParams;
  const storyId = resolvedParams.id || null;

  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true, number: true },
  });

  let initialStory = null;
  if (storyId) {
    initialStory = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  return (
    <StoryEditorClient
      chapters={chapters}
      storyId={storyId}
      initialStory={initialStory}
    />
  );
}
