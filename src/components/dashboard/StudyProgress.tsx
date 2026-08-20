"use client";

import useSWR from "swr";
import { RotateCw } from "lucide-react";
import STUDENT from "@/services/student.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

/**
 * These tiles used to initialise to 0 with no loading or error state, so a
 * student with a 30-day streak saw "0 days · 0 xp" on every page load — and
 * permanently if the request failed, which is indistinguishable from having
 * genuinely lost the streak.
 *
 * "gamification" is the same SWR key used by WeeklyActivity, AiHubLearningStreak,
 * and CourseFilters, so only one of them triggers the network request per
 * cache window — the rest read the shared result.
 */
export default function StudyProgress() {
  const t = useTranslations("dash");
  const {
    data,
    isLoading: gLoading,
    error: gError,
    mutate: retryGamification,
  } = useSWR("gamification", () => STUDENT.getGamification());
  const {
    data: enrollments,
    isLoading: eLoading,
    error: eError,
    mutate: retryEnrollments,
  } = useSWR("enrollments", () => STUDENT.getEnrollments());

  const loading = gLoading || eLoading;
  // Only a total failure is worth surfacing; one missing tile still leaves
  // the section useful.
  const failed = !!gError && !!eError;

  function load() {
    retryGamification();
    retryEnrollments();
  }

  const stats = [
    { label: t("enrolledCourses"), value: enrollments?.total ?? null, suffix: "" },
    { label: t("studyStreak"), value: data?.current_streak_days ?? null, suffix: t("days") },
    { label: t("totalXp"), value: data?.total_xp ?? null, suffix: t("xp") },
    { label: t("longestStreak"), value: data?.longest_streak_days ?? null, suffix: t("days") },
  ];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">{t("studyProgress")}</h2>
        {failed && (
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <RotateCw className="size-3.5" />
            {t("retry")}
          </button>
        )}
      </div>

      {failed ? (
        <div className="rounded-xl border border-gray-100 bg-white p-5 text-sm text-gray-500 shadow-sm">
          {t("progressFailed")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">{s.label}</p>
              {loading || s.value === null ? (
                <Skeleton className="mt-2 h-7 w-20 rounded-md" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {s.value.toLocaleString()}
                  {s.suffix}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
