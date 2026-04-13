"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();

  const handleCreateNote = () => {
    router.push("/dashboard/notes/new");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar onCreateNote={handleCreateNote} />

      {/* Main Content Area */}
      <div className="md:pl-64">
        {/* Header */}
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
}
