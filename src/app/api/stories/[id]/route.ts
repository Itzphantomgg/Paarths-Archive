import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, estimateReadingTime } from "@/lib/utils";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        chapter: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }

    if (story.status === "DRAFT" && !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch story." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      content,
      excerpt,
      chapterId,
      status,
      storyType,
      approximateDate,
      year,
      location,
      peopleInvolved,
      mood,
      coverImage,
      isFeatured,
      tags = [],
    } = body;

    const existing = await prisma.story.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }

    const readingTime = content ? estimateReadingTime(content) : existing.readingTimeMinutes;

    let publishedAt = existing.publishedAt;
    if (status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      publishedAt = new Date();
    }

    const updated = await prisma.story.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        subtitle: subtitle !== undefined ? subtitle?.trim() || null : existing.subtitle,
        content: content !== undefined ? content : existing.content,
        excerpt: excerpt !== undefined ? excerpt?.trim() || null : existing.excerpt,
        chapterId: chapterId !== undefined ? (chapterId ? chapterId : null) : existing.chapterId,
        status: status || existing.status,
        storyType: storyType || existing.storyType,
        approximateDate:
          approximateDate !== undefined ? approximateDate?.trim() || null : existing.approximateDate,
        year: year !== undefined ? (year ? parseInt(year, 10) : null) : existing.year,
        location: location !== undefined ? location?.trim() || null : existing.location,
        peopleInvolved:
          peopleInvolved !== undefined ? peopleInvolved?.trim() || null : existing.peopleInvolved,
        mood: mood !== undefined ? mood?.trim() || null : existing.mood,
        coverImage: coverImage !== undefined ? coverImage?.trim() || null : existing.coverImage,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        readingTimeMinutes: readingTime,
        publishedAt,
      },
    });

    if (Array.isArray(tags)) {
      await prisma.storyTag.deleteMany({
        where: { storyId: id },
      });

      for (const rawTag of tags) {
        const tagName = rawTag.trim();
        if (!tagName) continue;
        const tagSlug = slugify(tagName);

        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });

        await prisma.storyTag.create({
          data: {
            storyId: id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, story: updated });
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Failed to update story." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Memory removed from archive." });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json({ error: "Failed to delete story." }, { status: 500 });
  }
}
