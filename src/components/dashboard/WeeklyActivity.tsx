"use client";

import { useEffect, useState } from "react";
import Chart from "@/components/admin/Chart";
import STUDENT from "@/services/student.service";
import type { DailyActivityItem } from "@/types/api.types";
import DailyStreak from "./DailyStreak";
import RecentBadges from "./RecentBadges";

function dayOfMonth(isoDate: string): string {
  return String(Number(isoDate.slice(-2)));
}

export default function WeeklyActivity() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [days, setDays] = useState<DailyActivityItem[]>([]);

  useEffect(() => {
    STUDENT.getWeeklyActivity(period === "monthly" ? 30 : 7)
      .then((data) => setDays(data.days))
      .catch(() => null);
  }, [period]);

  const chartData = days.map((d) => ({
    label: period === "monthly" ? dayOfMonth(d.activity_date) : d.weekday,
    value: d.xp_earned,
  }));

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">

      <Chart
        title="Weekly Study Activity"
        subtitle="XP earned per day"
        data={chartData}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="flex flex-col gap-5">

        <DailyStreak />

        <RecentBadges />

      </div>

    </div>
  );
}
