import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const { title, subtitle, description, coverImage, order, number } = body;

    const updated = await prisma.chapter.update({
      where: { id },
      data: {
        ...(title && { title: title.trim().toUpperCase() }),
        ...(subtitle !== undefined && { subtitle: subtitle?.trim() || null }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(coverImage !== undefined && { coverImage: coverImage?.trim() || null }),
        ...(order !== undefined && { order: parseInt(order, 10) }),
        ...(number !== undefined && { number: parseInt(number, 10) }),
      },
    });

    return NextResponse.json({ success: true, chapter: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chapter." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await prisma.chapter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Chapter deleted." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chapter." }, { status: 500 });
  }
}
