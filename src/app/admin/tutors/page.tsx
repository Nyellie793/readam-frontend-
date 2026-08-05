"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import ADMIN from "@/services/admin.service";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, Users, ShieldAlert, ShieldCheck } from "lucide-react";
import type {
  AdminTutorListItem,
  AdminTutorListResponse,
} from "@/types/api.types";
import type { StatCardData } from "@/types/dashboard.types";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<AdminTutorListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "verified" | "pending_verification"
  >("all");

  useEffect(() => {
    setLoading(true);
    (ADMIN.getTutors(1, filter) as Promise<AdminTutorListResponse>)
      .then((d) => {
        setTutors(d.items);
        setTotal(d.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  async function toggleVerified(tutor: AdminTutorListItem) {
    const next = !tutor.is_verified;
    await ADMIN.verifyTutor(tutor.id, next);
    setTutors((prev) =>
      prev.map((t) => (t.id === tutor.id ? { ...t, is_verified: next } : t)),
    );
  }

  const verifiedCount = tutors.filter((t) => t.is_verified).length;
  const pendingCount = tutors.filter((t) => !t.is_verified).length;

  const stats: StatCardData[] = [
    {
      id: "total",
      label: "Total Tutors",
      value: String(total),
      icon: GraduationCap,
    },
    {
      id: "verified",
      label: "Verified Educators",
      value: String(verifiedCount),
      icon: ShieldCheck,
    },
    {
      id: "students",
      label: "Total Students Taught",
      value: String(tutors.reduce((sum, t) => sum + t.student_count, 0)),
      icon: Users,
    },
    {
      id: "pending",
      label: "Pending Verification",
      value: String(pendingCount),
      icon: ShieldAlert,
      tone: "accent",
    },
  ];

  return (
    <>
      <Topbar
        title="Tutors Management"
        description="Verify and manage the global educator community."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={stats} />

        <div className="flex gap-2">
          {(["all", "verified", "pending_verification"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    Tutor
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    Students
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-100" />
                      </td>
                    </tr>
                  ))
                ) : tutors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-gray-400"
                    >
                      No tutors found.
                    </td>
                  </tr>
                ) : (
                  tutors.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {t.full_name}
                        </p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {t.subject ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {t.student_count}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={t.is_verified ? "success" : "warning"}>
                          {t.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleVerified(t)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            t.is_verified
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {t.is_verified ? "Unverify" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
