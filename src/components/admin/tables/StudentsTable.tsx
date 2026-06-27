"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { StudentRow } from "@/data/admin-mock";
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
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
];

export default function StudentsTable({ rows }: { rows: StudentRow[] }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      searchPlaceholder="Filter by name, email or ID…"
    />
  );
}
