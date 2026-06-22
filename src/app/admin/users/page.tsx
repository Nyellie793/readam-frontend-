"use client";

import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";
import { STUDENTS_STATS, STUDENTS, type StudentRow } from "@/data/admin-mock";
import type { DataTableColumn } from "@/types/dashboard.types";

const statusVariant: Record<StudentRow["status"], "success" | "destructive"> = {
  Active: "success",
  Suspended: "destructive",
};

const columns: DataTableColumn<StudentRow>[] = [
  {
    key: "name",
    header: "Student Details",
    render: (row) => (
      <div>
        <p className="font-semibold text-gray-800">{row.name}</p>
        <p className="text-xs text-gray-400">{row.email}</p>
      </div>
    ),
  },
  { key: "courses", header: "Enrollments" },
  { key: "joined", header: "Joined" },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export default function StudentsPage() {
  return (
    <>
      <Topbar title="Students Management" description="Review student activity, enrollment stats and account security." />

      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={STUDENTS_STATS} />

        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add New Student
          </button>
        </div>

        <DataTable columns={columns} rows={STUDENTS} searchPlaceholder="Filter by name, email or ID..." />
      </div>
    </>
  );
}
