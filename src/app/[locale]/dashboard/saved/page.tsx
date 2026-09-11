"use client";

import SavedCoursesList from "@/components/dashboard/saved/SavedCoursesList";
import { useTranslations } from "next-intl";

export default function SavedCoursesPage() {
  const t = useTranslations("dash");

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
        <h1 className="text-2xl font-bold text-gray-900">{t("savedTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("savedSubtitle")}</p>

        <div className="mt-6">
          <SavedCoursesList />
        </div>
      </main>
    </div>
  );
}
