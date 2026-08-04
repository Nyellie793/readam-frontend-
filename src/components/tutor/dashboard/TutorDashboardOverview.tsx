"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, CheckCircle2, FileEdit, Wallet, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CourseListItem, EarningsSummaryResponse } from "@/types/api.types";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  pending_review: "bg-orange-50 text-orange-600",
  published: "bg-teal-50 text-teal-600",
  rejected: "bg-red-50 text-red-500",
};


export default function TutorDashboardOverview() {
  const t = useTranslations("tutor");
  const STATUS_LABELS: Record<string, string> = {
    draft: "Draft",
    pending_review: t("pendingReview"),
    published: "Published",
    rejected: "Rejected",
  };
  const [courses, setCourses] = useState<CourseListItem[] | null>(null);
  const [earnings, setEarnings] = useState<EarningsSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([TUTOR.listMyCourses(), TUTOR.getEarningsSummary()])
      .then(([courseList, earningsSummary]) => {
        setCourses(courseList);
        setEarnings(earningsSummary);
      })
      .catch((err) => setError(errorMessage(err, t("errLoadDash"))))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  const list = courses ?? [];
  const counts = {
    published: list.filter((c) => c.status === "published").length,
    pending_review: list.filter((c) => c.status === "pending_review").length,
    draft: list.filter((c) => c.status === "draft").length,
  };

  const stats = [
    { label: "Total Courses", value: list.length, icon: BookOpen, tint: "text-blue-600 bg-blue-50" },
    { label: "Published", value: counts.published, icon: CheckCircle2, tint: "text-teal-600 bg-teal-50" },
    { label: t("pendingReview"), value: counts.pending_review, icon: Clock, tint: "text-orange-600 bg-orange-50" },
    { label: "Drafts", value: counts.draft, icon: FileEdit, tint: "text-gray-600 bg-gray-100" },
  ];

  const recent = [...list]
    .sort((a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t("dashboard")}</h1>
          <p className="text-sm text-gray-500">Here&apos;s how your courses and earnings are doing.</p>
        </div>
        <Link
          href="/tutor/courses"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <PlusCircle className="size-4" />
          New Course
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className={cn("flex size-9 items-center justify-center rounded-xl", stat.tint)}>
              <stat.icon className="size-4.5" />
            </div>
            <p className="mt-3 text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="size-4.5" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">{t("earnings")}</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">{t("totalEarned")}</p>
              <p className="text-xl font-extrabold text-gray-900">
                {(earnings?.total_earned ?? 0).toLocaleString()} XAF
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t("pendingBalance")}</p>
              <p className="text-lg font-bold text-orange-600">
                {(earnings?.pending_balance ?? 0).toLocaleString()} XAF
              </p>
            </div>
          </div>
          <Link
            href="/tutor/earnings"
            className="mt-4 block rounded-xl border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Earnings
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">{t("recentCourses")}</h2>
            <Link href="/tutor/courses" className="text-xs font-semibold text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
              <BookOpen className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">You haven&apos;t created any courses yet.</p>
              <Link href="/tutor/courses" className="text-sm font-semibold text-blue-600 hover:underline">
                Create your first course
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {recent.map((course) => (
                <Link
                  key={course.id}
                  href={`/tutor/courses/${course.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3.5 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-400">{course.total_lessons} lessons</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      STATUS_STYLES[course.status] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {STATUS_LABELS[course.status] ?? course.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
