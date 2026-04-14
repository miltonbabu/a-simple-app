"use client";

import { LucideIcon, FileText, FolderOpen, Tag, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  /** Icon to display */
  icon?: LucideIcon;
  /** Main message */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Action button click handler */
  onAction?: () => void;
}

/**
 * Reusable empty state component with icon and optional action
 * Used when there are no notes, categories, tags, etc.
 */
export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/** Pre-configured empty states for common scenarios */
export const EmptyStates = {
  notes: (onCreate?: () => void) => (
    <EmptyState
      icon={FileText}
      title="No notes yet"
      description="Create your first note to get started organizing your thoughts and ideas."
      actionLabel="Create Note"
      onAction={onCreate}
    />
  ),
  searchResults: () => (
    <EmptyState
      icon={SearchX}
      title="No results found"
      description="Try adjusting your search or filter criteria."
    />
  ),
  categories: (onCreate?: () => void) => (
    <EmptyState
      icon={FolderOpen}
      title="No categories"
      description="Create categories to organize your notes better."
      actionLabel="Create Category"
      onAction={onCreate}
    />
  ),
  tags: () => (
    <EmptyState
      icon={Tag}
      title="No tags yet"
      description="Tags will appear here when you add them to your notes."
    />
  ),
};
