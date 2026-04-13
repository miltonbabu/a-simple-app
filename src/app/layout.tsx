import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { SessionProviderWrapper } from "@/components/shared/session-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteVault - Your Personal Note Manager",
  description:
    "A modern note-taking application to organize your thoughts, ideas, and tasks efficiently.",
  keywords: ["notes", "note-taking", "productivity", "organization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper>
            {children}
            <Toaster position="bottom-right" richColors />
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
