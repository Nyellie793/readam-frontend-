import { ChevronDown } from "lucide-react";
import CourseTopbar from "@/components/courses/CourseTopbar";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseCard from "@/components/courses/CourseCard";
import AiTutorBanner from "@/components/courses/AiTutorBanner";
import { RECOMMENDED_COURSES, POPULAR_COURSES } from "@/data/courses";

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <CourseTopbar
        searchPlaceholder="Search for engineering or design courses..."
        showMobileFilters
      />

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
          <div className="fixed h-[calc(100vh-73px)] w-64">
            <CourseFilters />
          </div>
        </aside>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recommended for You</h1>
              <p className="mt-1 text-sm text-gray-500">
                Based on your interest in &quot;Engineering &amp; Design&quot;
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sort by: Most Relevant
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDED_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Popular This Week</h2>
            <p className="mt-1 text-sm text-gray-500">Trending topics in your community</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-10">
            <AiTutorBanner />
          </div>
        </main>
      </div>
    </div>
  );
}
