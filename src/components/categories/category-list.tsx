"use client";

import { useState } from "react";
import { Pencil, Trash2, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CategoryWithCount } from "@/types";

interface CategoryListProps {
  /** Array of categories to display */
  categories: CategoryWithCount[];
  /** Callback when edit is requested */
  onEdit?: (category: CategoryWithCount) => void;
  /** Callback when delete is requested */
  onDelete?: (id: string) => Promise<void>;
}

/**
 * List component displaying all categories with edit/delete actions
 * Shows category name, color, icon, and note count
 */
export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (deleteId && onDelete) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first category to organize your notes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                {/* Category Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Color & Icon */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  >
                    {category.icon.slice(0, 2)}
                  </div>

                  {/* Name & Count */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{category.name}</h4>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {category._count.notes} {category._count.notes === 1 ? "note" : "notes"}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(category)}
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(category.id)}
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? Notes in this category will become uncategorized."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
