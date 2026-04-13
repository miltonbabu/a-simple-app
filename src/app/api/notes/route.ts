import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NoteWithRelations, PaginatedResponse, NotesQueryParams } from "@/types";

/**
 * GET /api/notes - List notes with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || undefined;
    const tagId = searchParams.get("tagId") || undefined;
    const sortBy = (searchParams.get("sortBy") as NotesQueryParams["sortBy"]) || "updatedAt";
    const sortOrder = (searchParams.get("sortOrder") as NotesQueryParams["sortOrder"]) || "desc";
    const isPinned = searchParams.get("isPinned") === "true" ? true : searchParams.get("isPinned") === "false" ? false : undefined;
    const isArchived = searchParams.get("isArchived") === "true" ? true : searchParams.get("isArchived") === "false" ? false : undefined;
    const isFavorite = searchParams.get("isFavorite") === "true" ? true : searchParams.get("isFavorite") === "false" ? false : undefined;

    // Build where clause
    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: { tagId },
      };
    }

    if (isPinned !== undefined) {
      where.isPinned = isPinned;
    }

    if (isArchived !== undefined) {
      where.isArchived = isArchived;
    }

    if (isFavorite !== undefined) {
      where.isFavorite = isFavorite;
    }

    // Get total count
    const total = await prisma.note.count({ where });

    // Get notes with pagination
    const notes = await prisma.note.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform data to match expected format
    const transformedNotes: NoteWithRelations[] = notes.map((note) => ({
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    }));

    const response: PaginatedResponse<NoteWithRelations> = {
      items: transformedNotes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes - Create a new note
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, categoryId, tagIds, isPinned, isArchived, isFavorite } = body;

    // Create note with optional relations
    const note = await prisma.note.create({
      data: {
        title,
        content: content || "",
        categoryId: categoryId || null,
        userId: session.user.id,
        isPinned: isPinned || false,
        isArchived: isArchived || false,
        isFavorite: isFavorite || false,
        tags: tagIds && tagIds.length > 0
          ? {
              create: tagIds.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
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

    // Transform response
    const transformedNote: NoteWithRelations = {
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    };

    return NextResponse.json(transformedNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { message: "Failed to create note" },
      { status: 500 }
    );
  }
}
