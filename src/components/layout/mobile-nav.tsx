"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  X,
  StickyNote,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useSession } from "next-auth/react";

/** Navigation items for mobile */
const mobileNavItems = [
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

interface MobileNavProps {
  /** Whether the mobile navigation is open */
  open: boolean;
  /** Callback to toggle open state */
  onOpenChange: (open: boolean) => void;
  /** Optional callback for creating new note */
  onCreateNote?: () => void;
}

/**
 * Mobile navigation component using sheet/drawer pattern
 * Displays on smaller screens as a slide-out menu
 */
export function MobileNav({ open, onOpenChange, onCreateNote }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="px-6 py-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <StickyNote className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">NoteVault</span>
          </SheetTitle>
        </SheetHeader>

        {/* User Info */}
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} alt="" />
            <AvatarFallback>{getInitials(session?.user?.name || "U")}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{session?.user?.name}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[160px]">
              {session?.user?.email}
            </span>
          </div>
        </div>

        {/* Create Note Button */}
        <div className="px-4 py-4">
          <Button onClick={onCreateNote} className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 pb-4 space-y-1">
          {mobileNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
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
      </SheetContent>
    </Sheet>
  );
}
