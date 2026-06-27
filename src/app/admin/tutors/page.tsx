import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import TutorsTable from "@/components/admin/tables/TutorsTable";
import { Plus, GraduationCap, Users, Star, ShieldAlert } from "lucide-react";
import { TUTORS } from "@/data/admin-mock";
import type { StatCardData } from "@/types/dashboard.types";

const TUTOR_STATS: StatCardData[] = [
  { id: "total",    label: "Total Tutors",        value: String(TUTORS.length), icon: GraduationCap },
  { id: "verified", label: "Verified Educators",  value: String(TUTORS.filter((t) => t.status === "Verified" || t.status === "Active").length), icon: Users },
  { id: "rating",   label: "Avg. Rating",         value: "4.72", icon: Star },
  { id: "pending",  label: "Pending Profiles",    value: String(TUTORS.filter((t) => t.status === "Pending").length), icon: ShieldAlert, tone: "accent" },
];

export default function TutorsPage() {
  return (
    <>
      <Topbar title="Tutors Management" description="Verify and manage the global educator community." />
      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={TUTOR_STATS} />
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Invite Tutor
          </button>
        </div>
        <TutorsTable rows={TUTORS} />
      </div>
    </>
  );
}
