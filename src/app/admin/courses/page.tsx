import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";
import { COURSES_STATS, COURSES, type CourseRow } from "@/data/admin-mock";
import type { DataTableColumn } from "@/types/dashboard.types";

const statusVariant: Record<CourseRow["status"], "success" | "warning" | "destructive"> = {
  Published: "success",
  Pending: "warning",
  Rejected: "destructive",
};

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
    render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export default function CoursesPage() {
  return (
    <>
      <Topbar title="Courses Management" description="Search courses, tutors..." />

      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatCards stats={COURSES_STATS} />
        </div>

        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Invite New Course
          </button>
        </div>

        <DataTable columns={columns} rows={COURSES} searchPlaceholder="Search courses, tutors..." />
      </div>
    </>
  );
}
