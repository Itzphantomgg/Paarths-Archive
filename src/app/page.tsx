import React from "react";
import { prisma } from "@/lib/db";
import CinematicHero from "@/components/hero/CinematicHero";
import ChapterTimeline from "@/components/timeline/ChapterTimeline";
import FeaturedStories from "@/components/story/FeaturedStories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch chapters with published story count
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: {
          stories: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
  });

  // Fetch featured published stories
  const stories = await prisma.story.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 6,
    include: {
      chapter: {
        select: {
          number: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Section */}
      <CinematicHero />

      {/* 2. Chapters / Archive Timeline */}
      <ChapterTimeline chapters={chapters} />

      {/* 3. Editorial Story Cards */}
      <FeaturedStories stories={stories} />
    </div>
  );
}
