"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import ADMIN from "@/services/admin.service";
import { Badge } from "@/components/ui/Badge";
import { Search, Users, UserCheck, BookOpen } from "lucide-react";
import type { AdminStudentListItem, AdminStudentListResponse, AdminUserResponse } from "@/types/api.types";
import type { StatCardData } from "@/types/dashboard.types";

export default function StudentsPage() {
  const [students, setStudents] = useState<AdminStudentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      (ADMIN.getStudents(1, search) as Promise<AdminStudentListResponse>)
        .then((d) => {
          setStudents(d.items);
          setTotal(d.total);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  async function toggleActive(student: AdminStudentListItem) {
    const updated = (await ADMIN.updateUser(student.id, {
      is_active: !student.is_active,
    })) as AdminUserResponse;
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, is_active: updated.is_active } : s))
    );
  }

  const activeCount = students.filter((s) => s.is_active).length;
  const totalEnrollments = students.reduce((sum, s) => sum + s.enrollment_count, 0);

  const stats: StatCardData[] = [
    { id: "total", label: "Total Students", value: String(total), icon: Users },
    { id: "active", label: "Active Accounts", value: String(activeCount), icon: UserCheck },
    { id: "enrollments", label: "Total Enrollments", value: String(totalEnrollments), icon: BookOpen },
  ];

  return (
    <>
      <Topbar title="Students Management" description="View and manage student accounts." />
      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={stats} />

        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Student</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Enrollments</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Joined</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-100" />
                      </td>
                    </tr>
                  ))
                : students.length === 0
                ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                        No students found.
                      </td>
                    </tr>
                  )
                : students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{s.full_name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </td>
                      <td className="hidden px-5 py-4 text-gray-600 sm:table-cell">{s.enrollment_count}</td>
                      <td className="hidden px-5 py-4 text-gray-600 sm:table-cell">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={s.is_active ? "success" : "destructive"}>
                          {s.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleActive(s)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            s.is_active
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {s.is_active ? "Suspend" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
