import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import StudentsTable from "@/components/admin/tables/StudentsTable";
import { Plus } from "lucide-react";
import { STUDENTS_STATS, STUDENTS } from "@/data/admin-mock";

export default function StudentsPage() {
  return (
    <>
      <Topbar title="Students Management" description="Monitor enrolment, activity and account security." />
      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={STUDENTS_STATS} />
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>
        <StudentsTable rows={STUDENTS} />
      </div>
    </>
  );
}
