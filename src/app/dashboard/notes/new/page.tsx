"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NoteEditor } from "@/components/notes/note-editor";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CategoryWithCount } from "@/types";

/**
 * Create new note page
 */
export default function NewNotePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);

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

  if (!session) {
    return null;
  }

  /** Handle creating a new note */
  const handleCreateNote = async (data: {
    title: string;
    content: string;
    categoryId?: string;
    tagIds?: string[];
    isPinned?: boolean;
    isArchived?: boolean;
    isFavorite?: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create note");
      }

      const note = await response.json();
      toast.success("Note created successfully!");
      router.push(`/dashboard/notes/${note.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/notes">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Note</h1>
          <p className="text-muted-foreground mt-1">Create a new note</p>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardContent className="pt-6">
          <NoteEditor
            onSubmit={handleCreateNote}
            isLoading={isSubmitting}
            submitLabel="Create Note"
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
