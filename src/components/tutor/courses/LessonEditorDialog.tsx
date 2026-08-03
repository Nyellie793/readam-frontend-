"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, CheckCircle2, FileText, Video, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import TUTOR from "@/services/tutor.service";
import { errorMessage, assertUploadable, putToPresigned } from "@/lib/api";
import type { CreateLessonRequest, ModuleLesson } from "@/types/api.types";

type LessonType = "video" | "pdf" | "quiz";

interface LessonEditorDialogProps {
  courseId: string;
  moduleId: string;
  lesson: ModuleLesson | null;
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
  open,
  onOpenChange,
  onSaved,
}: LessonEditorDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LessonType>("video");
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
    setIsPreview(lesson?.is_preview ?? false);
    setDescription("");
    setContentUrl(null);
    setDurationSeconds(lesson?.duration_seconds ?? null);
    setStreamUid(null);
    setContentChanged(false);
    setUploadState(lesson ? "ready" : "idle");
    setUploadProgress(0);
  }, [open, lesson]);

  async function pollVideoStatus(uid: string) {
    for (let attempt = 0; attempt < 100; attempt++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const status = await TUTOR.getVideoStatus(uid);
        if (status.state === "ready") {
          setDurationSeconds(status.duration_seconds);
          setUploadState("ready");
          return;
        }
        if (status.state === "error") {
          setUploadState("error");
          toast.error("Video processing failed. Try uploading again.");
          return;
        }
      } catch {
        // keep polling — a transient failure shouldn't abort processing
      }
    }
    setUploadState("error");
    toast.error("Video is taking longer than expected. Try again shortly.");
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
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
        xhr.onerror = () => reject(new Error("Upload failed"));
        const formData = new FormData();
        formData.append("file", file);
        xhr.send(formData);
      });

      setUploadState("processing");
      await pollVideoStatus(presigned.stream_uid);
    } catch (err) {
      setUploadState("error");
      toast.error(errorMessage(err, "Couldn't upload that video."));
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
      toast.error(errorMessage(err, "Couldn't upload that PDF."));
    }
  }

  function handleFileSelected(file: File) {
    if (type === "video") {
      if (!file.type.startsWith("video/")) {
        toast.error("Please choose a video file.");
        return;
      }
      handleVideoFile(file);
    } else if (type === "pdf") {
      if (file.type !== "application/pdf") {
        toast.error("Please choose a PDF file.");
        return;
      }
      handlePdfFile(file);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Give this lesson a title.");
      return;
    }
    if (!lesson && type !== "quiz" && !contentUrl) {
      toast.error(type === "video" ? "Upload a video first." : "Upload a PDF first.");
      return;
    }
    if (!lesson && type === "video" && uploadState !== "ready") {
      toast.error("Wait for the video to finish processing.");
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
        toast.success("Lesson updated.");
      } else {
        await TUTOR.addLesson(courseId, moduleId, body);
        toast.success("Lesson added.");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't save this lesson."));
    } finally {
      setSaving(false);
    }
  }

  const busy = uploadState === "uploading" || uploadState === "processing";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Lesson Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Limits"
              className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {!lesson && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Lesson Type</label>
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
                {type === "video" ? "Video File" : "PDF File"}
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
                      {lesson ? "Current file kept — click to replace" : "Ready"}
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
              <label className="text-xs font-semibold text-gray-700">Reference Link (optional)</label>
              <input
                value={contentUrl ?? ""}
                onChange={(e) => {
                  setContentUrl(e.target.value || null);
                  setContentChanged(true);
                }}
                placeholder={lesson ? "Leave blank to keep the existing link" : "https://…"}
                className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-blue-600"
            />
            Free preview (visible to students who haven&apos;t enrolled)
          </label>
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
