import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tags - List all tags (global or user-specific)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get tags that are used by the current user's notes
    const tags = await prisma.tag.findMany({
      where: {
        notes: {
          some: {
            note: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tags - Create a new tag
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, color } = body;

    // Check if tag already exists (tags are global/unique)
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      return NextResponse.json(existingTag); // Return existing tag
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || "#8B5CF6",
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { message: "Failed to create tag" },
      { status: 500 }
    );
  }
}
