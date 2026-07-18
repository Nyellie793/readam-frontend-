import DashboardCourseCard from "./DashboardCourseCard";
import { DASHBOARD_RECOMMENDED } from "@/data/courses";

export default function RecommendedCourses() {
  return (
    <section>

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Recommended for You
          </h2>

          <p className="text-sm text-gray-500">
            Based on your interests and study history
          </p>
        </div>

        <button
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Explore More
        </button>

      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {DASHBOARD_RECOMMENDED.map(course => (
          <DashboardCourseCard
            key={course.id}
            course={course}
          />
        ))}

      </div>

    </section>
  );
}