"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import ADMIN from "@/services/admin.service";
import type { AdminStatsResponse, AdminCoursesResponse } from "@/types/api.types";

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [pendingCourses, setPendingCourses] = useState<AdminCoursesResponse["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ADMIN.getStats() as Promise<AdminStatsResponse>,
      ADMIN.getCourses(1, "pending_review") as Promise<AdminCoursesResponse>,
    ])
      .then(([s, c]) => {
        setStats(s);
        setPendingCourses(c.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(id: string) {
    await ADMIN.approveCourse(id);
    setPendingCourses(p => p.filter(c => c.id !== id));
  }

  async function handleReject(id: string) {
    await ADMIN.rejectCourse(id);
    setPendingCourses(p => p.filter(c => c.id !== id));
  }

  return (
    <>
      <Topbar title="System Overview" description="Real-time platform stats." />
      <div className="space-y-6 p-4 sm:p-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Courses" value={stats.courses.total} sub={`${stats.courses.published} published`} />
            <StatCard label="Pending Review" value={stats.courses.pending_review} sub="Awaiting approval" />
            <StatCard label="Tutors" value={stats.tutors.total} sub={`${stats.tutors.verified} verified`} />
            <StatCard label="Students" value={stats.students.total} sub={`${stats.students.active_enrollments} enrolled`} />
          </div>
        ) : null}

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900">Pending Course Approvals</h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingCourses.map(course => (
              <div key={course.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{course.title}</p>
                  <p className="text-xs text-gray-400">{course.tutor_name} · {course.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Pending</Badge>
                  <button
                    onClick={() => handleApprove(course.id)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(course.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {!loading && pendingCourses.length === 0 && (
              <p className="p-5 text-sm text-gray-400">No courses awaiting approval.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}