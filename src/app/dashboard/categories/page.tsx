"use client";

import { useEffect, useState } from "react";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";
import { CategoryWithCount } from "@/types";
import { CategoryInput } from "@/lib/validations";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Categories management page with create/edit/delete functionality
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithCount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount and after changes
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /** Handle creating a new category */
  const handleCreate = async (data: CategoryInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      toast.success("Category created successfully!");
      setIsCreating(false);
      fetchCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle updating an existing category */
  const handleUpdate = async (data: CategoryInput) => {
    if (!editingCategory) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      toast.success("Category updated successfully!");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle deleting a category */
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize your notes into categories
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Create/Edit Form (shown when creating or editing) */}
      {(isCreating || editingCategory) && (
        <Card>
          <CardContent className="pt-6">
            <CategoryForm
              initialData={
                editingCategory
                  ? {
                      id: editingCategory.id,
                      name: editingCategory.name,
                      color: editingCategory.color,
                      icon: editingCategory.icon,
                    }
                  : undefined
              }
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={(category) => {
          setEditingCategory(category);
          setIsCreating(false);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
