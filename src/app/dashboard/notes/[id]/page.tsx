"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteWithRelations } from "@/types";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trash2, Pin, Star, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CategoryWithCount } from "@/types";

/**
 * Edit existing note page
 */
export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [note, setNote] = useState<NoteWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);

  const noteId = params.id as string;

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (response.ok) {
          const data = await response.json();
          setNote(data);
        } else if (response.status === 404) {
          toast.error("Note not found");
          router.push("/dashboard/notes");
        }
      } catch (error) {
        console.error("Failed to fetch note:", error);
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    if (session && noteId) {
      fetchNote();
    }
  }, [session, noteId, router]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    if (session) {
      fetchCategories();
    }
  }, [session]);

  if (!session || loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/notes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl text-center py-12">
        <p className="text-muted-foreground">Note not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/dashboard/notes">Back to Notes</Link>
        </Button>
      </div>
    );
  }

  /** Handle updating the note */
  const handleUpdateNote = async (data: {
    title: string;
    content: string;
    categoryId?: string | null;
    tagIds?: string[];
    isPinned?: boolean;
    isArchived?: boolean;
    isFavorite?: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update note");
      }

      toast.success("Note updated successfully!");
      const updatedNote = await response.json();
      setNote(updatedNote);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update note");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle deleting the note */
  const handleDeleteNote = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      toast.success("Note deleted successfully!");
      router.push("/dashboard/notes");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async () => {
    if (!note) return;
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (!response.ok) throw new Error("Failed to update");
      const updated = await response.json();
      setNote(updated);
      toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
    } catch (error) {
      toast.error("Failed to toggle pin");
    }
  };

  const handleToggleFavorite = async () => {
    if (!note) return;
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update");
      const updated = await response.json();
      setNote(updated);
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error("Failed to toggle favorite");
    }
  };

  const handleToggleArchive = async () => {
    if (!note) return;
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !note.isArchived }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
      router.push("/dashboard/notes");
    } catch (error) {
      toast.error("Failed to toggle archive");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/notes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Note</h1>
            <p className="text-muted-foreground mt-1">Modify your note</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleTogglePin}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin className={`h-4 w-4 ${note.isPinned ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFavorite}
            title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-4 w-4 ${note.isFavorite ? "fill-current text-yellow-500" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleArchive}
            title={note.isArchived ? "Unarchive note" : "Archive note"}
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardContent className="pt-6">
          <NoteEditor
            initialData={{
              title: note.title,
              content: note.content,
              categoryId: note.categoryId || undefined,
              tagIds: note.tags.map((t) => t.id),
              isPinned: note.isPinned,
              isFavorite: note.isFavorite,
            }}
            onSubmit={handleUpdateNote}
            isLoading={isSubmitting}
            submitLabel="Save Changes"
            categories={categories}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDeleteNote}
        confirmLabel="Delete"
      />
    </div>
  );
}
