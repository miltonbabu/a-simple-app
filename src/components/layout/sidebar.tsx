"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  Plus,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/** Navigation items configuration */
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notes",
    href: "/dashboard/notes",
    icon: FileText,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  /** Optional callback for creating new note */
  onCreateNote?: () => void;
}

/**
 * Main navigation sidebar component
 * Displays navigation links and quick actions
 */
export function Sidebar({ onCreateNote }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-card border-r overflow-y-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <StickyNote className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-foreground">NoteVault</h1>
        </div>

        {/* Create Note Button */}
        <div className="px-4 mb-4">
          <Button
            onClick={onCreateNote}
            className="w-full"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <Separator />

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
