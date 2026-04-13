"use client";

import Link from "next/link";
import { Pin, Star, Archive, Clock, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteWithRelations } from "@/types";
import { formatDate, truncateText } from "@/lib/utils";
import { TagBadge } from "@/components/tags/tag-badge";

interface NoteCardProps {
  /** Note data with relations */
  note: NoteWithRelations;
  /** Callback when pin is toggled */
  onTogglePin?: (id: string) => void;
  /** Callback when favorite is toggled */
  onToggleFavorite?: (id: string) => void;
  /** Callback when archive is toggled */
  onToggleArchive?: (id: string) => void;
  /** Callback when delete is requested */
  onDelete?: (id: string) => void;
}

/**
 * Note card component for displaying note preview in grid/list view
 * Shows title, excerpt, date, tags, and action buttons
 */
export function NoteCard({
  note,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
}: NoteCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/20 overflow-hidden">
      <Link href={`/dashboard/notes/${note.id}`}>
        <CardContent className="p-4">
          {/* Header with title and actions */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-base line-clamp-1 flex-1">
              {note.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Note options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onTogglePin && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      onTogglePin(note.id);
                    }}
                  >
                    <Pin className={`mr-2 h-4 w-4 ${note.isPinned ? "fill-current" : ""}`} />
                    {note.isPinned ? "Unpin" : "Pin"}
                  </DropdownMenuItem>
                )}
                {onToggleFavorite && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite(note.id);
                    }}
                  >
                    <Star className={`mr-2 h-4 w-4 ${note.isFavorite ? "fill-current text-yellow-500" : ""}`} />
                    {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                )}
                {onToggleArchive && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleArchive(note.id);
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    {note.isArchived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(note.id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content Preview */}
          {note.content && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {truncateText(note.content.replace(/<[^>]*>/g, ""), 150)}
            </p>
          )}

          {/* Category Badge */}
          {note.category && (
            <Badge
              variant="secondary"
              className="mb-3 text-xs"
              style={{ backgroundColor: `${note.category.color}20`, color: note.category.color }}
            >
              {note.category.name}
            </Badge>
          )}

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {note.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} tag={tag} size="sm" />
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer with date and status icons */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(note.updatedAt)}
            </span>
            <div className="flex items-center gap-1.5">
              {note.isPinned && <Pin className="h-3 w-3 fill-current text-primary" />}
              {note.isFavorite && <Star className="h-3 w-3 fill-current text-yellow-500" />}
              {note.isArchived && <Archive className="h-3 w-3" />}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
