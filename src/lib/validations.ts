import { z } from "zod";

/** Schema for user registration validation */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/** Schema for user login validation */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/** Schema for note creation/update validation */
export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().default(""),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
});

/** Schema for category creation/update validation */
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").default("#3B82F6"),
  icon: z.string().default("Folder"),
});

/** Schema for tag creation validation */
export const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(30, "Name too long"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").default("#8B5CF6"),
});

/** Type for registration form data */
export type RegisterInput = z.infer<typeof registerSchema>;

/** Type for login form data */
export type LoginInput = z.infer<typeof loginSchema>;

/** Type for note form data */
export type NoteInput = z.infer<typeof noteSchema>;

/** Type for category form data */
export type CategoryInput = z.infer<typeof categorySchema>;

/** Type for tag form data */
export type TagInput = z.infer<typeof tagSchema>;
