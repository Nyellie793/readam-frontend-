"use client";

import { useEffect, useState } from "react";
import { X, Loader2, HelpCircle, ExternalLink } from "lucide-react";
import VideoPlayer from "@/components/dashboard/courses/VideoPlayer";
import ADMIN from "@/services/admin.service";
import type { LessonContentResponse } from "@/types/api.types";

interface LessonPreviewProps {
  courseId: string;
  lessonId: string;
  onClose: () => void;
}

/**
 * Inline player for the course review screen.
 *
 * Approval used to be made from lesson titles alone, since the student lesson
 * endpoint gates on enrolment and an admin reviewing an unpublished course can
 * never satisfy that. This uses the admin route instead, so the actual video
 * or PDF can be checked before publishing it to students.
 */
export default function LessonPreview({ courseId, lessonId, onClose }: LessonPreviewProps) {
  const [lesson, setLesson] = useState<LessonContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (ADMIN.getLessonForReview(courseId, lessonId) as Promise<LessonContentResponse>)
      .then((d) => {
        if (!cancelled) setLesson(d);
      })
      .catch((e) => {
        if (!cancelled) {
          setError((e as { detail?: string })?.detail ?? "Could not load this lesson.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, lessonId]);

  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-gray-800">
          {lesson?.title ?? "Loading lesson…"}
        </p>
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
        >
          <X className="size-4" />
        </button>
      </div>

      {loading && (
        <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
          <Loader2 className="size-5 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && error && <p className="py-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && lesson && (
        <>
          {lesson.type === "video" &&
            (lesson.content_url ? (
              <VideoPlayer
                src={lesson.content_url}
                captions={{
                  en: lesson.caption_url_en,
                  fr: lesson.caption_url_fr,
                  status: lesson.transcript_status,
                }}
                // Admins are reviewing, not studying, so nothing is recorded.
                onProgress={() => {}}
              />
            ) : (
              <p className="rounded-xl bg-orange-50 px-4 py-6 text-center text-sm text-orange-800">
                No video has been uploaded for this lesson yet.
              </p>
            ))}

          {lesson.type === "pdf" &&
            (lesson.content_url ? (
              <>
                <object
                  data={lesson.content_url}
                  type="application/pdf"
                  className="h-[60vh] w-full rounded-xl border border-gray-200 bg-white"
                >
                  {/* iOS Safari will not render an inline PDF, so give it a link. */}
                  <p className="p-6 text-sm text-gray-500">
                    Your browser cannot display this PDF inline.
                  </p>
                </object>
                <a
                  href={lesson.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  Open in a new tab
                </a>
              </>
            ) : (
              <p className="rounded-xl bg-orange-50 px-4 py-6 text-center text-sm text-orange-800">
                No PDF has been uploaded for this lesson yet.
              </p>
            ))}

          {lesson.type === "quiz" && (
            <p className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-8 text-sm text-gray-500">
              <HelpCircle className="size-4" />
              Quiz lessons have no content to preview yet.
            </p>
          )}

          {lesson.description && (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {lesson.description}
            </p>
          )}

          {lesson.type === "video" && lesson.transcript_status !== "ready" && (
            <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-800">
              Transcript is {lesson.transcript_status}. Students cannot start an AI
              session on this lesson until it is ready.
            </p>
          )}
        </>
      )}
    </div>
  );
}
