"use client";

import { useEffect, useState } from "react";
import STUDENT from "@/services/student.service";
import type { DailyActivityItem } from "@/types/api.types";
import { cn } from "@/lib/utils";

export default function DailyStreak() {
  const [streakDays, setStreakDays] = useState<number>(0);
  const [days, setDays] = useState<DailyActivityItem[]>([]);

  useEffect(() => {
    STUDENT.getGamification()
      .then((data) => setStreakDays(data.current_streak_days))
      .catch(() => null);
    // Always the fixed last-7-days view — independent of the chart's Weekly/Monthly toggle.
    STUDENT.getWeeklyActivity(7)
      .then((data) => setDays(data.days))
      .catch(() => null);
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold">
        Daily Streak
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl font-extrabold text-orange-500">
          {streakDays}
        </span>

        <p className="text-xs text-gray-500">
          {streakDays > 0 ? "Days of consistent learning." : "Study today to start a streak."}
        </p>
      </div>

      <div className="mt-4 flex justify-between">
        {days.map((day, index) => (
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
