import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { DashboardStatsSkeleton } from "@/components/shared/loading-skeleton";
import { NoteCard } from "@/components/notes/note-card";
import { RecentNotesList } from "@/components/notes/recent-notes-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Tag, Star, Archive, Pin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function getDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const [
    totalNotes,
    totalCategories,
    totalTags,
    pinnedNotes,
    archivedNotes,
    favoriteNotes,
    recentNotes,
  ] = await Promise.all([
    prisma.note.count({ where: { userId, isArchived: false } }),
    prisma.category.count({ where: { userId } }),
    prisma.noteTag
      .groupBy({
        by: ["tagId"],
        where: { note: { userId } },
      })
      .then((groups) => groups.length),
    prisma.note.count({ where: { userId, isPinned: true, isArchived: false } }),
    prisma.note.count({ where: { userId, isArchived: true } }),
    prisma.note.count({
      where: { userId, isFavorite: true, isArchived: false },
    }),
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

  const transformedRecentNotes = recentNotes.map((note) => ({
    ...note,
    tags: note.tags.map((nt) => nt.tag),
  }));

  return {
    totalNotes,
    totalCategories,
    totalTags,
    pinnedNotes,
    archivedNotes,
    favoriteNotes,
    recentNotes: transformedRecentNotes,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Please log in to view your dashboard.
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: FileText,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Tags",
      value: stats.totalTags,
      icon: Tag,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Pinned",
      value: stats.pinnedNotes,
      icon: Pin,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.favoriteNotes} notes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Archive className="h-5 w-5 text-gray-500" />
              Archived
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.archivedNotes} notes</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Notes</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/notes">View All</Link>
          </Button>
        </div>

        {stats.recentNotes.length > 0 ? (
          <RecentNotesList notes={stats.recentNotes} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first note to get started!
              </p>
              <Button asChild>
                <Link href="/dashboard/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
