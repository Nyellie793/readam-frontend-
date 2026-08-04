"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Flame } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV } from "@/constants/student-nav";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import STUDENT from "@/services/student.service";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Real backend LessonType values — a course "matches" a checked type if it
// has at least one lesson of that type (see course_service.list_published_courses).
const CONTENT_TYPES = [
  { id: "video", labelKey: "videoLessons" },
  { id: "pdf", labelKey: "pdfGuides" },
  { id: "quiz", labelKey: "practiceTests" },
];

interface CourseFiltersProps {
  onNavigate?: () => void;
  showLogo?: boolean;
}

export default function CourseFilters({
  onNavigate,
  showLogo = true,
}: CourseFiltersProps) {
  const t = useTranslations("dash");
  const CATEGORIES = [{ value: "", label: t("allCategories") }, ...COURSE_CATEGORIES];
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = STUDENT_NAV.slice(0, 3);

  const category = searchParams.get("category") ?? "";
  const checkedTypes = searchParams.getAll("content_type");
  const officialOnly = searchParams.get("official_only") === "true";

  const [streakDays, setStreakDays] = useState<number | null>(null);

  useEffect(() => {
    STUDENT.getGamification()
      .then((data) => setStreakDays(data.current_streak_days))
      .catch(() => null);
  }, []);

  function toggleType(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("content_type");
    params.delete("content_type");
    const next = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
    for (const t of next) params.append("content_type", t);
    router.push(`/dashboard/courses?${params.toString()}`);
  }

  function handleCategoryChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    router.push(`/dashboard/courses?${params.toString()}`);
  }

  function toggleOfficialOnly() {
    const params = new URLSearchParams(searchParams.toString());
    if (officialOnly) params.delete("official_only");
    else params.set("official_only", "true");
    router.push(`/dashboard/courses?${params.toString()}`);
  }

  return (
    <div className="flex  min-h-screen flex-col bg-white">
      {showLogo && (
        <div className="border-b border-gray-100 px-6 py-6">
          <Logo />
        </div>
      )}

      <nav className="space-y-1 px-3 pt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <p className="text-sm font-bold text-gray-900">{t("contentType")}</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {CONTENT_TYPES.map((type) => (
            <label
              key={type.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={checkedTypes.includes(type.id)}
                onChange={() => toggleType(type.id)}
                className="size-4 rounded border-gray-300 accent-blue-600"
              />
              {t(type.labelKey)}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={officialOnly}
            onChange={toggleOfficialOnly}
            className="size-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="font-bold text-gray-900">{t("officialOnly")}</span>
        </label>
      </div>

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <p className="text-sm font-bold text-gray-900">{t("category")}</p>
        <div className="relative mt-3">
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mt-auto p-6 pt-10">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{t("studyStreak")}</p>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Flame className="size-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-gray-900">
              {streakDays === null ? "…" : `${streakDays} Day Streak`}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${Math.min(100, ((streakDays ?? 0) / 7) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
