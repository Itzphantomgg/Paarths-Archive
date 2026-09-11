import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StoryEditorClient from "./StoryEditorClient";

export const dynamic = "force-dynamic";

interface EditorPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function AdminEditorPage({ searchParams }: EditorPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const storyId = resolvedParams.id || null;

  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true, number: true },
  });

  let initialStory = null;
  if (storyId) {
    initialStory = await prisma.story.findFirst({
      where: { id: storyId, authorId: user.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // If story belongs to another user or doesn't exist, redirect to their archive
    if (!initialStory) {
      redirect("/admin");
    }
  }

  return (
    <StoryEditorClient
      chapters={chapters}
      storyId={storyId}
      initialStory={initialStory}
    />
  );
}
