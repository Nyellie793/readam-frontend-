"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  X,
  Video,
  FileText,
  HelpCircle,
  Eye,
  Loader2,
  Star,
  Pencil,
} from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import { Badge } from "@/components/ui/Badge";
import ADMIN from "@/services/admin.service";
import LessonPreview from "@/components/admin/course/LessonPreview";
import RejectCourseDialog from "@/components/admin/course/RejectCourseDialog";
import type { AdminCourseDetail } from "@/types/api.types";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "muted"> = {
  published: "success",
  pending_review: "warning",
  rejected: "destructive",
  draft: "muted",
};

const STATUS_LABEL: Record<string, string> = {
  published: "Published",
  pending_review: "Pending review",
  rejected: "Rejected",
  draft: "Draft",
};

const LESSON_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  video: Video,
  pdf: FileText,
  quiz: HelpCircle,
};

function duration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

export default function AdminCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<AdminCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);
  // Only one lesson is open at a time, so reviewing does not spawn a wall of
  // players all buffering at once.
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCourse((await ADMIN.getCourseDetail(courseId)) as AdminCourseDetail);
    } catch (e) {
      setError((e as { detail?: string })?.detail ?? "Could not load this course.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function approve() {
    if (!course) return;
    setActing("approve");
    try {
      await ADMIN.approveCourse(course.id);
      toast.success("Course published, the tutor has been emailed");
      await load();
    } catch (e) {
      toast.error((e as { detail?: string })?.detail ?? "Could not approve this course");
    } finally {
      setActing(null);
    }
  }

  async function reject(reason: string) {
    if (!course) return;
    setActing("reject");
    try {
      await ADMIN.rejectCourse(course.id, reason);
      toast.success("Sent back to the tutor with your feedback");
      setRejecting(false);
      await load();
    } catch (e) {
      toast.error((e as { detail?: string })?.detail ?? "Could not reject this course");
    } finally {
      setActing(null);
    }
  }

  const pending = course?.status === "pending_review";

  return (
    <>
      <Topbar title="Course Review" description="Inspect the full course before approving it." />

      <div className="space-y-6 p-4 sm:p-6">
        <button
          onClick={() => router.push("/admin/courses")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft className="size-4" />
          Back to courses
        </button>

        {loading && (
          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              onClick={() => void load()}
              className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && course && (
          <>
            {/* Header */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {course.thumbnail_url ? (
                    <Image
                      src={course.thumbnail_url}
                      alt=""
                      width={160}
                      height={96}
                      className="h-24 w-40 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                      No thumbnail
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={STATUS_VARIANT[course.status] ?? "muted"}>
                        {STATUS_LABEL[course.status] ?? course.status}
                      </Badge>
                      {course.is_premium && <Badge variant="info">Premium</Badge>}
                    </div>
                    <h2 className="mt-2 text-lg font-bold text-gray-900">{course.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {course.price === 0
                        ? "Free"
                        : `${course.price.toLocaleString()} XAF`}{" "}
                      · {course.total_lessons} lessons · {course.modules.length} modules
                    </p>
                    {course.review_count > 0 && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                        <Star className="size-3.5 text-amber-500" />
                        {course.avg_rating?.toFixed(1)} from {course.review_count} reviews
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {/* Published courses stay editable on purpose: syllabuses
                      change and material goes stale. Only pending_review is
                      frozen, since it is being reviewed right now. */}
                  {course.status !== "pending_review" && (
                    <Link
                      href={`/tutor/courses/${course.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil className="size-4" />
                      Edit content
                    </Link>
                  )}
                </div>

                {pending && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setRejecting(true)}
                      disabled={acting !== null}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {acting === "reject" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <X className="size-4" />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => void approve()}
                      disabled={acting !== null}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {acting === "approve" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approve
                    </button>
                  </div>
                )}
              </div>

              {course.status === "rejected" && course.rejection_reason && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50/60 p-4">
                  <p className="text-xs font-semibold text-red-700">
                    Rejected with this feedback
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-sm text-red-900/80">
                    {course.rejection_reason}
                  </p>
                </div>
              )}

              {course.description && (
                <div className="mt-6 border-t border-gray-50 pt-5">
                  <p className="text-xs font-semibold text-gray-400">Description</p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {course.description}
                  </p>
                </div>
              )}

              {course.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Instructor */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900">Instructor</h3>
              <div className="mt-4 flex items-start gap-4">
                {course.instructor.avatar_url ? (
                  <Image
                    src={course.instructor.avatar_url}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                    {course.instructor.full_name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/tutors/${course.instructor.user_id}`}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {course.instructor.full_name}
                    </Link>
                    <Badge variant={course.instructor.is_verified ? "success" : "warning"}>
                      {course.instructor.is_verified ? "Verified" : "Not verified"}
                    </Badge>
                  </div>
                  {course.instructor.subject && (
                    <p className="mt-0.5 text-xs text-gray-500">{course.instructor.subject}</p>
                  )}
                  {course.instructor.bio && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              </div>

              {!course.instructor.is_verified && pending && (
                <p className="mt-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-900">
                  This tutor is not verified yet. Review their profile before publishing
                  their course.
                </p>
              )}
            </div>

            {/* Curriculum */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Curriculum ({course.total_lessons} lessons)
                </h3>
              </div>

              {course.modules.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-gray-400">
                  This course has no modules yet. There is nothing for a student to study.
                </p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {course.modules
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((m, mi) => (
                      <div key={m.id} className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {mi + 1}. {m.title}
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            {m.lessons.length} {m.lessons.length === 1 ? "lesson" : "lessons"}
                          </span>
                        </p>

                        {m.lessons.length === 0 ? (
                          <p className="mt-2 text-xs text-orange-600">
                            This module is empty.
                          </p>
                        ) : (
                          <ul className="mt-3 space-y-1.5">
                            {m.lessons
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((l) => {
                                const Icon = LESSON_ICON[l.type] ?? FileText;
                                const isOpen = openLessonId === l.id;
                                return (
                                  <li key={l.id}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenLessonId(isOpen ? null : l.id)
                                      }
                                      aria-expanded={isOpen}
                                      className={`flex w-full flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                                        isOpen
                                          ? "bg-blue-50 ring-1 ring-blue-200"
                                          : "bg-gray-50/70 hover:bg-gray-100"
                                      }`}
                                    >
                                      <Icon className="size-3.5 shrink-0 text-gray-400" />
                                      <span className="min-w-0 flex-1 truncate text-gray-700">
                                        {l.title}
                                      </span>
                                      {l.is_preview && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                                          <Eye className="size-3" />
                                          Preview
                                        </span>
                                      )}
                                      {l.duration_seconds != null && (
                                        <span className="text-xs tabular-nums text-gray-400">
                                          {duration(l.duration_seconds)}
                                        </span>
                                      )}
                                      <span className="text-[11px] font-semibold text-blue-600">
                                        {isOpen ? "Hide" : "View"}
                                      </span>
                                    </button>

                                    {isOpen && (
                                      <LessonPreview
                                        courseId={course.id}
                                        lessonId={l.id}
                                        onClose={() => setOpenLessonId(null)}
                                      />
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {course && (
        <RejectCourseDialog
          open={rejecting}
          courseTitle={course.title}
          submitting={acting === "reject"}
          onCancel={() => setRejecting(false)}
          onConfirm={(reason) => void reject(reason)}
        />
      )}
    </>
  );
}
