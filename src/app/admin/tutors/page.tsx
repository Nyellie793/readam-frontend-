"use client";

import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Plus, Star, GraduationCap, Users, ShieldAlert } from "lucide-react";
import { TUTORS, type TutorRow } from "@/data/admin-mock";
import type { DataTableColumn, StatCardData } from "@/types/dashboard.types";

const TUTOR_STATS: StatCardData[] = [
  { id: "total", label: "Total Tutors", value: String(TUTORS.length), icon: GraduationCap },
  { id: "verified", label: "Verified Educators", value: String(TUTORS.filter((t) => t.status === "Verified" || t.status === "Active").length), icon: Users },
  { id: "rating", label: "Avg. Platform Rating", value: "4.72", icon: Star },
  { id: "pending", label: "Inactive Profiles", value: String(TUTORS.filter((t) => t.status === "Pending").length), icon: ShieldAlert, tone: "accent" },
];

const statusVariant: Record<TutorRow["status"], "success" | "warning" | "destructive" | "info"> = {
  Verified: "success",
  Active: "success",
  Pending: "warning",
  Suspended: "destructive",
};

const columns: DataTableColumn<TutorRow>[] = [
  {
    key: "name",
    header: "Tutor Details",
    render: (row) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
          {row.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
        <div>
          <p className="font-semibold text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-400">{row.subject}</p>
        </div>
      </div>
    ),
  },
  { key: "email", header: "Account Details" },
  {
    key: "rating",
    header: "Rating",
    render: (row) =>
      row.rating > 0 ? (
        <span className="flex items-center gap-1 font-medium text-gray-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {row.rating}
        </span>
      ) : (
        <span className="text-gray-300">N/A</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export default function TutorsPage() {
  return (
    <>
      <Topbar title="Tutors Management" description="Review, verify and manage the global community of educators." />

      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={TUTOR_STATS} />

        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Invite New Tutor
          </button>
        </div>

        <DataTable columns={columns} rows={TUTORS} searchPlaceholder="Search all tutors..." />
      </div>
    </>
  );
}
