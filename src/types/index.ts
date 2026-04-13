import { Note, Category, Tag, User } from "@prisma/client";

/** Extended Note type with relations */
export interface NoteWithRelations extends Note {
  category: Category | null;
  tags: (Tag & { _count?: { notes: number } })[];
}

/** Extended Category type with note count */
export interface CategoryWithCount extends Category {
  _count: {
    notes: number;
  };
}

/** User without password */
export type SafeUser = Omit<User, "password">;

/** Dashboard statistics */
export interface DashboardStats {
  totalNotes: number;
  totalCategories: number;
  totalTags: number;
  pinnedNotes: number;
  archivedNotes: number;
  favoriteNotes: number;
  recentNotes: NoteWithRelations[];
}

/** Notes query parameters */
export interface NotesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tagId?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
