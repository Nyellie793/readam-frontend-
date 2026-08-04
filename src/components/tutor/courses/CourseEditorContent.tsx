"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Send, Undo2, Trash2, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import TUTOR from "@/services/tutor.service";
import Image from "next/image";
import { errorMessage, assertUploadable, putToPresigned } from "@/lib/api";
import { cn } from "@/lib/utils";
import ModuleList from "./ModuleList";
import type { CourseDetailResponse } from "@/types/api.types";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  pending_review: "bg-orange-50 text-orange-600",
  published: "bg-teal-50 text-teal-600",
  rejected: "bg-red-50 text-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  published: "Published",
  rejected: "Rejected",
};

interface CourseEditorContentProps {
  courseId: string;
}

export default function CourseEditorContent({ courseId }: CourseEditorContentProps) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  function hydrate(c: CourseDetailResponse) {
    setCourse(c);
    setTitle(c.title);
    setDescription(c.description ?? "");
    setCategory(c.category);
    setPrice(String(c.price));
    setThumbnailUrl(c.thumbnail_url ?? null);
  }

  function reload() {
    return TUTOR.getMyCourse(courseId).then(hydrate);
  }

  useEffect(() => {
    reload().catch((err) => setError(errorMessage(err, "Couldn't load this course.")));
  }, [courseId]);

  /**
   * Published courses stay editable: syllabuses change and material goes out of
   * date, so a tutor can add a module or fix a lesson without withdrawing the
   * course from students who already paid. Only a course under review is frozen,
   * because an admin is looking at it — retract it to edit.
   */
  const editable = course?.status !== "pending_review";

  async function handleThumbnail(file: File) {
    setUploadingThumb(true);
    try {
      assertUploadable(file, "image");
      const presigned = await TUTOR.requestAssetUpload(file.name, file.type);
      await putToPresigned(presigned.upload_url, file);
      setThumbnailUrl(presigned.file_url);
      toast.success("Cover uploaded. Save to apply it.");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't upload that image."));
    } finally {
      setUploadingThumb(false);
    }
  }

  async function handleSaveInfo() {
    setSaving(true);
    try {
      await TUTOR.updateCourse(courseId, {
        title: title.trim(),
        description: description.trim() || null,
        category,
        price: Number(price) || 0,
        is_premium: Number(price) > 0,
        thumbnail_url: thumbnailUrl,
      });
      toast.success("Course updated.");
      reload();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't save this course."));
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setActionBusy(true);
    try {
      await TUTOR.submitCourse(courseId);
      toast.success("Submitted for review.");
      reload();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't submit this course for review."));
    } finally {
      setActionBusy(false);
    }
  }

  async function handleRetract() {
    setActionBusy(true);
    try {
      await TUTOR.retractSubmission(courseId);
      toast.success("Submission retracted — back to draft.");
      reload();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't retract this submission."));
    } finally {
      setActionBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setActionBusy(true);
    try {
      await TUTOR.deleteCourse(courseId);
      toast.success("Course deleted.");
      router.push("/tutor/courses");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't delete this course."));
      setActionBusy(false);
    }
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/tutor/courses")}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="size-4" />
        Back to My Courses
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-gray-900">{course.title}</h1>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              STATUS_STYLES[course.status] ?? "bg-gray-100 text-gray-600"
            )}
          >
            {STATUS_LABELS[course.status] ?? course.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {editable && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionBusy || course.total_lessons === 0}
              title={course.total_lessons === 0 ? "Add at least one lesson before submitting" : undefined}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionBusy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit for Review
            </button>
          )}
          {course.status === "pending_review" && (
            <button
              type="button"
              onClick={handleRetract}
              disabled={actionBusy}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {actionBusy ? <Loader2 className="size-4 animate-spin" /> : <Undo2 className="size-4" />}
              Retract Submission
            </button>
          )}
          {editable && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={actionBusy}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              aria-label="Delete course"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      {course.status === "rejected" && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          This course was rejected by our review team. Make the necessary changes and submit it again.
        </div>
      )}
      {course.status === "pending_review" && (
        <div className="flex items-start gap-2 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          This course is being reviewed by our admin team. You can retract it to keep editing.
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Course Details</h2>
        <fieldset disabled={!editable} className="mt-4 space-y-4 disabled:opacity-60">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {COURSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Price (XAF)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          {/* Course cover. Cloudflare R2 only stores what we send it — nothing
              generates a thumbnail automatically, so this has to be uploaded. */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">Course cover</label>
            <div className="flex items-center gap-4">
              <div className="relative aspect-16/10 w-40 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {thumbnailUrl ? (
                  <Image src={thumbnailUrl} alt="" fill sizes="160px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <ImageIcon className="size-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) handleThumbnail(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  disabled={uploadingThumb || !editable}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingThumb ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                  {thumbnailUrl ? "Replace cover" : "Upload cover"}
                </button>
                <p className="mt-2 text-[11px] text-gray-400">JPG, PNG or WebP. Max 5MB. Shown on the course card.</p>
              </div>
            </div>
          </div>
        </fieldset>

        {editable && (
          <div className="mt-4 flex justify-end border-t border-gray-50 pt-4">
            <button
              type="button"
              onClick={handleSaveInfo}
              disabled={saving}
              className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-gray-900">Modules & Lessons</h2>
        <ModuleList courseId={courseId} modules={course.modules} editable={!!editable} onChanged={reload} />
      </div>
    </div>
  );
}
