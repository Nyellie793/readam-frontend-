"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Loader2, PlayCircle } from "lucide-react";
import STUDENT from "@/services/student.service";
import { errorMessage } from "@/lib/api";
import type { EnrolledCourseItem } from "@/types/api.types";
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

function isExpired(item: EnrolledCourseItem): boolean {
  return !!item.expires_at && new Date(item.expires_at) < new Date();
}

function EnrollmentCard({ item }: { item: EnrolledCourseItem }) {
  const t = useTranslations("dash");
  const expired = isExpired(item);

  return (
    <Link
      href={`/dashboard/courses/${item.course_id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        {item.course_thumbnail ? (
          <Image
            src={item.course_thumbnail}
            alt={item.course_title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-blue-50">
            <BookOpen className="size-10 text-blue-300" />
          </div>
        )}
        {expired && (
          <span className="absolute left-3 top-3 rounded-md bg-gray-900/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
            {t("expired")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900">
          {item.course_title}
        </h3>
        <p className="text-xs text-gray-400">
          {item.course_total_lessons} {t("lessons")}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">
            {t("enrolledOn")} {new Date(item.enrolled_at).toLocaleDateString()}
          </span>
          {!expired && (
            <span className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
              <PlayCircle className="size-3.5" />
              {t("continue")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function MyLearningList() {
  const t = useTranslations("dash");

  const [items, setItems] = useState<EnrolledCourseItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((pageToLoad: number) => {
    const first = pageToLoad === 1;
    if (first) setLoading(true);
    else setLoadingMore(true);

    STUDENT.getEnrollments(pageToLoad)
      .then((data) => {
        setItems((prev) => (first ? data.items : [...prev, ...data.items]));
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

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error && items.length === 0) {
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

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <BookOpen className="size-6" />
        </span>
        <h2 className="mt-5 text-lg font-bold text-gray-900">{t("myLearningEmptyTitle")}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
          {t("myLearningEmptyBody")}
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

  const hasMore = items.length < total;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EnrollmentCard key={item.id} item={item} />
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
