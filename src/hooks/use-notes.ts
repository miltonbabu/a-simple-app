"use client";

import { useState, useEffect, useCallback } from "react";
import { NoteWithRelations, NotesQueryParams, PaginatedResponse } from "@/types";

/**
 * Custom hook for fetching and managing notes with filtering and pagination
 */
export function useNotes(initialParams?: Partial<NotesQueryParams>) {
  const [notes, setNotes] = useState<NoteWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<NotesQueryParams>({
    page: 1,
    limit: 12,
    sortBy: "updatedAt",
    sortOrder: "desc",
    ...initialParams,
  });

  /** Fetch notes based on current parameters */
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.search) searchParams.set("search", params.search);
      if (params.categoryId) searchParams.set("categoryId", params.categoryId);
      if (params.tagId) searchParams.set("tagId", params.tagId);
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
      if (params.isPinned !== undefined) searchParams.set("isPinned", String(params.isPinned));
      if (params.isArchived !== undefined) searchParams.set("isArchived", String(params.isArchived));
      if (params.isFavorite !== undefined) searchParams.set("isFavorite", String(params.isFavorite));

      const response = await fetch(`/api/notes?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data: PaginatedResponse<NoteWithRelations> = await response.json();
      setNotes(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /** Update query parameters */
  const updateParams = useCallback((newParams: Partial<NotesQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  /** Reset to first page when filters change */
  const resetPage = useCallback(() => {
    setParams((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    notes,
    loading,
    error,
    total,
    params,
    updateParams,
    resetPage,
    refetch: fetchNotes,
  };
}
