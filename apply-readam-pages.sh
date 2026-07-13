#!/usr/bin/env bash
# Applies the new/updated ReadAm pages to your repo.
# Run this from the ROOT of your readam-frontend- repo.
set -e

echo "Writing next.config.ts"
cat > "next.config.ts" << 'READAM_EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
READAM_EOF

echo "Writing src/app/courses/[courseId]/learn/page.tsx"
mkdir -p "src/app/courses/[courseId]/learn"
cat > "src/app/courses/[courseId]/learn/page.tsx" << 'READAM_EOF'
import { Download } from "lucide-react";
import CourseTopbar from "@/components/courses/CourseTopbar";
import VideoPlayer from "@/components/courses/VideoPlayer";
import CourseOutline from "@/components/courses/CourseOutline";
import ContinueLearningCard from "@/components/courses/ContinueLearningCard";
import { COURSE_OUTLINE, CONTINUE_LEARNING } from "@/data/student-mock";

export default function LessonPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <CourseTopbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <VideoPlayer
              poster="https://picsum.photos/seed/lecture-screen/1200/675"
              currentTime="12:45"
              duration="45:00"
              progress={28}
            />

            <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-medium text-blue-600">Mathematics • Chapter 4</p>
                <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  Advanced Calculus: Integration by Parts
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
                  In this module, we explore the fundamental techniques of integration by parts,
                  a powerful method derived from the product rule of differentiation. We will
                  solve practical engineering problems using these methods.
                </p>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="size-4" />
                Resources
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
                <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {CONTINUE_LEARNING.map((item) => (
                  <ContinueLearningCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>

          <CourseOutline modules={COURSE_OUTLINE} progress={45} />
        </div>
      </main>
    </div>
  );
}
READAM_EOF

echo "Writing src/app/courses/page.tsx"
mkdir -p "src/app/courses"
cat > "src/app/courses/page.tsx" << 'READAM_EOF'
import { ChevronDown } from "lucide-react";
import CourseTopbar from "@/components/courses/CourseTopbar";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseCard from "@/components/courses/CourseCard";
import AiTutorBanner from "@/components/courses/AiTutorBanner";
import { RECOMMENDED_COURSES, POPULAR_COURSES } from "@/data/courses";

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <CourseTopbar
        searchPlaceholder="Search for engineering or design courses..."
        showMobileFilters
      />

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
          <div className="fixed h-[calc(100vh-73px)] w-64">
            <CourseFilters />
          </div>
        </aside>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recommended for You</h1>
              <p className="mt-1 text-sm text-gray-500">
                Based on your interest in &quot;Engineering &amp; Design&quot;
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sort by: Most Relevant
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDED_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Popular This Week</h2>
            <p className="mt-1 text-sm text-gray-500">Trending topics in your community</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_COURSES.map((course) => (
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
READAM_EOF

echo "Writing src/app/dashboard/layout.tsx"
mkdir -p "src/app/dashboard"
cat > "src/app/dashboard/layout.tsx" << 'READAM_EOF'
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
READAM_EOF

echo "Writing src/app/dashboard/page.tsx"
mkdir -p "src/app/dashboard"
cat > "src/app/dashboard/page.tsx" << 'READAM_EOF'
import { Bell, Search, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/Input";
import StatCards from "@/components/admin/StatCards";
import Chart from "@/components/admin/Chart";
import CourseCard from "@/components/courses/CourseCard";
import AiTutorBanner from "@/components/courses/AiTutorBanner";
import RecentlyViewedItem from "@/components/dashboard/RecentlyViewedItem";
import { STUDY_STATS, WEEKLY_ACTIVITY, RECENTLY_VIEWED } from "@/data/student-mock";
import { DASHBOARD_RECOMMENDED } from "@/data/courses";

const BADGES = [
  { id: "streak", className: "bg-violet-100 text-violet-600" },
  { id: "quiz", className: "bg-blue-100 text-blue-600" },
  { id: "study", className: "bg-orange-100 text-orange-500" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarImage src="https://picsum.photos/seed/alex-avatar/100/100" alt="Alex" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-500">Good Morning,</p>
            <p className="text-lg font-bold leading-none text-blue-600">Alex!</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search courses..." className="h-10 w-64 rounded-full pl-10" />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full border border-gray-100 p-2.5 text-gray-500 transition-colors hover:bg-gray-50"
          >
            <Bell className="size-[18px]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-700 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Sparkles className="size-4" />
            AI Assistant
          </button>
        </div>
      </div>

      {/* Study progress */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Study Progress</h2>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            This Week
          </button>
        </div>
        <StatCards stats={STUDY_STATS} />
      </div>

      {/* Weekly activity + streak/badges */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        <Chart title="Weekly Study Activity" subtitle="Minutes studied per day" data={WEEKLY_ACTIVITY} />

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900">Daily Streak</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl font-extrabold text-orange-500">7</span>
              <p className="text-xs text-gray-500">Days of consistent learning. Keep it up!</p>
            </div>
            <div className="mt-4 flex justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={i}
                  className="flex size-7 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Recent Badges</p>
              <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="mt-3 flex gap-3">
              {BADGES.map((b) => (
                <span
                  key={b.id}
                  className={`flex size-11 items-center justify-center rounded-full ${b.className}`}
                >
                  <Sparkles className="size-5" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-500">Based on your recent interest in Advanced Science</p>
          </div>
          <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
            Explore More
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_RECOMMENDED.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Recently viewed + AI banner */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recently Viewed</h2>
          <div className="mt-4 flex flex-col gap-3">
            {RECENTLY_VIEWED.map((item) => (
              <RecentlyViewedItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        <AiTutorBanner variant="compact" />
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/courses/AiTutorBanner.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/AiTutorBanner.tsx" << 'READAM_EOF'
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiTutorBannerProps {
  variant?: "wide" | "compact";
}

export default function AiTutorBanner({ variant = "wide" }: AiTutorBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-600 p-6 text-white sm:p-8",
        variant === "compact" && "flex flex-col gap-5"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 200">
          <path
            d="M-20 150 C 80 100, 140 200, 220 120 S 380 60, 440 100"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-20 100 C 100 40, 160 160, 260 80 S 380 20, 440 60"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div
        className={cn(
          "relative flex gap-5",
          variant === "compact" ? "flex-col items-start" : "items-center justify-between"
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold sm:text-xl">Can&apos;t find your specific niche?</h3>
            <p className="mt-1 max-w-md text-sm text-white/80">
              Our AI Tutor can help you curate a personalized study path for complex engineering
              or design topics within our library.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-white/90"
        >
          Ask ReadAm AI
        </button>
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/courses/ContinueLearningCard.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/ContinueLearningCard.tsx" << 'READAM_EOF'
import Image from "next/image";
import type { ContinueLearningItem } from "@/types/course.types";

export default function ContinueLearningCard({ image, title, meta, duration }: ContinueLearningItem) {
  return (
    <button type="button" className="text-left">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover" />
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {duration}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug text-gray-900">{title}</p>
      <p className="text-xs text-gray-400">{meta}</p>
    </button>
  );
}
READAM_EOF

echo "Writing src/components/courses/CourseCard.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/CourseCard.tsx" << 'READAM_EOF'
import Image from "next/image";
import { Bookmark, Play, Star } from "lucide-react";
import type { Course } from "@/types/course.types";
import { cn } from "@/lib/utils";

const TAG_TONE: Record<NonNullable<Course["tags"][number]["tone"]>, string> = {
  default: "bg-blue-600 text-white",
  dark: "bg-gray-900/85 text-white backdrop-blur-sm",
  success: "bg-emerald-600 text-white",
  premium: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",
};

/**
 * Reused across the dashboard "Recommended for You" grid and the
 * /courses catalog (recommended + popular sections). Pass any Course
 * shaped object — this is designed to consume live API data later
 * with no markup changes.
 */
export default function CourseCard({ course }: { course: Course }) {
  const isVideo = course.format === "Video" || course.format === "Interactive";

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {course.tags.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                TAG_TONE[tag.tone ?? "dark"]
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-600/95 text-white shadow-lg ring-4 ring-white/25 transition-transform group-hover:scale-105">
              <Play className="size-5 translate-x-0.5 fill-current" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900">
            {course.title}
          </h3>
          <button
            aria-label="Save course"
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-700"
          >
            <Bookmark className="size-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
            {course.instructor
              .split(" ")
              .map((n) => n[0])
              .slice(-2)
              .join("")}
          </span>
          {course.instructor}
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-900">{course.rating.toFixed(1)}</span>
          <span className="text-gray-400">({course.reviews} reviews)</span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold text-gray-900">{course.price}</span>
          <button
            type="button"
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              course.cta === "Upgrade to Premium"
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {course.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/courses/CourseFilters.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/CourseFilters.tsx" << 'READAM_EOF'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Flame } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  { id: "video", label: "Video Lessons", checked: true },
  { id: "pdf", label: "PDF Guides", checked: false },
  { id: "tests", label: "Practice Tests", checked: false },
];

interface CourseFiltersProps {
  onNavigate?: () => void;
}

/**
 * Left rail for the /courses catalog: primary nav (top 3 items), content
 * type checkboxes, education level select, and the study streak widget.
 * Reused as-is inside the desktop fixed sidebar and inside a mobile
 * <Sheet> the same way admin/Sidebar does.
 */
export default function CourseFilters({ onNavigate }: CourseFiltersProps) {
  const pathname = usePathname();
  const navItems = STUDENT_NAV.slice(0, 3);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <p className="text-sm font-bold text-gray-900">Content Type</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {CONTENT_TYPES.map((type) => (
            <label key={type.id} className="flex items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                defaultChecked={type.checked}
                className="size-4 rounded border-gray-300 accent-blue-600"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <p className="text-sm font-bold text-gray-900">Education Level</p>
        <div className="relative mt-3">
          <select
            defaultValue="Engineering"
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
          >
            <option>Engineering</option>
            <option>Design</option>
            <option>Business</option>
            <option>Science</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mt-auto p-6">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Study Streak</p>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Flame className="size-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-gray-900">7 Day Streak</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-2/3 rounded-full bg-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/courses/CourseOutline.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/CourseOutline.tsx" << 'READAM_EOF'
"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Lock, PlayCircle, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CourseModule } from "@/types/course.types";
import { cn } from "@/lib/utils";

interface CourseOutlineProps {
  modules: CourseModule[];
  progress: number;
}

export default function CourseOutline({ modules, progress }: CourseOutlineProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map((m, i) => [m.id, i < 2]))
  );

  return (
    <aside className="flex w-full max-w-sm shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Course Content</h2>
        <span className="text-sm font-semibold text-blue-600">{progress}% Complete</span>
      </div>
      <Progress value={progress} className="mt-3" />

      <div className="mt-4 flex flex-1 flex-col divide-y divide-gray-100">
        {modules.map((module) => {
          const isOpen = openModules[module.id];
          return (
            <div key={module.id} className="py-3 first:pt-0">
              <button
                type="button"
                className="flex w-full items-center gap-2 text-left text-sm font-semibold text-gray-900"
                onClick={() => setOpenModules((s) => ({ ...s, [module.id]: !s[module.id] }))}
              >
                {isOpen ? (
                  <ChevronDown className="size-4 text-gray-400" />
                ) : (
                  <ChevronRight className="size-4 text-gray-400" />
                )}
                {module.title}
              </button>

              {isOpen && module.lessons.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                        lesson.status === "active"
                          ? "bg-blue-600 font-semibold text-white"
                          : "text-gray-700"
                      )}
                    >
                      {lesson.status === "done" && (
                        <CheckCircle2 className="size-[18px] shrink-0 text-emerald-500" />
                      )}
                      {lesson.status === "active" && (
                        <PlayCircle className="size-[18px] shrink-0 fill-white/20" />
                      )}
                      {lesson.status === "locked" && (
                        <Lock className="size-[18px] shrink-0 text-gray-400" />
                      )}
                      <span className="flex-1 truncate">{lesson.title}</span>
                      <span className={cn("text-xs", lesson.status === "active" ? "text-white/80" : "text-gray-400")}>
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-100 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
      >
        <Sparkles className="size-4" />
        Ask ReadAm AI
      </button>
    </aside>
  );
}
READAM_EOF

echo "Writing src/components/courses/CourseTopbar.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/CourseTopbar.tsx" << 'READAM_EOF'
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
READAM_EOF

echo "Writing src/components/courses/VideoPlayer.tsx"
mkdir -p "src/components/courses"
cat > "src/components/courses/VideoPlayer.tsx" << 'READAM_EOF'
"use client";

import { Captions, Maximize, Play, Settings, SkipForward, Volume2 } from "lucide-react";

interface VideoPlayerProps {
  poster: string;
  currentTime: string;
  duration: string;
  progress: number;
}

export default function VideoPlayer({ poster, currentTime, duration, progress }: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gray-950 shadow-sm">
      <div
        className="relative flex aspect-video items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        <button
          aria-label="Play video"
          className="relative flex size-16 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-xl transition-transform hover:scale-105"
        >
          <Play className="size-6 translate-x-0.5 fill-current" />
        </button>
      </div>

      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-3 text-white">
        <button aria-label="Play" className="hover:text-blue-400">
          <Play className="size-4 fill-current" />
        </button>
        <button aria-label="Next lesson" className="hover:text-blue-400">
          <SkipForward className="size-4 fill-current" />
        </button>
        <button aria-label="Volume" className="hover:text-blue-400">
          <Volume2 className="size-4" />
        </button>
        <span className="text-xs font-medium text-white/80">
          {currentTime} / {duration}
        </span>

        <div className="ml-auto flex items-center gap-4">
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">1.25x</span>
          <button aria-label="Captions" className="hover:text-blue-400">
            <Captions className="size-4" />
          </button>
          <button aria-label="Settings" className="hover:text-blue-400">
            <Settings className="size-4" />
          </button>
          <button aria-label="Fullscreen" className="hover:text-blue-400">
            <Maximize className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/dashboard/RecentlyViewedItem.tsx"
mkdir -p "src/components/dashboard"
cat > "src/components/dashboard/RecentlyViewedItem.tsx" << 'READAM_EOF'
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface RecentlyViewedItemProps {
  image: string;
  title: string;
  meta: string;
  progress: number;
}

export default function RecentlyViewedItem({ image, title, meta, progress }: RecentlyViewedItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-400">{meta}</p>
      </div>
      <div className="w-28 shrink-0">
        <Progress value={progress} className="h-1.5" />
        <p className="mt-1 text-right text-[11px] font-semibold text-blue-600">
          {progress}% COMPLETE
        </p>
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/dashboard/Sidebar.tsx"
mkdir -p "src/components/dashboard"
cat > "src/components/dashboard/Sidebar.tsx" << 'READAM_EOF'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

/**
 * Student app nav rail. Reused as-is inside the desktop fixed sidebar
 * and can be dropped into a mobile <Sheet> the same way admin/Sidebar
 * does — `onNavigate` lets a mobile sheet close itself on link click.
 */
export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {STUDENT_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Start Studying
        </button>
      </div>
    </div>
  );
}
READAM_EOF

echo "Writing src/components/ui/avatar.tsx"
mkdir -p "src/components/ui"
cat > "src/components/ui/avatar.tsx" << 'READAM_EOF'
"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
READAM_EOF

echo "Writing src/components/ui/progress.tsx"
mkdir -p "src/components/ui"
cat > "src/components/ui/progress.tsx" << 'READAM_EOF'
"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 rounded-full bg-primary transition-all", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
READAM_EOF

echo "Writing src/constants/student-nav.ts"
mkdir -p "src/constants"
cat > "src/constants/student-nav.ts" << 'READAM_EOF'
import {
  Home,
  BookOpen,
  Sparkles,
  CreditCard,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types/dashboard.types";

export const STUDENT_NAV: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore Courses", href: "/courses", icon: BookOpen },
  { label: "AI Tutor", href: "/ai-tutor", icon: Sparkles },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];
READAM_EOF

echo "Writing src/data/courses.ts"
mkdir -p "src/data"
cat > "src/data/courses.ts" << 'READAM_EOF'
import type { Course } from "@/types/course.types";

/**
 * NOTE: placeholder catalog data. Shaped so it can later be swapped for a
 * real fetch with minimal refactoring, e.g.:
 *
 *   const courses = await getCourses({ category, level }); // replaces these arrays
 */

export const RECOMMENDED_COURSES: Course[] = [
  {
    id: "autonomous-robotics",
    title: "Introduction to Autonomous Robotics",
    instructor: "Prof. Alan Turing",
    rating: 4.9,
    reviews: "2.4k",
    price: "25,000 XAF",
    image: "https://picsum.photos/seed/robotics-arm/800/500",
    tags: [
      { label: "Video", tone: "default" },
      { label: "Robotics", tone: "dark" },
    ],
    cta: "View Course",
    format: "Video",
  },
  {
    id: "human-centered-design",
    title: "Human-Centered Design Principles",
    instructor: "Sarah Jenkins",
    rating: 4.8,
    reviews: "1.1k",
    price: "8,500 XAF",
    image: "https://picsum.photos/seed/uiux-app/800/500",
    tags: [
      { label: "PDF", tone: "success" },
      { label: "UI/UX", tone: "dark" },
    ],
    cta: "Download",
    format: "PDF",
  },
  {
    id: "structural-analysis",
    title: "Structural Analysis & Modern Bridges",
    instructor: "Eng. David Kome",
    rating: 4.7,
    reviews: "920",
    price: "30,000 XAF",
    image: "https://picsum.photos/seed/city-towers/800/500",
    tags: [
      { label: "Video", tone: "default" },
      { label: "Civil Eng.", tone: "dark" },
    ],
    cta: "View Course",
    format: "Video",
  },
];

export const POPULAR_COURSES: Course[] = [
  {
    id: "neural-networks",
    title: "Advanced Neural Networks for Engineers",
    instructor: "Dr. Marie Ngo",
    rating: 5.0,
    reviews: "3.2k",
    price: "55,000 XAF",
    image: "https://picsum.photos/seed/ai-face/800/500",
    tags: [
      { label: "Premium", tone: "premium" },
      { label: "AI", tone: "dark" },
    ],
    cta: "Upgrade to Premium",
    format: "Video",
  },
  {
    id: "green-building",
    title: "Green Building & Urban Planning",
    instructor: "Arch. Samuel Taku",
    rating: 4.6,
    reviews: "450",
    price: "18,000 XAF",
    image: "https://picsum.photos/seed/glass-facade/800/500",
    tags: [
      { label: "Interactive", tone: "default" },
      { label: "Architecture", tone: "dark" },
    ],
    cta: "View Course",
    format: "Interactive",
  },
  {
    id: "product-prototyping",
    title: "Product Prototyping & 3D Printing",
    instructor: "Jean Ebolo",
    rating: 4.9,
    reviews: "680",
    price: "12,500 XAF",
    image: "https://picsum.photos/seed/3d-print/800/500",
    tags: [
      { label: "PDF", tone: "success" },
      { label: "Industrial", tone: "dark" },
    ],
    cta: "Download",
    format: "PDF",
  },
];

export const DASHBOARD_RECOMMENDED: Course[] = [
  {
    id: "organic-chemistry",
    title: "Advanced Organic Chemistry",
    instructor: "Dr. Amadou Mvogo",
    instructorRole: "Master Faculty",
    rating: 4.9,
    reviews: "1.2k",
    price: "25,000 XAF",
    image: "https://picsum.photos/seed/molecule-blue/800/500",
    tags: [{ label: "Top Rated", tone: "premium" }],
    cta: "Enroll Now",
    format: "Video",
  },
  {
    id: "quantum-physics",
    title: "Quantum Physics Fundamentals",
    instructor: "Prof. Sarah Ngo",
    instructorRole: "MIT Fellow",
    rating: 4.7,
    reviews: "856",
    price: "30,000 XAF",
    image: "https://picsum.photos/seed/physics-lab/800/500",
    tags: [],
    cta: "Enroll Now",
    format: "Video",
  },
  {
    id: "data-science-python",
    title: "Data Science with Python",
    instructor: "Eng. David Tchiroma",
    instructorRole: "Data Lead",
    rating: 4.8,
    reviews: "2.1k",
    price: "15,000 XAF",
    image: "https://picsum.photos/seed/data-dashboard/800/500",
    tags: [],
    cta: "Enroll Now",
    format: "Video",
  },
];
READAM_EOF

echo "Writing src/data/student-mock.ts"
mkdir -p "src/data"
cat > "src/data/student-mock.ts" << 'READAM_EOF'
import { BookOpen, Clock3, Target } from "lucide-react";
import type { StatCardData, ChartPoint } from "@/types/dashboard.types";
import type { CourseModule, ContinueLearningItem } from "@/types/course.types";

/**
 * NOTE: placeholder data for the student dashboard and lesson pages.
 * Shaped so it can later be swapped for a real fetch with minimal
 * refactoring, e.g.:
 *
 *   const stats = await getStudyProgress(); // replaces STUDY_STATS
 */

export const STUDY_STATS: StatCardData[] = [
  {
    id: "courses-completed",
    label: "Courses Completed",
    value: "12",
    delta: "+2 this week",
    trend: "up",
    icon: BookOpen,
  },
  {
    id: "hours-spent",
    label: "Hours Spent",
    value: "48.5 hrs total",
    icon: Clock3,
  },
  {
    id: "avg-quiz-score",
    label: "Average Quiz Score",
    value: "84%",
    delta: "Top 5%",
    trend: "up",
    icon: Target,
  },
];

export const WEEKLY_ACTIVITY: ChartPoint[] = [
  { label: "MON", value: 30 },
  { label: "TUE", value: 42 },
  { label: "WED", value: 100 },
  { label: "THU", value: 38 },
  { label: "FRI", value: 55 },
  { label: "SAT", value: 20 },
  { label: "SUN", value: 46 },
];

export const RECENTLY_VIEWED = [
  {
    id: "business-economics",
    title: "Intro to Business Economics",
    meta: "3 lessons remaining • 2 hrs left",
    progress: 75,
    image: "https://picsum.photos/seed/economics-calc/200/200",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Essentials",
    meta: "Last viewed yesterday • 12 videos",
    progress: 15,
    image: "https://picsum.photos/seed/cyberlock/200/200",
  },
];

export const COURSE_OUTLINE: CourseModule[] = [
  {
    id: "module-1",
    title: "01. Fundamentals of Calculus",
    lessons: [
      { id: "l1", title: "Introduction to Limits", duration: "12:00", status: "done" },
      { id: "l2", title: "Derivatives Explained", duration: "15:45", status: "done" },
    ],
  },
  {
    id: "module-2",
    title: "02. Master Integration",
    lessons: [
      { id: "l3", title: "Integration by Parts", duration: "45:00", status: "active" },
      { id: "l4", title: "Trig Substitution", duration: "18:20", status: "locked" },
      { id: "l5", title: "Definite Integrals", duration: "22:15", status: "locked" },
    ],
  },
  {
    id: "module-3",
    title: "03. Final Examination Prep",
    lessons: [],
  },
];

export const CONTINUE_LEARNING: ContinueLearningItem[] = [
  {
    id: "trig-sub",
    title: "Trigonometric Substitution",
    meta: "Next in Series",
    duration: "15:20",
    image: "https://picsum.photos/seed/chalkboard-math1/600/400",
  },
  {
    id: "pitfalls",
    title: "Common Integration Pitfalls",
    meta: "Quick Review",
    duration: "08:45",
    image: "https://picsum.photos/seed/chalkboard-math2/600/400",
  },
  {
    id: "partial-fractions",
    title: "Practice: Partial Fractions",
    meta: "Interactive Quiz",
    duration: "12:10",
    image: "https://picsum.photos/seed/chalkboard-math3/600/400",
  },
];
READAM_EOF

echo "Writing src/types/course.types.ts"
mkdir -p "src/types"
cat > "src/types/course.types.ts" << 'READAM_EOF'
export type CourseFormat = "Video" | "PDF" | "Interactive";

export type CourseCTA = "View Course" | "Download" | "Enroll Now" | "Upgrade to Premium";

export interface CourseTag {
  label: string;
  tone?: "default" | "dark" | "success" | "premium";
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole?: string;
  rating: number;
  reviews: string;
  price: string;
  image: string;
  tags: CourseTag[];
  cta: CourseCTA;
  format: CourseFormat;
}

export type LessonStatus = "done" | "active" | "locked";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: LessonStatus;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ContinueLearningItem {
  id: string;
  title: string;
  meta: string;
  duration: string;
  image: string;
}
READAM_EOF

echo "Writing src/types/user.types.ts"
mkdir -p "src/types"
cat > "src/types/user.types.ts" << 'READAM_EOF'
export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  streakDays: number;
}
READAM_EOF

echo "Done. Review with: git status && git diff"
