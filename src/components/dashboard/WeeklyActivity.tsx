import Chart from "@/components/admin/Chart";
import { WEEKLY_ACTIVITY } from "@/data/student-mock";
import DailyStreak from "./DailyStreak";
import RecentBadges from "./RecentBadges";

export default function WeeklyActivity() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">

      <Chart
        title="Weekly Study Activity"
        subtitle="Minutes studied per day"
        data={WEEKLY_ACTIVITY}
      />

      <div className="flex flex-col gap-5">

        <DailyStreak />

        <RecentBadges />

      </div>

    </div>
  );
}