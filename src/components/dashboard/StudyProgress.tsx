import StatCards from "@/components/admin/StatCards";
import { STUDY_STATS } from "@/data/student-mock";

export default function StudyProgress() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">
          Study Progress
        </h2>

        <button
          className="
          rounded-full
          border
          border-gray-200
          px-3
          py-1
          text-xs
          font-semibold
          "
        >
          This Week
        </button>
      </div>

      <StatCards stats={STUDY_STATS} />
    </section>
  );
}