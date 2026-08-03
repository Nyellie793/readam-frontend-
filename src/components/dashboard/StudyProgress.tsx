"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import STUDENT from "@/services/student.service";
import { Skeleton } from "@/components/ui/skeleton";
import type { GamificationResponse } from "@/types/api.types";

/**
 * These tiles used to initialise to 0 with no loading or error state, so a
 * student with a 30-day streak saw "0 days · 0 xp" on every page load — and
 * permanently if the request failed, which is indistinguishable from having
 * genuinely lost the streak.
 */
export default function StudyProgress() {
  const [data, setData] = useState<GamificationResponse | null>(null);
  const [enrollmentCount, setEnrollmentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setFailed(false);

    Promise.allSettled([STUDENT.getGamification(), STUDENT.getEnrollments()])
      .then(([gamification, enrollments]) => {
        if (gamification.status === "fulfilled") setData(gamification.value);
        if (enrollments.status === "fulfilled") setEnrollmentCount(enrollments.value.total);
        // Only a total failure is worth surfacing; one missing tile still
        // leaves the section useful.
        setFailed(gamification.status === "rejected" && enrollments.status === "rejected");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = [
    { label: "Enrolled Courses", value: enrollmentCount, suffix: "" },
    { label: "Study Streak", value: data?.current_streak_days ?? null, suffix: " days" },
    { label: "Total XP", value: data?.total_xp ?? null, suffix: " xp" },
    { label: "Longest Streak", value: data?.longest_streak_days ?? null, suffix: " days" },
  ];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">Study Progress</h2>
        {failed && (
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <RotateCw className="size-3.5" />
            Retry
          </button>
        )}
      </div>

      {failed ? (
        <div className="rounded-xl border border-gray-100 bg-white p-5 text-sm text-gray-500 shadow-sm">
          Your progress could not be loaded just now. This does not affect your
          streak or your XP.
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
