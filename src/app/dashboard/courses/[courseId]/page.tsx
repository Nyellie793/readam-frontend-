"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Lock, AlertTriangle } from "lucide-react";
import VideoPlayer from "@/components/dashboard/courses/VideoPlayer";
import PdfViewer from "@/components/dashboard/courses/PDFViewer";
import CourseOutline from "@/components/dashboard/courses/CourseOutline";
import ContinueLearningCard from "@/components/dashboard/courses/ContinueLearningCard";
import STUDENT from "@/services/student.service";
import { ApiRequestError, errorMessage } from "@/lib/api";
import type { CourseDetailResponse, LessonContentResponse, ModuleLesson } from "@/types/api.types";
import { useTranslations } from "next-intl";

export default function LessonPage() {
  const t = useTranslations("dash");
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);

  const [hasAccess, setHasAccess] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [lesson, setLesson] = useState<LessonContentResponse | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonDenied, setLessonDenied] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  // Bumping this re-runs the lesson fetch. Re-setting selectedLessonId to the
  // same value would be a no-op, so a retry needs its own changing dep.
  const [lessonRetry, setLessonRetry] = useState(0);

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

    // Entitlement must be checked across *all* enrolment pages. Reading only
    // page 1 meant a student whose enrolment had scrolled onto a later page saw
    // a locked outline and a "Buy Course" button for content they already own —
    // and the more they enrolled in, the more likely that became.
    let cancelled = false;

    (async () => {
      try {
        let page = 1;
        for (;;) {
          const data = await STUDENT.getEnrollments(page);
          if (cancelled) return;

          const enrollment = data.items.find((e) => e.course_id === courseId);
          if (enrollment) {
            setHasAccess(
              enrollment.status === "active" &&
                (!enrollment.expires_at || new Date(enrollment.expires_at) > new Date())
            );
            return;
          }

          const seen = data.page * data.page_size;
          if (data.items.length === 0 || seen >= data.total) break;
          page += 1;
        }
        setHasAccess(false);
      } catch {
        // Access is re-checked authoritatively by the lesson endpoint (403), so
        // failing closed here only affects the outline's lock icons.
        if (!cancelled) setHasAccess(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!selectedLessonId) return;
    setLessonLoading(true);
    setLessonDenied(false);
    setLesson(null);
    setLessonError(null);
    STUDENT.getLessonContent(courseId, selectedLessonId)
      .then(setLesson)
      .catch((e) => {
        if (e instanceof ApiRequestError && e.status === 403) {
          setLessonDenied(true);
          return;
        }
        // Anything else (500, timeout, offline) used to be swallowed, leaving
        // an unexplained blank rectangle where the player should be.
        setLessonError(errorMessage(e, t("lessonFailed")));
      })
      .finally(() => setLessonLoading(false));
  }, [courseId, selectedLessonId, lessonRetry]);

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
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">{t("loadingCourse")}</div>;
  }

  if (courseError || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-red-500">
        {courseError ?? t("courseNotFound")}
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
                {t("loadingLesson")}
              </div>
            )}

            {!lessonLoading && lessonDenied && (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-gray-950 text-white/80">
                <Lock className="size-8" />
                <p className="text-sm">{t("purchaseToAccess")}</p>
                <Link
                  href={`/checkout?course=${courseId}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {t("buyCourse")} — {course.price.toLocaleString()} XAF
                </Link>
              </div>
            )}

            {!lessonLoading && !lessonDenied && lessonError && (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-gray-950 px-6 text-center text-white/80">
                <AlertTriangle className="size-7 text-orange-400" />
                <p className="text-sm">{lessonError}</p>
                <button
                  type="button"
                  onClick={() => setLessonRetry((n) => n + 1)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t("tryAgain")}
                </button>
              </div>
            )}

            {!lessonLoading && !lessonDenied && !lessonError && lesson?.type === "video" && lesson.content_url && (
              <VideoPlayer
                src={lesson.content_url}
                poster={course.thumbnail_url ?? undefined}
                onProgress={handleProgress}
                captions={{
                  en: lesson.caption_url_en,
                  fr: lesson.caption_url_fr,
                  status: lesson.transcript_status,
                }}
              />
            )}

            {!lessonLoading && !lessonDenied && !lessonError && lesson?.type === "video" && !lesson.content_url && (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-gray-950 text-sm text-white/60">
                {t("videoNotUploaded")}
              </div>
            )}

            {!lessonLoading && !lessonDenied && !lessonError && lesson?.type === "pdf" && (
              <PdfViewer title={lesson.title} fileUrl={lesson.content_url} />
            )}

            {!lessonLoading && !lessonDenied && !lessonError && lesson?.type === "quiz" && (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl bg-gray-950 text-white/80">
                <p className="text-sm">Quiz lessons aren&apos;t supported in this view yet.</p>
              </div>
            )}

            {!lessonLoading && !lessonDenied && !lessonError && lesson && lesson.type !== "pdf" && (
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
                <h2 className="text-lg font-bold text-gray-900">{t("upNext")}</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {upNext.map((item) => (
                    <ContinueLearningCard
                      key={item.id}
                      title={item.title}
                      meta={item.is_preview ? t("freePreview") : t("nextInCourse")}
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
