import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NoteWithRelations } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/notes/[id] - Get a single note by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    const transformedNote: NoteWithRelations = {
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    };

    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { message: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notes/[id] - Update a note
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, categoryId, tagIds, isPinned, isArchived, isFavorite } = body;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    // Update note
    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        content: content || "",
        categoryId: categoryId || null,
        isPinned: isPinned ?? existingNote.isPinned,
        isArchived: isArchived ?? existingNote.isArchived,
        isFavorite: isFavorite ?? existingNote.isFavorite,
        // Handle tag updates: delete old connections and create new ones
        ...(tagIds !== undefined && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const transformedNote: NoteWithRelations = {
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    };

    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { message: "Failed to update note" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notes/[id] - Delete a note
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    // Delete note (cascade will handle NoteTag entries)
    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { message: "Failed to delete note" },
      { status: 500 }
    );
  }
}
