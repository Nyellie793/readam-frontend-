"use client"

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Play, Star } from "lucide-react";
import type { Course } from "@/types/course.types";
import { cn } from "@/lib/utils";

const TAG_TONE: Record<NonNullable<Course["tags"][number]["tone"]>, string> = {
  default: "bg-blue-600 text-white",
  dark: "bg-gray-900/85 text-white backdrop-blur-sm",
  success: "bg-emerald-600 text-white",
  premium: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",
};

export default function CourseCard({ course }: { course: Course }) {
  const isVideo = course.format === "Video" || course.format === "Interactive";

  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {course.tags.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                TAG_TONE[tag.tone ?? "dark"]
              )}
            >
              {tag.label}
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
            aria-label="Save course"
            onClick={(e) => e.preventDefault()}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-700"
          >
            <Bookmark className="size-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
            {course.instructor
              .split(" ")
              .map((n) => n[0])
              .slice(-2)
              .join("")}
          </span>
          {course.instructor}
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-900">{course.rating.toFixed(1)}</span>
          <span className="text-gray-400">({course.reviews} reviews)</span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold text-gray-900">{course.price}</span>
          <span
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold",
              course.cta === "Upgrade to Premium"
                ? "bg-gray-100 text-gray-900"
                : "bg-blue-600 text-white"
            )}
          >
            {course.cta}
          </span>
        </div>
      </div>
    </Link>
  );
}