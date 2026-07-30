"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import STUDENT from "@/services/student.service";
import type { CourseListItem } from "@/types/api.types";
import CourseCard from "@/components/dashboard/courses/CourseCard";

function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
      <div className="aspect-video w-full rounded-lg bg-gray-100" />
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
    </div>
  );
}

export default function RecommendedCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    STUDENT.getRecommendedCourses()
      .then(data => setCourses(data.items))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    STUDENT.getProfile()
      .then(profile => setInterests(profile.interests))
      .catch(() => null);
  }, []);

  const subtitle = interests.length > 0
    ? `Based on your interest in ${interests.slice(0, 2).join(" and ")}`
    : "Based on your interests and study history";

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
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