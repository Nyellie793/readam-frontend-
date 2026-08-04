"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import Chart from "@/components/shared/Chart";
import STUDENT from "@/services/student.service";
import type { DailyActivityItem } from "@/types/api.types";
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
 */
export default function WeeklyActivity() {
  const t = useTranslations("dash");
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [days, setDays] = useState<DailyActivityItem[]>([]);
  const [weekDays, setWeekDays] = useState<DailyActivityItem[]>([]);
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // The fixed 7-day streak strip and the streak count never change with the
  // chart's period toggle, so they are fetched once.
  const loadStatic = useCallback(() => {
    Promise.allSettled([STUDENT.getWeeklyActivity(7), STUDENT.getGamification()]).then(
      ([week, gamification]) => {
        if (week.status === "fulfilled") setWeekDays(week.value.days);
        if (gamification.status === "fulfilled") setStreakDays(gamification.value.current_streak_days);
      }
    );
  }, []);

  const loadChart = useCallback((p: "weekly" | "monthly") => {
    setLoading(true);
    setFailed(false);
    STUDENT.getWeeklyActivity(p === "monthly" ? 30 : 7)
      .then((data) => setDays(data.days))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStatic();
  }, [loadStatic]);

  useEffect(() => {
    loadChart(period);
  }, [period, loadChart]);

  const chartData = days.map((d) => ({
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
            onClick={() => loadChart(period)}
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
          loading={loading && days.length === 0}
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
