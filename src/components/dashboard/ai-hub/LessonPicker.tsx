"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, FileText, Video, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import STUDENT from "@/services/student.service";
import type { EnrolledCourseItem, ModuleLesson } from "@/types/api.types";

interface LessonPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSelect: (lesson: { lessonId: string; lessonTitle: string; courseTitle: string }) => void;
}

export default function LessonPicker({ open, onOpenChange, title, onSelect }: LessonPickerProps) {
  const [courses, setCourses] = useState<EnrolledCourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourseItem | null>(null);
  const [lessons, setLessons] = useState<ModuleLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedCourse(null);
    setLessons([]);
    setLoadingCourses(true);
    STUDENT.getEnrollments()
      .then((data) => setCourses(data.items.filter((c) => c.status === "active")))
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, [open]);

  function selectCourse(course: EnrolledCourseItem) {
    setSelectedCourse(course);
    setLoadingLessons(true);
    STUDENT.getCourse(course.course_id)
      .then((data) => {
        const flat = data.modules.flatMap((m) => m.lessons).filter((l) => l.type !== "quiz");
        setLessons(flat);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoadingLessons(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedCourse && (
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-lg p-1 hover:bg-gray-100"
                aria-label="Back"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}
            {selectedCourse ? selectedCourse.course_title : title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 space-y-1.5 overflow-y-auto">
          {!selectedCourse && (
            <>
              {loadingCourses && (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              )}
              {!loadingCourses && courses.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                  You need an active course enrollment to start a lesson session.
                </p>
              )}
              {!loadingCourses &&
                courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectCourse(c)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-800 hover:border-blue-200 hover:bg-blue-50"
                  >
                    {c.course_title}
                    <span className="text-xs font-normal text-gray-400">
                      {c.course_total_lessons} lessons
                    </span>
                  </button>
                ))}
            </>
          )}

          {selectedCourse && (
            <>
              {loadingLessons && (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              )}
              {!loadingLessons && lessons.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                  No video or PDF lessons in this course yet.
                </p>
              )}
              {!loadingLessons &&
                lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      onSelect({
                        lessonId: l.id,
                        lessonTitle: l.title,
                        courseTitle: selectedCourse.course_title,
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-800 hover:border-blue-200 hover:bg-blue-50"
                  >
                    {l.type === "video" ? (
                      <Video className="size-4 shrink-0 text-blue-500" />
                    ) : (
                      <FileText className="size-4 shrink-0 text-orange-500" />
                    )}
                    <span className="truncate">{l.title}</span>
                  </button>
                ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
