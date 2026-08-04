"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import SkeletonTable from "@/components/skeletons/SkeletonTable";
import CreateCourseDialog from "./CreateCourseDialog";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CourseListItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  pending_review: "bg-orange-50 text-orange-600",
  published: "bg-teal-50 text-teal-600",
  rejected: "bg-red-50 text-red-500",
};


export default function TutorCoursesContent() {
  const t = useTranslations("tutor");
  const STATUS_LABELS: Record<string, string> = {
    draft: "Draft",
    pending_review: t("pendingReview"),
    published: "Published",
    rejected: "Rejected",
  };
  const [courses, setCourses] = useState<CourseListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    TUTOR.listMyCourses()
      .then(setCourses)
      .catch((err) => setError(errorMessage(err, t("errLoadCourses"))));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t("myCourses")}</h1>
          <p className="text-sm text-gray-500">{t("coursesIntro")}</p>
        </div>
        <CreateCourseDialog />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {courses === null && !error ? (
        <SkeletonTable rows={4} columns={4} />
      ) : courses && courses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <BookOpen className="size-10 text-gray-300" />
          <div>
            <p className="text-sm font-semibold text-gray-700">You haven&apos;t created any courses yet.</p>
            <p className="text-xs text-gray-400">{t("startBuilding")}</p>
          </div>
          <CreateCourseDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/tutor/courses/${course.id}`}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Layers className="size-5" />
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    STATUS_STYLES[course.status] ?? "bg-gray-100 text-gray-600"
                  )}
                >
                  {STATUS_LABELS[course.status] ?? course.status}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 text-sm font-bold text-gray-900">{course.title}</h3>
              <p className="mt-1 text-xs text-gray-400">
                {course.total_lessons} lesson{course.total_lessons === 1 ? "" : "s"} ·{" "}
                {course.price === 0 ? "Free" : `${course.price.toLocaleString()} XAF`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
