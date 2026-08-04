"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell, Sparkles, X } from "lucide-react";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import AiTutorBanner from "@/components/dashboard/courses/AiTutorBanner";
import CourseFilters from "@/components/dashboard/courses/CourseFilters";
import STUDENT from "@/services/student.service";
import type { CourseListItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
      <div className="aspect-16/10 w-full rounded-lg bg-gray-100" />
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
    </div>
  );
}

function CoursesPageContent() {
  const t = useTranslations("dash");
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const contentTypes = searchParams.getAll("content_type");
  const contentTypesKey = contentTypes.join(",");
  const officialOnly = searchParams.get("official_only") === "true";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  const [recommended, setRecommended] = useState<CourseListItem[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [interests, setInterests] = useState<string[]>([]);

  const [browseResults, setBrowseResults] = useState<CourseListItem[]>([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [browseError, setBrowseError] = useState<string | null>(null);

  useEffect(() => {
    STUDENT.getRecommendedCourses()
      .then((data) => setRecommended(data.items))
      .catch(() => null)
      .finally(() => setRecommendedLoading(false));
    STUDENT.getProfile()
      .then((profile) => setInterests(profile.interests))
      .catch(() => null);
  }, []);

  useEffect(() => {
    setBrowseLoading(true);
    const timeout = setTimeout(() => {
      STUDENT.browseCourses({
        search: search || undefined,
        category: category || undefined,
        contentTypes: contentTypes.length > 0 ? contentTypes : undefined,
        officialOnly: officialOnly || undefined,
      })
        .then((data) => {
          setBrowseResults(data.items);
          setBrowseError(null);
        })
        .catch((e) => setBrowseError(e.message))
        .finally(() => setBrowseLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, contentTypesKey, officialOnly]);

  const recommendedSubtitle = interests.length > 0
    ? `Based on your interest in ${interests.slice(0, 2).join(" and ")}`
    : t("basedOnInterests");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100"
          aria-label={t("openFilters")}
        >
          <Menu size={20} />
        </button>

        <span className="text-sm font-semibold text-gray-800">{t("exploreCourses")}</span>

        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(o => !o)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Search className="size-5" />
          </button>
          <Link href="/notifications" className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Bell className="size-5" />
          </Link>
          <Link href="/dashboard/ai-tutor" className="rounded-full p-2 text-violet-500 hover:bg-gray-100">
            <Sparkles className="size-5" />
          </Link>
        </div>
      </div>

      {/* Mobile expanding search */}
      {searchOpen && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 lg:hidden">
          <Search className="size-4 shrink-0 text-gray-400" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchCourses")}
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
              <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="size-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CourseFilters showLogo={false} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </aside>
        </>
      )}

      {/* Desktop top bar */}
      <header className="hidden h-[73px] items-center gap-4 border-b border-gray-100 bg-white px-6 lg:flex">
        <div className="relative mx-auto w-full max-w-2xl flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchCourses")}
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
        <Link href="/notifications" className="rounded-full p-2 text-gray-500 hover:bg-gray-50"><Bell className="size-5" /></Link>
        <Link href="/dashboard/ai-tutor" className="rounded-full p-2 text-violet-500 hover:bg-gray-50"><Sparkles className="size-5" /></Link>
      </header>

      {/* Content only — no sidebar here, layout handles it */}
      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("recommended")}</h1>
            <p className="mt-1 text-sm text-gray-500">{recommendedSubtitle}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedLoading
            ? Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : recommended.length === 0
            ? <p className="text-sm text-gray-500">{t("noRecommendations")}</p>
            : recommended.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {search ? `Results for "${search}"` : t("browseAll")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {category || contentTypes.length > 0 || officialOnly
              ? t("filteredResults")
              : t("allPublished")}
          </p>
        </div>

        {browseError && <p className="mt-4 text-sm text-red-500">{browseError}</p>}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {browseLoading
            ? Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : browseResults.length === 0
            ? <p className="text-sm text-gray-500">{t("noCourses")}</p>
            : browseResults.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>

        <div className="mt-10">
          <AiTutorBanner />
        </div>
      </main>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CoursesPageContent />
    </Suspense>
  );
}
