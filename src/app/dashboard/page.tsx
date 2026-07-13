import { Bell, Search, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/Input";
import StatCards from "@/components/admin/StatCards";
import Chart from "@/components/admin/Chart";
import CourseCard from "@/components/courses/CourseCard";
import AiTutorBanner from "@/components/courses/AiTutorBanner";
import RecentlyViewedItem from "@/components/dashboard/RecentlyViewedItem";
import { STUDY_STATS, WEEKLY_ACTIVITY, RECENTLY_VIEWED } from "@/data/student-mock";
import { DASHBOARD_RECOMMENDED } from "@/data/courses";

const BADGES = [
  { id: "streak", className: "bg-violet-100 text-violet-600" },
  { id: "quiz", className: "bg-blue-100 text-blue-600" },
  { id: "study", className: "bg-orange-100 text-orange-500" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarImage src="https://picsum.photos/seed/alex-avatar/100/100" alt="Alex" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-500">Good Morning,</p>
            <p className="text-lg font-bold leading-none text-blue-600">Alex!</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search courses..." className="h-10 w-64 rounded-full pl-10" />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full border border-gray-100 p-2.5 text-gray-500 transition-colors hover:bg-gray-50"
          >
            <Bell className="size-[18px]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-700 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Sparkles className="size-4" />
            AI Assistant
          </button>
        </div>
      </div>

      {/* Study progress */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Study Progress</h2>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            This Week
          </button>
        </div>
        <StatCards stats={STUDY_STATS} />
      </div>

      {/* Weekly activity + streak/badges */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        <Chart title="Weekly Study Activity" subtitle="Minutes studied per day" data={WEEKLY_ACTIVITY} />

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900">Daily Streak</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl font-extrabold text-orange-500">7</span>
              <p className="text-xs text-gray-500">Days of consistent learning. Keep it up!</p>
            </div>
            <div className="mt-4 flex justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={i}
                  className="flex size-7 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Recent Badges</p>
              <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="mt-3 flex gap-3">
              {BADGES.map((b) => (
                <span
                  key={b.id}
                  className={`flex size-11 items-center justify-center rounded-full ${b.className}`}
                >
                  <Sparkles className="size-5" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-500">Based on your recent interest in Advanced Science</p>
          </div>
          <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
            Explore More
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_RECOMMENDED.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Recently viewed + AI banner */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recently Viewed</h2>
          <div className="mt-4 flex flex-col gap-3">
            {RECENTLY_VIEWED.map((item) => (
              <RecentlyViewedItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        <AiTutorBanner variant="compact" />
      </div>
    </div>
  );
}
