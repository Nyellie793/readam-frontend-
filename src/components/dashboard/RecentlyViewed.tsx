"use client";

import useSWR from "swr";
import RecentlyViewedItem from "./RecentlyViewedItem";
import ReadAmTutorBannerDashboard from "./ReadAmTutorBannerDashboard";
import STUDENT from "@/services/student.service";

function formatRemaining(seconds: number): string {
  if (seconds <= 0) return "0 mins left";
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)} hrs left`;
  return `${Math.round(seconds / 60)} mins left`;
}

export default function RecentlyViewed() {
  const { data, isLoading: loading } = useSWR("recently-viewed", () => STUDENT.getRecentlyViewed());
  const items = data?.items ?? [];

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">

      <div>

        <h2 className="text-lg font-bold">
          Recently Viewed
        </h2>

        <div className="mt-4 flex flex-col gap-3">

          {!loading && items.length === 0 && (
            <p className="text-sm text-gray-400">
              Start a lesson and it&apos;ll show up here.
            </p>
          )}

          {items.map((item) => {
            const remaining = item.total_lessons - item.completed_lessons;
            const progress = item.total_lessons > 0
              ? Math.round((item.completed_lessons / item.total_lessons) * 100)
              : 0;
            return (
              <RecentlyViewedItem
                key={item.course_id}
                courseId={item.course_id}
                image={item.course_thumbnail}
                title={item.course_title}
                meta={`${remaining} lesson${remaining === 1 ? "" : "s"} remaining • ${formatRemaining(item.remaining_seconds)}`}
                progress={progress}
              />
            );
          })}

        </div>

      </div>

      <ReadAmTutorBannerDashboard variant="compact" />

    </section>
  );
}
