"use client";

import { useState } from "react";
import { toast } from "sonner";
import { NoteCard } from "@/components/notes/note-card";
import { NoteWithRelations } from "@/types";

interface RecentNotesListProps {
  notes: NoteWithRelations[];
}

async function toggleNoteField(noteId: string, field: "isPinned" | "isFavorite" | "isArchived", currentValue: boolean) {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !currentValue }),
    });
    if (!response.ok) throw new Error("Failed to update");
    return true;
  } catch {
    return false;
  }
}

export function RecentNotesList({ notes: initialNotes }: RecentNotesListProps) {
  const [notes, setNotes] = useState(initialNotes);

  const handleTogglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const success = await toggleNoteField(id, "isPinned", note.isPinned);
    if (success) {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
      );
      toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
    } else {
      toast.error("Failed to toggle pin");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const success = await toggleNoteField(id, "isFavorite", note.isFavorite);
    if (success) {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
      );
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    } else {
      toast.error("Failed to toggle favorite");
    }
  };

  const handleToggleArchive = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const success = await toggleNoteField(id, "isArchived", note.isArchived);
    if (success) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
    } else {
      toast.error("Failed to toggle archive");
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
          onToggleArchive={handleToggleArchive}
        />
      ))}
    </div>
  );
}
