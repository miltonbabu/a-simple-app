"use client";

import { Tag as TagType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  /** Tag data to display */
  tag: TagType;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional click handler */
  onClick?: () => void;
  /** Optional on remove handler */
  onRemove?: () => void;
}

type BadgeSize = "sm" | "md" | "lg";

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

/**
 * Tag badge component for displaying tags with colored background
 * Used in note cards, tag lists, and tag inputs
 */
export function TagBadge({
  tag,
  size = "md",
  onClick,
  onRemove,
}: TagBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "cursor-pointer transition-colors inline-flex items-center gap-1",
        sizeClasses[size],
        onClick && "hover:opacity-80"
      )}
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        borderColor: tag.color,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
          aria-label={`Remove ${tag.name} tag`}
        >
          ×
        </button>
      )}
    </Badge>
  );
}
