"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Category } from "@prisma/client";
import { Filter } from "lucide-react";

interface NoteFiltersProps {
  /** Available categories for filtering */
  categories?: Category[];
  /** Currently selected category filter */
  selectedCategory?: string;
  /** Currently selected sort field */
  sortBy?: "createdAt" | "updatedAt" | "title";
  /** Currently selected sort order */
  sortOrder?: "asc" | "desc";
  /** Callback when category filter changes */
  onCategoryChange?: (value: string) => void;
  /** Callback when sort field changes */
  onSortByChange?: (value: "createdAt" | "updatedAt" | "title") => void;
  /** Callback when sort order changes */
  onSortOrderChange?: (value: "asc" | "desc") => void;
}

/**
 * Note filters component with category dropdown and sorting options
 * Allows filtering by category and sorting by various fields
 */
export function NoteFilters({
  categories = [],
  selectedCategory,
  sortBy = "updatedAt",
  sortOrder = "desc",
  onCategoryChange,
  onSortByChange,
  onSortOrderChange,
}: NoteFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <Filter className="h-5 w-5 text-muted-foreground mt-2 sm:mt-0" />

      {/* Category Filter */}
      <div className="w-full sm:w-[200px] space-y-1">
        <Label className="text-xs font-medium">Category</Label>
        <Select value={selectedCategory || "all"} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="w-full sm:w-[180px] space-y-1">
        <Label className="text-xs font-medium">Sort By</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last Modified</SelectItem>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="w-full sm:w-[140px] space-y-1">
        <Label className="text-xs font-medium">Order</Label>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
