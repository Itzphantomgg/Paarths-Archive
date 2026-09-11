import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { stories: true },
        },
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chapters." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, description, coverImage, order } = body;

    if (!title) {
      return NextResponse.json({ error: "Chapter title is required." }, { status: 400 });
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.chapter.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const maxOrderChapter = await prisma.chapter.findFirst({
      orderBy: { number: "desc" },
    });
    const nextNumber = (maxOrderChapter?.number || 0) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        number: nextNumber,
        title: title.trim().toUpperCase(),
        slug,
        subtitle: subtitle?.trim() || null,
        description: description?.trim() || null,
        coverImage: coverImage?.trim() || null,
        order: order !== undefined ? parseInt(order, 10) : nextNumber,
      },
    });

    return NextResponse.json({ success: true, chapter }, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json({ error: "Failed to create chapter." }, { status: 500 });
  }
}
