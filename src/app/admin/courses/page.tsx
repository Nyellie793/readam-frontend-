import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import CoursesTable from "@/components/admin/tables/CoursesTable";
import { Plus } from "lucide-react";
import { COURSES_STATS, COURSES } from "@/data/admin-mock";

// ✅ Server Component — passes only serializable data (no render functions)
export default function CoursesPage() {
  return (
    <>
      <Topbar title="Courses Management" description="Review, approve and manage all platform courses." />
      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={COURSES_STATS} />
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Course
          </button>
        </div>
        <CoursesTable rows={COURSES} />
      </div>
    </>
  );
}
