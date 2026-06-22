import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import Chart from "@/components/admin/Chart";
import { Badge } from "@/components/ui/Badge";
import { Plus, ArrowRight } from "lucide-react";
import {
  OVERVIEW_STATS,
  REVENUE_TRENDS,
  RECENT_ACTIVITY,
  COURSES,
} from "@/data/admin-mock";

export default function AdminDashboardPage() {
  const pendingCourses = COURSES.filter((c) => c.status === "Pending");

  return (
    <>
      <Topbar title="System Overview" description="Real-time performance and administrative alerts." />

      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={OVERVIEW_STATS} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Chart title="Daily Revenue Flow Trends" subtitle="This period vs. average" data={REVENUE_TRENDS} />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
              <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      item.tone === "destructive"
                        ? "bg-red-500"
                        : item.tone === "warning"
                        ? "bg-amber-500"
                        : item.tone === "success"
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="truncate text-xs text-gray-400">{item.meta}</p>
                    <p className="mt-0.5 text-[11px] text-gray-300">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900">Pending Course Approvals</h3>
            <button type="button" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {pendingCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{course.title}</p>
                  <p className="text-xs text-gray-400">
                    {course.tutor} &middot; {course.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{course.status}</Badge>
                  <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                    Review
                  </button>
                </div>
              </div>
            ))}

            {pendingCourses.length === 0 && (
              <p className="p-5 text-sm text-gray-400">No courses awaiting approval.</p>
            )}
          </div>
        </div>

        {/* Quick action — floating-style button, fixed at the bottom right of the dashboard */}
        <button
          type="button"
          className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
          aria-label="Quick action"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
