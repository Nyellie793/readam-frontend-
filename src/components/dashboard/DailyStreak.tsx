"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { DailyActivityItem } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DailyStreakProps {
  streakDays: number | null;
  /** Fixed last-7-days view, independent of the chart's Weekly/Monthly toggle. */
  days: DailyActivityItem[];
  loading: boolean;
}

/**
 * Presentational. This component used to fetch getGamification and
 * getWeeklyActivity itself, duplicating both calls that its siblings on the
 * dashboard were already making. The parent fetches once and passes down.
 */
export default function DailyStreak({ streakDays, days, loading }: DailyStreakProps) {
  const t = useTranslations("dash");
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold">{t("dailyStreak")}</p>

      <div className="mt-3 flex items-center gap-3">
        {loading || streakDays === null ? (
          <Skeleton className="h-10 w-12 rounded-md" />
        ) : (
          <span className="text-4xl font-extrabold text-orange-500">{streakDays}</span>
        )}

        <p className="text-xs text-gray-500">
          {loading || streakDays === null
            ? t("loadingStreak")
            : streakDays > 0
              ? t("daysConsistent")
              : t("studyToday")}
        </p>
      </div>

      <div className="mt-4 flex justify-between">
        {loading && days.length === 0
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="size-7 rounded-full" />
            ))
          : days.map((day, index) => (
              <span
                key={`${day.activity_date}-${index}`}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-[11px] text-white",
                  day.active ? "bg-orange-500" : "bg-gray-200 text-gray-400"
                )}
              >
                {day.weekday[0]}
              </span>
            ))}
      </div>
    </div>
  );
}
