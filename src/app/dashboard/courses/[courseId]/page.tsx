"use client";

import { useState } from "react";
import { ChevronDown, Menu, Search, Bell, Sparkles, X } from "lucide-react";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import AiTutorBanner from "@/components/dashboard/courses/AiTutorBanner";
import CourseSidebar from "@/components/dashboard/courses/CoursesSidebar";
import CourseFilters from "@/components/dashboard/courses/CourseFilters";
import { RECOMMENDED_COURSES, POPULAR_COURSES } from "@/data/courses";

export default function CoursesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Mobile top bar ── */}
      <div className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">
        {/* Hamburger opens course filters drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100"
          aria-label="Open filters"
        >
          <Menu size={20} />
        </button>

        <span className="text-sm font-semibold text-gray-800">Explore Courses</span>

        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(o => !o)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Search">
            <Search className="size-5" />
          </button>
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Notifications">
            <Bell className="size-5" />
          </button>
          <button className="rounded-full p-2 text-violet-500 hover:bg-gray-100" aria-label="AI">
            <Sparkles className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile search bar — expands when search icon tapped */}
      {searchOpen && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 lg:hidden">
          <Search className="size-4 shrink-0 text-gray-400" />
          <input
            autoFocus
            placeholder="Search for courses..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={() => setSearchOpen(false)}>
            <X className="size-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setDrawerOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-white shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <span className="text-sm font-semibold text-gray-700">Filters</span>
              <button onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="size-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CourseFilters showLogo={false} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </aside>
        </>
      )}

      {/* ── Desktop topbar ── */}
      <header className="hidden h-[73px] items-center gap-4 border-b border-gray-100 bg-white px-6 lg:flex">
        <div className="relative mx-auto w-full max-w-2xl flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search for engineering or design courses..."
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-50"><Bell className="size-5" /></button>
        <button className="rounded-full p-2 text-violet-500 hover:bg-gray-50"><Sparkles className="size-5" /></button>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex">
        {/* Desktop sidebar — ONE sidebar, no duplication */}
        <CourseSidebar />

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recommended for You</h1>
              <p className="mt-1 text-sm text-gray-500">Based on your interest in Engineering & Design</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Sort by: Most Relevant <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDED_COURSES.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Popular This Week</h2>
            <p className="mt-1 text-sm text-gray-500">Trending topics in your community</p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_COURSES.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-10">
            <AiTutorBanner />
          </div>
        </main>
      </div>
    </div>
  );
}