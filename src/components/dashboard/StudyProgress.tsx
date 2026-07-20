"use client";

import { useEffect, useState } from "react";
import STUDENT from "@/services/student.service";
import type { GamificationResponse } from "@/types/api.types";

export default function StudyProgress() {
  const [data, setData] = useState<GamificationResponse | null>(null);
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);

  useEffect(() => {
    STUDENT.getGamification().then(setData).catch(() => null);
    STUDENT.getEnrollments().then(d => setEnrollmentCount(d.total)).catch(() => null);
  }, []);

  const stats = [
    { label: "Enrolled Courses", value: enrollmentCount, suffix: "" },
    { label: "Study Streak", value: data?.current_streak_days ?? 0, suffix: " days" },
    { label: "Total XP", value: data?.total_xp ?? 0, suffix: " xp" },
    { label: "Longest Streak", value: data?.longest_streak_days ?? 0, suffix: " days" },
  ];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">Study Progress</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {s.value.toLocaleString()}{s.suffix}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}