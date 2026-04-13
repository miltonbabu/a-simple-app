"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { noteSchema, type NoteInput } from "@/lib/validations";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { TagInput } from "@/components/tags/tag-input";
import { Tag } from "@prisma/client";

interface NoteEditorProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    categoryId?: string | null;
    tags: Tag[];
  };
  categories?: Category[];
  availableTags?: Tag[];
  onSubmit: (data: NoteInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function NoteEditor({
  initialData,
  categories = [],
  availableTags = [],
  onSubmit,
  isLoading = false,
  submitLabel = "Save Note",
}: NoteEditorProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialData?.tags || [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      categoryId: initialData?.categoryId || "",
      tagIds: initialData?.tags?.map((t) => t.id) || [],
    },
  });

  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value === "" ? "" : value);
  };

  useEffect(() => {
    setValue(
      "tagIds",
      selectedTags.map((t) => t.id),
    );
  }, [selectedTags, setValue]);

  const onFormSubmit = async (data: NoteInput) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>{initialData ? "Edit Note" : "Create New Note"}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Start writing your note..."
              rows={12}
              {...register("content")}
              aria-invalid={!!errors.content}
              className="resize-y min-h-[300px]"
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...register("categoryId")}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
