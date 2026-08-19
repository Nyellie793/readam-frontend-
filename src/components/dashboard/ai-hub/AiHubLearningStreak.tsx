"use client";

import useSWR from "swr";
import { Flame } from "lucide-react";
import STUDENT from "@/services/student.service";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Same SWR keys as WeeklyActivity/StudyProgress/CourseFilters, so this reuses
// their cached response instead of firing its own request when both are
// mounted around the same time.
export default function AiHubLearningStreak() {
  const t = useTranslations("dash");
  const { data: gamification, isLoading: gLoading } = useSWR("gamification", () => STUDENT.getGamification());
  const { data: weekly, isLoading: wLoading } = useSWR("weekly-activity-7", () => STUDENT.getWeeklyActivity(7));

  const loading = gLoading || wLoading;
  const streakDays = gamification?.current_streak_days ?? 0;
  const totalXp = gamification?.total_xp ?? 0;
  const days = weekly?.days ?? [];

  const activeDaysThisWeek = days.filter((d) => d.active).length;
  const weeklyGoalPct = days.length > 0 ? Math.round((activeDaysThisWeek / days.length) * 100) : 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{t("learningStreak")}</h3>
        <div className="flex size-8 items-center justify-center rounded-full bg-orange-100">
          <Flame className="size-4 text-orange-500" />
        </div>
      </div>

      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-orange-500">
        <Flame className="size-3.5" />
        {loading ? "…" : `${streakDays}-Day Streak`}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">XP</p>
          <p className="text-xl font-extrabold text-gray-900">{loading ? "…" : totalXp.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{t("activeDays")}</p>
          <p className="text-xl font-extrabold text-gray-900">{loading ? "…" : `${weeklyGoalPct}%`}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        {days.map((day, i) => (
          <span
            key={`${day.activity_date}-${i}`}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-[11px] font-bold",
              day.active ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
            )}
          >
            {day.weekday[0]}
          </span>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-800">
          {streakDays > 0 ? t("keepGoing") : t("startToday")}
        </p>
        <p className="text-xs text-gray-500">
          {activeDaysThisWeek > 0
            ? `You've studied ${activeDaysThisWeek} of the last ${days.length || 7} days.`
            : t("noActivityWeek")}
        </p>
      </div>
    </div>
  );
}
