"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import CourseFilters from "@/components/dashboard/courses/CourseFilters";

interface CourseTopbarProps {
  searchPlaceholder?: string;
  showMobileFilters?: boolean;
}

export default function CourseTopbar({
  searchPlaceholder,
  showMobileFilters = false,
}: CourseTopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop topbar only — on mobile the DashboardMobileSidebar bar is used */}
      <header className="hidden lg:flex h-[73px] items-center gap-4 border-b border-gray-100 bg-white px-6">
        {searchPlaceholder && (
          <div className="relative mx-auto w-full max-w-2xl flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder={searchPlaceholder} className="h-10 rounded-full pl-10" />
          </div>
        )}

        <div className={`flex items-center gap-2 ${searchPlaceholder ? "" : "ml-auto"}`}>
          <Link href="/notifications" aria-label="Notifications"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-50">
            <Bell className="size-5" />
          </Link>
          <Link href="/dashboard/ai-tutor" aria-label="Ask ReadAm AI"
            className="rounded-full p-2 text-violet-500 transition-colors hover:bg-gray-50 hover:text-violet-600">
            <Sparkles className="size-5" />
          </Link>
        </div>
      </header>

      {/* Mobile filter drawer — triggered from DashboardMobileSidebar's hamburger on course pages.
          We expose a button here that the mobile top bar hamburger will open */}
      {showMobileFilters && (
        <>
          {mobileOpen && (
            <>
              <button
                type="button"
                aria-label="Close filters"
                className="fixed inset-0 z-40 cursor-pointer bg-black/40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              {/* h-dvh, not h-screen: iOS treats 100vh as the viewport without the
          browser chrome, so a fixed drawer runs taller than the visible area
          and its bottom controls sit below the fold, untappable. */}
              <aside className="fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col bg-white shadow-xl lg:hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                  <span className="text-sm font-semibold text-gray-700">Filters</span>
                  <button onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-1.5 hover:bg-gray-100">
                    <X className="size-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CourseFilters showLogo={false} onNavigate={() => setMobileOpen(false)} />
                </div>
              </aside>
            </>
          )}
        </>
      )}
    </>
  );
}