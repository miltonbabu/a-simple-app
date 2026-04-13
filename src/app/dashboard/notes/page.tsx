"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/use-notes";
import { NoteList } from "@/components/notes/note-list";
import { NoteSearch } from "@/components/notes/note-search";
import { NoteFilters } from "@/components/notes/note-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category } from "@prisma/client";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";

/**
 * Notes list page with search, filters, and grid/list view
 */
export default function NotesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    notes,
    loading,
    params,
    updateParams,
    refetch,
  } = useNotes();

  // Fetch categories on mount
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

    fetchCategories();
  }, []);

  /** Handle search input change */
  const handleSearch = useCallback(
    (value: string) => {
      updateParams({ search: value || undefined });
    },
    [updateParams]
  );

  /** Handle category filter change */
  const handleCategoryChange = useCallback(
    (value: string) => {
      updateParams({
        categoryId: value === "all" ? undefined : value,
        page: 1,
      });
    },
    [updateParams]
  );

  /** Handle sort field change */
  const handleSortByChange = useCallback(
    (value: "createdAt" | "updatedAt" | "title") => {
      updateParams({ sortBy: value });
    },
    [updateParams]
  );

  /** Handle sort order change */
  const handleSortOrderChange = useCallback(
    (value: "asc" | "desc") => {
      updateParams({ sortOrder: value });
    },
    [updateParams]
  );

  /** Toggle note pin status */
  const handleTogglePin = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: true }), // Will be handled by API to toggle
      });

      if (!response.ok) throw new Error("Failed to toggle pin");
      
      refetch();
      toast.success("Note pin toggled");
    } catch (error) {
      toast.error("Failed to toggle pin");
    }
  };

  /** Toggle note favorite status */
  const handleToggleFavorite = async (id: string) => {
    try {
      // Get current note to determine new state
      const currentNote = notes.find((n) => n.id === id);
      if (!currentNote) return;

      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !currentNote.isFavorite }),
      });

      if (!response.ok) throw new Error("Failed to toggle favorite");

      refetch();
      toast.success("Note favorite toggled");
    } catch (error) {
      toast.error("Failed to toggle favorite");
    }
  };

  /** Toggle note archive status */
  const handleToggleArchive = async (id: string) => {
    try {
      const currentNote = notes.find((n) => n.id === id);
      if (!currentNote) return;

      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !currentNote.isArchived }),
      });

      if (!response.ok) throw new Error("Failed to toggle archive");

      refetch();
      toast.success(currentNote.isArchived ? "Note restored" : "Note archived");
    } catch (error) {
      toast.error("Failed to toggle archive");
    }
  };

  /** Delete note with confirmation */
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/notes/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setDeleteId(null);
      refetch();
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your notes
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/notes/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <NoteSearch onSearch={handleSearch} />

        <NoteFilters
          categories={categories}
          selectedCategory={params.categoryId}
          sortBy={params.sortBy}
          sortOrder={params.sortOrder}
          onCategoryChange={handleCategoryChange}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
        />
      </div>

      {/* Notes List */}
      <NoteList
        notes={notes}
        loading={loading}
        searchQuery={params.search}
        onTogglePin={handleTogglePin}
        onToggleFavorite={handleToggleFavorite}
        onToggleArchive={handleToggleArchive}
        onDelete={(id) => setDeleteId(id)}
        onCreateNote={() => router.push("/dashboard/notes/new")}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
