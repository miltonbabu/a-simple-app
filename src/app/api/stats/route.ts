import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/types";

/**
 * GET /api/stats - Get dashboard statistics for current user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Run all count queries in parallel for better performance
    const [
      totalNotes,
      totalCategories,
      totalTags,
      pinnedNotes,
      archivedNotes,
      favoriteNotes,
      recentNotes,
    ] = await Promise.all([
      // Total notes (excluding archived)
      prisma.note.count({
        where: { userId, isArchived: false },
      }),
      // Total categories
      prisma.category.count({
        where: { userId },
      }),
      // Total unique tags used by user's notes
      prisma.noteTag.groupBy({
        by: ["tagId"],
        where: {
          note: { userId },
        },
      }).then((groups) => groups.length),
      // Pinned notes
      prisma.note.count({
        where: { userId, isPinned: true, isArchived: false },
      }),
      // Archived notes
      prisma.note.count({
        where: { userId, isArchived: true },
      }),
      // Favorite notes
      prisma.note.count({
        where: { userId, isFavorite: true, isArchived: false },
      }),
      // Recent 5 notes (for activity feed)
      prisma.note.findMany({
        where: { userId, isArchived: false },
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

    // Transform recent notes
    const transformedRecentNotes = recentNotes.map((note) => ({
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    }));

    const stats: DashboardStats = {
      totalNotes,
      totalCategories,
      totalTags,
      pinnedNotes,
      archivedNotes,
      favoriteNotes,
      recentNotes: transformedRecentNotes,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
