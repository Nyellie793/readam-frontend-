import { ChevronDown } from "lucide-react";
import CourseTopbar from "@/components/dashboard/courses/CourseTopbar";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import AiTutorBanner from "@/components/dashboard/courses/AiTutorBanner";
import {
  RECOMMENDED_COURSES,
  POPULAR_COURSES,
} from "@/data/courses";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CourseTopbar
        searchPlaceholder="Search for engineering or design courses..."
        showMobileFilters
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              Recommended for You
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Based on your interest in Engineering &amp; Design
            </p>
          </div>

          <button
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Sort by: Most Relevant
            <ChevronDown className="size-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECOMMENDED_COURSES.map(course => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">
            Popular This Week
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Trending topics in your community
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_COURSES.map(course => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>

        <div className="mt-10">
          <AiTutorBanner />
        </div>
      </main>
    </div>
  );
}