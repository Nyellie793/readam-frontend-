"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, FileText, Loader2, Bookmark } from "lucide-react";
import { toast } from "sonner";
import type { CourseListItem } from "@/types/api.types";
import STUDENT from "@/services/student.service";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function CourseCard({ course }: { course: CourseListItem }) {
  const isVideo = !course.tags.includes("pdf");
  const isFree = course.price === 0 && !course.is_premium;
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [saved, setSaved] = useState(course.is_saved);
  const [savingBusy, setSavingBusy] = useState(false);

  async function handleEnroll(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (enrolling || enrolled) return;
    setEnrolling(true);
    try {
      await STUDENT.enroll(course.id);
      setEnrolled(true);
      toast.success(`Enrolled in ${course.title}`);
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.detail : "Couldn't enroll. Try again.");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (savingBusy) return;
    setSavingBusy(true);
    const next = !saved;
    try {
      await (next ? STUDENT.saveCourse(course.id) : STUDENT.unsaveCourse(course.id));
      setSaved(next);
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.detail : "Couldn't update saved courses.");
    } finally {
      setSavingBusy(false);
    }
  }

  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-blue-50">
            {isVideo ? <Play className="size-10 text-blue-300" /> : <FileText className="size-10 text-blue-300" />}
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {course.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-900/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-600/95 text-white shadow-lg ring-4 ring-white/25 transition-transform group-hover:scale-105">
              <Play className="size-5 translate-x-0.5 fill-current" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900">
            {course.title}
          </h3>
          <button
            type="button"
            aria-label={saved ? "Remove from saved courses" : "Save course"}
            onClick={handleToggleSave}
            disabled={savingBusy}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-700"
          >
            <Bookmark className={cn("size-[18px]", saved && "fill-blue-600 text-blue-600")} />
          </button>
        </div>

        {course.tutor_name && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
              {course.tutor_name
                .split(" ")
                .map((n) => n[0])
                .slice(-2)
                .join("")}
            </span>
            {course.tutor_name}
          </div>
        )}

        {course.avg_rating != null && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900">{course.avg_rating.toFixed(1)}</span>
            <span className="text-gray-400">({course.review_count} reviews)</span>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold text-gray-900">
            {course.price === 0 ? "Free" : `${course.price.toLocaleString()} XAF`}
          </span>

          {isFree ? (
            <button
              type="button"
              onClick={handleEnroll}
              disabled={enrolling || enrolled}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                enrolled ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {enrolling && <Loader2 className="size-3.5 animate-spin" />}
              {enrolled ? "Enrolled" : enrolling ? "Enrolling…" : "Enroll Now"}
            </button>
          ) : (
            <span
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold",
                course.is_premium ? "bg-gray-100 text-gray-900" : "bg-blue-600 text-white"
              )}
            >
              {course.is_premium ? "Premium" : "View Course"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
