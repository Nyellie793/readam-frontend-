"use client";

import { useState } from "react";
import { Lock, PlayCircle, FileText, Eye, Loader2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import STUDENT from "@/services/student.service";
import { errorMessage } from "@/lib/api";
import type { ModuleLesson, LessonContentResponse } from "@/types/api.types";
import { useTranslations } from "next-intl";

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  const mins = Math.round(seconds / 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/**
 * One lesson row in the public course outline. A free-preview lesson is now
 * clickable: it opens a dialog and plays the actual video or PDF, using the
 * lesson-content endpoint anonymously (it serves is_preview lessons of a
 * published course with no auth). Every other lesson keeps the plain, inert
 * row it always had — the outline's job there is just to show what the
 * course covers, not to let a visitor in.
 */
export default function PreviewLessonRow({
  lesson,
  courseId,
}: {
  lesson: ModuleLesson;
  courseId: string;
}) {
  const t = useTranslations("courses");
  const duration = formatDuration(lesson.duration_seconds);

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<LessonContentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpen() {
    setOpen(true);
    if (content || loading) return;
    setLoading(true);
    setError(null);
    STUDENT.getLessonContent(courseId, lesson.id)
      .then(setContent)
      .catch((e) => setError(errorMessage(e, t("previewFailed"))))
      .finally(() => setLoading(false));
  }

  const row = (
    <>
      {lesson.type === "video" ? (
        <PlayCircle className="size-4 shrink-0 text-gray-400" />
      ) : (
        <FileText className="size-4 shrink-0 text-gray-400" />
      )}
      <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
      {/* The sample is a two-page extract of this lesson, generated
          server-side. It exists on the first PDF lesson only, so this
          renders on exactly one row per course. Independent of the preview
          dialog below — a PDF lesson can offer both. */}
      {lesson.preview_url && (
        <a
          href={lesson.preview_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-100"
        >
          <Eye className="size-3" />
          Sample
        </a>
      )}
      {lesson.is_preview ? (
        <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-600">
          {t("freePreview")}
        </span>
      ) : (
        <Lock className="size-3.5 shrink-0 text-gray-300" />
      )}
      {duration && <span className="shrink-0 text-xs text-gray-400">{duration}</span>}
    </>
  );

  if (!lesson.is_preview) {
    return <li className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700">{row}</li>;
  }

  return (
    <>
      <li>
        <button
          type="button"
          onClick={handleOpen}
          className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50/50"
        >
          {row}
        </button>
      </li>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{lesson.title}</DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-950 text-sm text-white/60">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}

          {!loading && error && (
            <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 text-center text-white/80">
              <AlertTriangle className="size-6 text-orange-400" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && content?.type === "video" && content.content_url && (
            <video
              key={content.content_url}
              src={content.content_url}
              controls
              autoPlay
              className="aspect-video w-full rounded-xl bg-black"
            />
          )}

          {!loading && !error && content?.type === "pdf" && content.content_url && (
            <iframe
              src={content.content_url}
              title={content.title}
              className="h-[70vh] w-full rounded-xl border-0"
            />
          )}

          {!loading && !error && content && content.type !== "video" && content.type !== "pdf" && (
            <p className="py-6 text-center text-sm text-gray-500">{t("previewUnsupported")}</p>
          )}

          {!loading && !error && content && !content.content_url && (
            <p className="py-6 text-center text-sm text-gray-500">{t("previewUnsupported")}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
