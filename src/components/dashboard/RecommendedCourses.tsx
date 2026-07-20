"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, FileText } from "lucide-react";
import STUDENT from "@/services/student.service";
import type { CourseListItem } from "@/types/api.types";

function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
      <div className="aspect-video w-full rounded-lg bg-gray-100" />
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
    </div>
  );
}

function CourseCard({ course }: { course: CourseListItem }) {
  const isVideo = course.tags.includes("video") || !course.tags.includes("pdf");
  return (
    <Link
      href={`/dashboard/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {course.thumbnail_url ? (
          <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width:768px)100vw,33vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-blue-50">
            {isVideo ? <Play className="size-10 text-blue-300" /> : <FileText className="size-10 text-blue-300" />}
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          {course.tags.slice(0, 2).map(t => (
            <span key={t} className="rounded-md bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{course.title}</h3>
        {course.tutor_name && (
          <p className="text-xs text-gray-500">{course.tutor_name}</p>
        )}
        {course.avg_rating != null && (
          <div className="flex items-center gap-1 text-xs">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{course.avg_rating.toFixed(1)}</span>
            <span className="text-gray-400">({course.review_count})</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold">{course.price === 0 ? "Free" : `${course.price.toLocaleString()} XAF`}</span>
          <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
            {course.is_premium ? "Premium" : "View"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function RecommendedCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    STUDENT.getRecommendedCourses()
      .then(data => setCourses(data.items))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
          <p className="text-sm text-gray-500">Based on your interests and study history</p>
        </div>
        <Link href="/dashboard/courses" className="text-sm font-semibold text-blue-600 hover:underline">
          Explore More
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)
          : courses.slice(0, 3).map(c => <CourseCard key={c.id} course={c} />)
        }
      </div>
    </section>
  );
}