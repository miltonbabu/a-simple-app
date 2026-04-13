import { redirect } from "next/navigation";

/**
 * Root page - redirect to dashboard or login based on auth status
 */
export default function HomePage() {
  redirect("/dashboard");
}
