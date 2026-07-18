import { Download } from "lucide-react";
import VideoPlayer from "@/components/dashboard/courses/VideoPlayer";
import PdfViewer from "@/components/dashboard/courses/PDFViewer";
import CourseOutline from "@/components/dashboard/courses/CourseOutline";
import ContinueLearningCard from "@/components/dashboard/courses/ContinueLearningCard";
import { COURSE_OUTLINE, CONTINUE_LEARNING } from "@/data/student-mock";
import { RECOMMENDED_COURSES, POPULAR_COURSES } from "@/data/courses";

// Find the course from all available courses by id
function getCourse(id: string) {
  return [...RECOMMENDED_COURSES, ...POPULAR_COURSES].find((c) => c.id === id);
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = getCourse(params.courseId);
  const isPdf = course?.format === "PDF";

  // PDF courses get their own full-screen reader layout
  if (isPdf) {
    return (
      <PdfViewer
        title={course?.title ?? "Course Document"}
        totalPages={45}
      />
    );
  }

  // Video / Interactive layout
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row">

          <div className="min-w-0 flex-1">
            <VideoPlayer
              poster="https://picsum.photos/seed/lecture-screen/1200/675"
              currentTime="12:45"
              duration="45:00"
              progress={28}
            />

            <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="min-w-0">
                <p className="text-sm font-medium text-blue-600">Mathematics • Chapter 4</p>
                <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {course?.title ?? "Advanced Calculus: Integration by Parts"}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  In this module, we explore the fundamental techniques of integration by parts,
                  a powerful method derived from the product rule of differentiation. We will
                  solve practical engineering problems using these methods.
                </p>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50"
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

          <div className="w-full lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-6">
              <CourseOutline modules={COURSE_OUTLINE} progress={45} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}