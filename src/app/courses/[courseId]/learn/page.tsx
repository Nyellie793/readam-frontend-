import { Download } from "lucide-react";
import CourseTopbar from "@/components/courses/CourseTopbar";
import VideoPlayer from "@/components/courses/VideoPlayer";
import CourseOutline from "@/components/courses/CourseOutline";
import ContinueLearningCard from "@/components/courses/ContinueLearningCard";
import { COURSE_OUTLINE, CONTINUE_LEARNING } from "@/data/student-mock";

export default function LessonPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <CourseTopbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <VideoPlayer
              poster="https://picsum.photos/seed/lecture-screen/1200/675"
              currentTime="12:45"
              duration="45:00"
              progress={28}
            />

            <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-medium text-blue-600">Mathematics • Chapter 4</p>
                <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  Advanced Calculus: Integration by Parts
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
                  In this module, we explore the fundamental techniques of integration by parts,
                  a powerful method derived from the product rule of differentiation. We will
                  solve practical engineering problems using these methods.
                </p>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="size-4" />
                Resources
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
                <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {CONTINUE_LEARNING.map((item) => (
                  <ContinueLearningCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>

          <CourseOutline modules={COURSE_OUTLINE} progress={45} />
        </div>
      </main>
    </div>
  );
}
