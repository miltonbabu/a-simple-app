"use client";

import { useState } from "react";
import { NoteWithRelations } from "@/types";
import { NoteCard } from "./note-card";
import { NotesGridSkeleton, NoteListSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyStates } from "@/components/shared/empty-state";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "grid" | "list";

interface NoteListProps {
  /** Array of notes to display */
  notes: NoteWithRelations[];
  /** Loading state */
  loading?: boolean;
  /** Search query for empty state detection */
  searchQuery?: string;
  /** Callback when pin is toggled */
  onTogglePin?: (id: string) => void;
  /** Callback when favorite is toggled */
  onToggleFavorite?: (id: string) => void;
  /** Callback when archive is toggled */
  onToggleArchive?: (id: string) => void;
  /** Callback when delete is requested */
  onDelete?: (id: string) => void;
  /** Callback when create note is requested */
  onCreateNote?: () => void;
}

/**
 * Container component for displaying notes in grid or list view
 * Handles empty states and loading skeletons automatically
 */
export function NoteList({
  notes,
  loading = false,
  searchQuery = "",
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onCreateNote,
}: NoteListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Show skeleton while loading
  if (loading) {
    return viewMode === "grid" ? <NotesGridSkeleton /> : <NoteListSkeleton />;
  }

  // Show empty state if no notes
  if (notes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {searchQuery ? EmptyStates.searchResults() : EmptyStates.notes(onCreateNote)}
      </div>
    );
  }

  // Render notes in selected view mode
  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="flex items-center border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notes Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTogglePin={onTogglePin}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTogglePin={onTogglePin}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
