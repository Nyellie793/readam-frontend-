"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Star } from "lucide-react";
import type { TutorRow } from "@/data/admin-mock";
import type { DataTableColumn } from "@/types/dashboard.types";

const statusVariant: Record<
  TutorRow["status"],
  "success" | "warning" | "destructive" | "info"
> = {
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
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
          {row.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <p className="font-semibold text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-400">{row.subject}</p>
        </div>
      </div>
    ),
  },
  { key: "email", header: "Email" },
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
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
];

export default function TutorsTable({ rows }: { rows: TutorRow[] }) {
  return (
    <DataTable columns={columns} rows={rows} searchPlaceholder="Search tutors…" />
  );
}
