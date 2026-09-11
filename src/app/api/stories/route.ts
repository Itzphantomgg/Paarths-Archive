import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify, estimateReadingTime } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const chapterId = searchParams.get("chapterId");

    // If unauthenticated, only allow fetching PUBLISHED stories
    const whereClause: any = {};
    if (!user) {
      whereClause.status = "PUBLISHED";
    } else if (status) {
      whereClause.status = status;
    }

    if (chapterId) {
      whereClause.chapterId = chapterId;
    }

    const stories = await prisma.story.findMany({
      where: whereClause,
      include: {
        chapter: {
          select: { id: true, title: true, number: true, slug: true },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      status = "DRAFT",
      storyType = "MEMORIES",
      approximateDate,
      year,
      location,
      peopleInvolved,
      mood,
      coverImage,
      isFeatured = false,
      tags = [], // array of tag strings
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and story content are required." },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.story.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const readingTime = estimateReadingTime(content);

    const story = await prisma.story.create({
      data: {
        title: title.trim(),
        slug,
        subtitle: subtitle?.trim() || null,
        content,
        excerpt: excerpt?.trim() || subtitle?.trim() || null,
        chapterId: chapterId || null,
        status,
        storyType,
        approximateDate: approximateDate?.trim() || null,
        year: year ? parseInt(year, 10) : null,
        location: location?.trim() || null,
        peopleInvolved: peopleInvolved?.trim() || null,
        mood: mood?.trim() || null,
        coverImage: coverImage?.trim() || null,
        isFeatured: Boolean(isFeatured),
        readingTimeMinutes: readingTime,
        authorId: user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Handle tags
    if (Array.isArray(tags) && tags.length > 0) {
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
            storyId: story.id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json({ error: "Failed to record memory." }, { status: 500 });
  }
}
