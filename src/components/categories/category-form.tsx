"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { toast } from "sonner";

/** Predefined color options for categories */
const COLOR_OPTIONS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

/** Predefined icon options */
const ICON_OPTIONS = [
  "Folder",
  "Book",
  "Briefcase",
  "Heart",
  "Star",
  "Lightbulb",
  "Code",
  "Music",
  "Camera",
  "Plane",
];

interface CategoryFormProps {
  /** Existing category data for editing mode */
  initialData?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  /** Submit callback */
  onSubmit: (data: CategoryInput) => Promise<void>;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Form component for creating and editing categories
 * Includes name input, color picker, and icon selector
 */
export function CategoryForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const [selectedColor, setSelectedColor] = useState(initialData?.color || COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || ICON_OPTIONS[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      color: selectedColor,
      icon: selectedIcon,
    },
  });

  const handleFormSubmit = async (data: CategoryInput) => {
    await onSubmit({
      ...data,
      color: selectedColor,
      icon: selectedIcon,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Category" : "Create New Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="Enter category name..."
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-2 rounded-md border text-sm transition-all ${
                    selectedIcon === icon
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  aria-label={`Select icon ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {initialData ? "Update Category" : "Create Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
