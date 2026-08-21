"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, CheckCircle2, FileText, Video, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import TUTOR from "@/services/tutor.service";
import { errorMessage, assertUploadable, putToPresigned } from "@/lib/api";
import type { CreateLessonRequest, ModuleLesson } from "@/types/api.types";
import { useTranslations } from "next-intl";

type LessonType = "video" | "pdf" | "quiz";

interface LessonEditorDialogProps {
  courseId: string;
  moduleId: string;
  lesson: ModuleLesson | null;
  /** True when this will be the very first lesson of the course. */
  isFirstLessonOfCourse: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const TYPE_OPTIONS: { value: LessonType; label: string; icon: typeof Video }[] = [
  { value: "video", label: "Video", icon: Video },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "quiz", label: "Quiz", icon: HelpCircle },
];

export default function LessonEditorDialog({
  courseId,
  moduleId,
  lesson,
  isFirstLessonOfCourse,
  open,
  onOpenChange,
  onSaved,
}: LessonEditorDialogProps) {
  const t = useTranslations("tutor");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LessonType>("video");
  /**
   * Free preview defaults to the first lesson of the course, which is the
   * usual free sample, but stays changeable. It used to be a fixed value here
   * while the admin create wizard offered it as a switch, so a lesson marked
   * as a preview when the course was built could never be changed afterwards.
   */
  const [isPreview, setIsPreview] = useState(false);
  const [description, setDescription] = useState("");

  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [streamUid, setStreamUid] = useState<string | null>(null);
  // Tracks whether the user supplied new content this session — when editing,
  // omitting content_url/stream_uid/duration_seconds from the PATCH body keeps
  // the lesson's existing file untouched (the backend only updates fields sent).
  const [contentChanged, setContentChanged] = useState(false);

  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "ready" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(lesson?.title ?? "");
    setType(lesson?.type ?? "video");
    setDescription(lesson?.description ?? "");
    setIsPreview(lesson ? lesson.is_preview : isFirstLessonOfCourse);
    setContentUrl(null);
    setDurationSeconds(lesson?.duration_seconds ?? null);
    setStreamUid(null);
    setContentChanged(false);
    setUploadState(lesson ? "ready" : "idle");
    setUploadProgress(0);
  }, [open, lesson, isFirstLessonOfCourse]);

  async function pollVideoStatus(uid: string) {
    for (let attempt = 0; attempt < 100; attempt++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const status = await TUTOR.getVideoStatus(uid);
        if (status.state === "ready") {
          // Cloudflare returns a float (e.g. 144.8s) — the backend's
          // duration_seconds column is an integer and rejects fractional
          // values with a 422, which silently failed the whole save.
          setDurationSeconds(
            status.duration_seconds != null ? Math.round(status.duration_seconds) : null
          );
          setUploadState("ready");
          return;
        }
        if (status.state === "error") {
          setUploadState("error");
          toast.error(t("videoFailed"));
          return;
        }
      } catch {
        // keep polling — a transient failure shouldn't abort processing
      }
    }
    setUploadState("error");
    toast.error(t("videoSlow"));
  }

  async function handleVideoFile(file: File) {
    setUploadState("uploading");
    setUploadProgress(0);
    try {
      const presigned = await TUTOR.requestVideoUpload(file.name, file.size);
      setStreamUid(presigned.stream_uid);
      setContentUrl(presigned.hls_url);
      setContentChanged(true);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", presigned.upload_url);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(t("uploadFailed"))));
        xhr.onerror = () => reject(new Error(t("uploadFailed")));
        const formData = new FormData();
        formData.append("file", file);
        xhr.send(formData);
      });

      setUploadState("processing");
      await pollVideoStatus(presigned.stream_uid);
    } catch (err) {
      setUploadState("error");
      toast.error(errorMessage(err, t("errUploadVideo")));
    }
  }

  async function handlePdfFile(file: File) {
    setUploadState("uploading");
    setUploadProgress(0);
    try {
      assertUploadable(file, "document");
      const presigned = await TUTOR.requestAssetUpload(file.name, file.type);
      await putToPresigned(presigned.upload_url, file);
      setContentUrl(presigned.file_url);
      setContentChanged(true);
      setUploadState("ready");
    } catch (err) {
      setUploadState("error");
      toast.error(errorMessage(err, t("errUploadPdf")));
    }
  }

  function handleFileSelected(file: File) {
    if (type === "video") {
      if (!file.type.startsWith("video/")) {
        toast.error(t("chooseVideo"));
        return;
      }
      handleVideoFile(file);
    } else if (type === "pdf") {
      if (file.type !== "application/pdf") {
        toast.error(t("choosePdf"));
        return;
      }
      handlePdfFile(file);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error(t("needLessonTitle"));
      return;
    }
    if (!lesson && type !== "quiz" && !contentUrl) {
      toast.error(type === "video" ? t("needVideo") : t("needPdf"));
      return;
    }
    if (!lesson && type === "video" && uploadState !== "ready") {
      toast.error(t("waitVideo"));
      return;
    }

    setSaving(true);
    try {
      const body: CreateLessonRequest = {
        title: title.trim(),
        type,
        order: lesson?.order ?? 0,
        description: description.trim() || null,
        is_preview: isPreview,
      };
      // Only touch the file fields when new content was actually uploaded this
      // session — the backend applies a partial update, so omitting these keeps
      // whatever file the lesson already has.
      if (contentChanged) {
        body.content_url = contentUrl || null;
        body.duration_seconds = type === "video" ? durationSeconds : null;
        body.stream_uid = type === "video" ? streamUid : null;
      }

      if (lesson) {
        await TUTOR.updateLesson(courseId, moduleId, lesson.id, body);
        toast.success(t("lessonUpdated"));
      } else {
        await TUTOR.addLesson(courseId, moduleId, body);
        toast.success(t("lessonAdded"));
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err, t("errSaveLesson")));
    } finally {
      setSaving(false);
    }
  }

  const busy = uploadState === "uploading" || uploadState === "processing";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{lesson ? t("editLesson") : t("addLesson")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("lessonTitle")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("lessonTitlePh")}
              className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {!lesson && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("lessonType")}</label>
              <div className="grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setType(opt.value);
                      setContentUrl(null);
                      setUploadState("idle");
                    }}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition-colors",
                      type === opt.value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <opt.icon className="size-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(type === "video" || type === "pdf") && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                {type === "video" ? t("videoFile") : t("pdfFile")}
              </label>
              <div
                onClick={() => !busy && fileInputRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-6 py-6 text-center transition-colors",
                  uploadState === "ready" ? "border-teal-300 bg-teal-50" : "border-gray-200 hover:border-blue-300"
                )}
              >
                {uploadState === "uploading" && (
                  <>
                    <Loader2 className="size-5 animate-spin text-blue-500" />
                    <p className="text-xs font-medium text-gray-600">Uploading… {uploadProgress}%</p>
                  </>
                )}
                {uploadState === "processing" && (
                  <>
                    <Loader2 className="size-5 animate-spin text-blue-500" />
                    <p className="text-xs font-medium text-gray-600">Processing video…</p>
                  </>
                )}
                {uploadState === "ready" && (
                  <>
                    <CheckCircle2 className="size-5 text-teal-600" />
                    <p className="text-xs font-medium text-teal-700">
                      {lesson ? t("fileKept") : "Ready"}
                    </p>
                  </>
                )}
                {(uploadState === "idle" || uploadState === "error") && (
                  <>
                    <UploadCloud className="size-5 text-blue-500" />
                    <p className="text-xs font-medium text-gray-700">
                      Click to choose a {type === "video" ? "video" : "PDF"} file
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={type === "video" ? "video/*" : "application/pdf"}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) handleFileSelected(file);
                }}
              />
            </div>
          )}

          {type === "quiz" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("referenceLink")}</label>
              <input
                value={contentUrl ?? ""}
                onChange={(e) => {
                  setContentUrl(e.target.value || null);
                  setContentChanged(true);
                }}
                placeholder={lesson ? t("keepExisting") : "https://…"}
                className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("descriptionOpt")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Free preview. Matches the switch in the admin create wizard, so a
              lesson can still be opened up, or closed off, after the course
              has been built. */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{t("freePreviewLesson")}</p>
              <p className="text-xs text-gray-400">{t("freePreviewLessonHint")}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPreview((v) => !v)}
              aria-pressed={isPreview}
              aria-label={t("freePreviewLesson")}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                isPreview ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                  isPreview ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || busy}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save Lesson
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
