"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import VideoPlayer from "@/components/dashboard/courses/VideoPlayer";
import PdfViewer from "@/components/dashboard/courses/PDFViewer";
import CourseOutline from "@/components/dashboard/courses/CourseOutline";
import ContinueLearningCard from "@/components/dashboard/courses/ContinueLearningCard";
import STUDENT from "@/services/student.service";
import { ApiRequestError } from "@/lib/api";
import type { CourseDetailResponse, LessonContentResponse, ModuleLesson } from "@/types/api.types";

export default function LessonPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);

  const [hasAccess, setHasAccess] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [lesson, setLesson] = useState<LessonContentResponse | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonDenied, setLessonDenied] = useState(false);

  const allLessons = useMemo(
    () =>
      [...(course?.modules ?? [])]
        .sort((a, b) => a.order - b.order)
        .flatMap((m) => [...m.lessons].sort((a, b) => a.order - b.order)),
    [course]
  );

  useEffect(() => {
    setCourseLoading(true);
    STUDENT.getCourse(courseId)
      .then((data) => {
        setCourse(data);
        const firstAvailable = [...data.modules]
          .sort((a, b) => a.order - b.order)
          .flatMap((m) => [...m.lessons].sort((a, b) => a.order - b.order))[0];
        setSelectedLessonId(firstAvailable?.id ?? null);
      })
      .catch((e) => setCourseError(e.message))
      .finally(() => setCourseLoading(false));

    STUDENT.getEnrollments()
      .then((data) => {
        const enrollment = data.items.find((e) => e.course_id === courseId);
        setHasAccess(
          !!enrollment &&
            enrollment.status === "active" &&
            (!enrollment.expires_at || new Date(enrollment.expires_at) > new Date())
        );
      })
      .catch(() => setHasAccess(false));
  }, [courseId]);

  useEffect(() => {
    if (!selectedLessonId) return;
    setLessonLoading(true);
    setLessonDenied(false);
    setLesson(null);
    STUDENT.getLessonContent(courseId, selectedLessonId)
      .then(setLesson)
      .catch((e) => {
        if (e instanceof ApiRequestError && e.status === 403) {
          setLessonDenied(true);
        }
      })
      .finally(() => setLessonLoading(false));
  }, [courseId, selectedLessonId]);

  function handleSelectLesson(l: ModuleLesson) {
    setSelectedLessonId(l.id);
  }

  function handleProgress(positionSeconds: number, completed: boolean) {
    if (!selectedLessonId) return;
    STUDENT.updateLessonProgress(courseId, selectedLessonId, {
      last_position_seconds: positionSeconds,
      completed,
    }).catch(() => null);
  }

  if (courseLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">Loading course…</div>;
  }

  if (courseError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-red-500">
        {courseError ?? "Course not found."}
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const upNext = currentIndex >= 0 ? allLessons.slice(currentIndex + 1, currentIndex + 4) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row">

          <div className="min-w-0 flex-1">
            {lessonLoading && (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-gray-950 text-sm text-white/60">
                Loading lesson…
              </div>
            )}

            {!lessonLoading && lessonDenied && (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-gray-950 text-white/80">
                <Lock className="size-8" />
                <p className="text-sm">Purchase this course to access this lesson.</p>
                <Link
                  href={`/checkout?course=${courseId}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buy Course — {course.price.toLocaleString()} XAF
                </Link>
              </div>
            )}

            {!lessonLoading && !lessonDenied && lesson?.type === "video" && lesson.content_url && (
              <VideoPlayer
                src={lesson.content_url}
                poster={course.thumbnail_url ?? undefined}
                onProgress={handleProgress}
              />
            )}

            {!lessonLoading && !lessonDenied && lesson?.type === "video" && !lesson.content_url && (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-gray-950 text-sm text-white/60">
                Video not uploaded yet.
              </div>
            )}

            {!lessonLoading && !lessonDenied && lesson?.type === "pdf" && (
              <PdfViewer title={lesson.title} fileUrl={lesson.content_url} />
            )}

            {!lessonLoading && !lessonDenied && lesson?.type === "quiz" && (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl bg-gray-950 text-white/80">
                <p className="text-sm">Quiz lessons aren&apos;t supported in this view yet.</p>
              </div>
            )}

            {!lessonLoading && !lessonDenied && lesson && lesson.type !== "pdf" && (
              <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{lesson.title}</h1>
                  {lesson.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{lesson.description}</p>
                  )}
                </div>
              </div>
            )}

            {upNext.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900">Up Next</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {upNext.map((item) => (
                    <ContinueLearningCard
                      key={item.id}
                      title={item.title}
                      meta={item.is_preview ? "Free preview" : "Next in course"}
                      durationSeconds={item.duration_seconds}
                      image={course.thumbnail_url}
                      onClick={() => setSelectedLessonId(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-6">
              <CourseOutline
                modules={course.modules}
                selectedLessonId={selectedLessonId ?? undefined}
                hasAccess={hasAccess}
                onSelectLesson={handleSelectLesson}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
