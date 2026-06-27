"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { CourseRow } from "@/data/admin-mock";
import type { DataTableColumn } from "@/types/dashboard.types";

const statusVariant: Record<CourseRow["status"], "success" | "warning" | "destructive"> = {
  Published: "success",
  Pending: "warning",
  Rejected: "destructive",
};

// ✅ render functions live here — inside the Client Component
const columns: DataTableColumn<CourseRow>[] = [
  {
    key: "title",
    header: "Course Details",
    render: (row) => (
      <div>
        <p className="font-semibold text-gray-800">{row.title}</p>
        <p className="text-xs text-gray-400">{row.category}</p>
      </div>
    ),
  },
  { key: "tutor", header: "Tutor" },
  { key: "updated", header: "Updated" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
];

interface Props {
  rows: CourseRow[];
}

export default function CoursesTable({ rows }: Props) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      searchPlaceholder="Search courses, tutors…"
    />
  );
}
