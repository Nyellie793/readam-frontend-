"use client";

import { Bell, Menu, Search, Sparkles } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Input } from "@/components/ui/Input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseFilters from "@/components/courses/CourseFilters";

interface CourseTopbarProps {
  searchPlaceholder?: string;
  showMobileFilters?: boolean;
}

/**
 * Shared top bar for the student-facing course browsing and lesson
 * pages. When `showMobileFilters` is set, the hamburger opens the same
 * CourseFilters sidebar in a <Sheet> — mirrors admin/Topbar's pattern.
 */
export default function CourseTopbar({
  searchPlaceholder,
  showMobileFilters = false,
}: CourseTopbarProps) {
  return (
    <header className="flex h-[73px] items-center gap-4 border-b border-gray-100 bg-white px-4 sm:px-6">
      {showMobileFilters && (
        <Sheet>
          <SheetTrigger className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5 text-gray-700" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <CourseFilters />
          </SheetContent>
        </Sheet>
      )}

      <Logo />

      {searchPlaceholder && (
        <div className="relative mx-auto hidden w-full max-w-xl sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder={searchPlaceholder} className="h-10 rounded-full pl-10" />
        </div>
      )}

      <div className={`flex items-center gap-2 ${searchPlaceholder ? "" : "ml-auto"}`}>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-50"
        >
          <Bell className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Ask ReadAm AI"
          className="rounded-full p-2 text-violet-500 transition-colors hover:bg-gray-50 hover:text-violet-600"
        >
          <Sparkles className="size-5" />
        </button>
      </div>
    </header>
  );
}
