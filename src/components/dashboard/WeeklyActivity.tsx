"use client";

import { useState } from "react";
import useSWR from "swr";
import { RotateCw } from "lucide-react";
import Chart from "@/components/shared/Chart";
import STUDENT from "@/services/student.service";
import DailyStreak from "./DailyStreak";
import RecentBadges from "./RecentBadges";
import { useTranslations } from "next-intl";

function dayOfMonth(isoDate: string): string {
  return String(Number(isoDate.slice(-2)));
}

/**
 * Owns the activity data for this row and passes it to DailyStreak, which used
 * to fetch the same two endpoints itself. That removed two duplicate requests
 * from every dashboard load.
 *
 * The 7-day strip and the streak count use the same SWR keys ("weekly-activity-7"
 * and "gamification") as AiHubLearningStreak/StudyProgress/CourseFilters, so
 * navigating between those and this component reuses one cached response
 * instead of firing a fresh request per mount.
 */
export default function WeeklyActivity() {
  const t = useTranslations("dash");
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const { data: weekData } = useSWR("weekly-activity-7", () => STUDENT.getWeeklyActivity(7));
  const { data: gamification } = useSWR("gamification", () => STUDENT.getGamification());

  const days = period === "monthly" ? 30 : 7;
  const {
    data: chartResponse,
    isLoading: loading,
    error: chartError,
    mutate: retryChart,
  } = useSWR(["weekly-activity", days], () => STUDENT.getWeeklyActivity(days), {
    keepPreviousData: true,
  });

  const weekDays = weekData?.days ?? [];
  const streakDays = gamification?.current_streak_days ?? null;
  const failed = !!chartError;

  const chartData = (chartResponse?.days ?? []).map((d) => ({
    label: period === "monthly" ? dayOfMonth(d.activity_date) : d.weekday,
    value: d.xp_earned,
  }));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
      {failed ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{t("weeklyActivity")}</h3>
            <p className="mt-1 text-xs text-gray-500">
              {t("activityFailed")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => retryChart()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <RotateCw className="size-3.5" />
            {t("retry")}
          </button>
        </div>
      ) : (
        <Chart
          title={t("weeklyActivity")}
          subtitle={t("xpPerDay")}
          data={chartData}
          period={period}
          onPeriodChange={setPeriod}
          loading={loading && chartData.length === 0}
        />
      )}

      <div className="flex flex-col gap-5">
        <DailyStreak
          streakDays={streakDays}
          days={weekDays}
          loading={streakDays === null && weekDays.length === 0}
        />
        <RecentBadges />
      </div>
    </div>
  );
}
