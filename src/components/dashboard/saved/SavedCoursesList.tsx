"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import STUDENT from "@/services/student.service";
import { errorMessage } from "@/lib/api";
import type { CourseListItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
      <div className="aspect-16/10 w-full rounded-lg bg-gray-100" />
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
    </div>
  );
}

export default function SavedCoursesList() {
  const t = useTranslations("dash");

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((pageToLoad: number) => {
    const first = pageToLoad === 1;
    if (first) setLoading(true);
    else setLoadingMore(true);

    STUDENT.getSavedCourses(pageToLoad)
      .then((data) => {
        setCourses((prev) => (first ? data.items : [...prev, ...data.items]));
        setTotal(data.total);
        setPage(data.page);
        setError(null);
      })
      .catch((e) => setError(errorMessage(e, t("historyFailed"))))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [t]);

  useEffect(() => {
    load(1);
  }, [load]);

  function removeFromList(courseId: string) {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setTotal((n) => Math.max(0, n - 1));
  }

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => load(1)}
          className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Bookmark className="size-6" />
        </span>
        <h2 className="mt-5 text-lg font-bold text-gray-900">{t("savedEmptyTitle")}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
          {t("savedEmptyBody")}
        </p>
        <Link
          href="/dashboard/courses"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t("browseAll")}
        </Link>
      </div>
    );
  }

  const hasMore = courses.length < total;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onUnsave={() => removeFromList(course.id)}
          />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => load(page + 1)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            {loadingMore && <Loader2 className="size-4 animate-spin" />}
            {t("loadMore")}
          </button>
        </div>
      )}
    </>
  );
}
