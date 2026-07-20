"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import ADMIN from "@/services/admin.service";
import { Badge } from "@/components/ui/Badge";
import type { AdminCourseListItem, AdminCoursesResponse } from "@/types/api.types";

const STATUS_TABS = ["all", "pending_review", "published", "draft", "rejected"] as const;

export default function CoursesPage() {
  const [courses, setCourses] = useState<AdminCourseListItem[]>([]);
  const [tab, setTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    (ADMIN.getCourses(1, tab === "all" ? undefined : tab) as Promise<AdminCoursesResponse>)
      .then(d => { setCourses(d.items); setTotal(d.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  async function handleApprove(id: string) {
    await ADMIN.approveCourse(id);
    setCourses(p => p.filter(c => c.id !== id));
  }

  async function handleReject(id: string) {
    await ADMIN.rejectCourse(id);
    setCourses(p => p.filter(c => c.id !== id));
  }

  return (
    <>
      <Topbar title="Courses Management" description="Review, approve and manage all platform courses." />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${tab === t ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {t.replace("_", " ")}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{total} courses</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Course</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Tutor</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-gray-100" /></td></tr>
                  ))
                : courses.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 line-clamp-1">{c.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.category} · {c.total_lessons} lessons</p>
                      </td>
                      <td className="hidden px-5 py-4 text-gray-600 sm:table-cell">{c.tutor_name ?? "—"}</td>
                      <td className="px-5 py-4">
                        <Badge variant={
                          c.status === "published" ? "success" :
                          c.status === "pending_review" ? "warning" :
                          c.status === "rejected" ? "destructive" : "default"
                        }>
                          {c.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {c.status === "pending_review" && (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleApprove(c.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                              Approve
                            </button>
                            <button onClick={() => handleReject(c.id)}
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}