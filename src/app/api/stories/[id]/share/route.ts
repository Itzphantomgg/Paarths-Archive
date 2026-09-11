import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST: Generate a new secure private share link
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }

    // Verify ownership
    if (story.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Not your story." }, { status: 403 });
    }

    // Generate unguessable 32-character cryptographic random token
    const shareToken = crypto.randomBytes(16).toString("hex");

    const updated = await prisma.story.update({
      where: { id },
      data: {
        shareToken,
        shareStatus: "SHARED",
        sharedAt: new Date(),
        shareRevokedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      shareToken: updated.shareToken,
      shareStatus: updated.shareStatus,
      shareUrl: `/shared/${updated.shareToken}`,
    });
  } catch (error) {
    console.error("[api/stories/share] Error generating share token:", error);
    return NextResponse.json({ error: "Failed to generate share link." }, { status: 500 });
  }
}

// DELETE: Revoke sharing immediately
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }

    if (story.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Not your story." }, { status: 403 });
    }

    const updated = await prisma.story.update({
      where: { id },
      data: {
        shareStatus: "REVOKED",
        shareRevokedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Private share link revoked.",
      shareStatus: updated.shareStatus,
    });
  } catch (error) {
    console.error("[api/stories/share] Error revoking share token:", error);
    return NextResponse.json({ error: "Failed to revoke share link." }, { status: 500 });
  }
}
