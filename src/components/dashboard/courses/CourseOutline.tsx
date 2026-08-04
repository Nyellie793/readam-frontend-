"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Lock, PlayCircle, Sparkles } from "lucide-react";
import type { CourseModule, ModuleLesson } from "@/types/api.types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface CourseOutlineProps {
  modules: CourseModule[];
  selectedLessonId?: string;
  hasAccess: boolean;
  onSelectLesson: (lesson: ModuleLesson) => void;
}

export default function CourseOutline({
  modules,
  selectedLessonId,
  hasAccess,
  onSelectLesson,
}: CourseOutlineProps) {
  const t = useTranslations("dash");
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map((m, i) => [m.id, i < 2]))
  );

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <aside className="flex w-full max-w-sm shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">{t("courseContent")}</h2>
        <span className="text-sm font-semibold text-gray-500">{totalLessons} lessons</span>
      </div>

      <div className="mt-4 flex flex-1 flex-col divide-y divide-gray-100">
        {modules.map((module) => {
          const isOpen = openModules[module.id];
          return (
            <div key={module.id} className="py-3 first:pt-0">
              <button
                type="button"
                className="flex w-full items-center gap-2 text-left text-sm font-semibold text-gray-900"
                onClick={() => setOpenModules((s) => ({ ...s, [module.id]: !s[module.id] }))}
              >
                {isOpen ? (
                  <ChevronDown className="size-4 text-gray-400" />
                ) : (
                  <ChevronRight className="size-4 text-gray-400" />
                )}
                {module.title}
              </button>

              {isOpen && module.lessons.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  {module.lessons.map((lesson) => {
                    const locked = !lesson.is_preview && !hasAccess;
                    const isActive = lesson.id === selectedLessonId;
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        disabled={locked}
                        onClick={() => onSelectLesson(lesson)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
                          isActive
                            ? "bg-blue-600 font-semibold text-white"
                            : locked
                            ? "cursor-not-allowed text-gray-400"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {locked ? (
                          <Lock className="size-[18px] shrink-0 text-gray-400" />
                        ) : (
                          <PlayCircle
                            className={cn(
                              "size-[18px] shrink-0",
                              isActive ? "fill-white/20" : "text-gray-400"
                            )}
                          />
                        )}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <span className={cn("text-xs", isActive ? "text-white/80" : "text-gray-400")}>
                          {formatDuration(lesson.duration_seconds)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link
        href="/dashboard/ai-tutor"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-100 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
      >
        <Sparkles className="size-4" />
        Ask ReadAm AI
      </Link>
    </aside>
  );
}
