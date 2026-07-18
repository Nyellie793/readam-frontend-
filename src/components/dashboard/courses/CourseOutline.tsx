"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Lock, PlayCircle, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CourseModule } from "@/types/course.types";
import { cn } from "@/lib/utils";

interface CourseOutlineProps {
  modules: CourseModule[];
  progress: number;
}

export default function CourseOutline({ modules, progress }: CourseOutlineProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map((m, i) => [m.id, i < 2]))
  );

  return (
    <aside className="flex w-full max-w-sm shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Course Content</h2>
        <span className="text-sm font-semibold text-blue-600">{progress}% Complete</span>
      </div>
      <Progress value={progress} className="mt-3" />

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
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                        lesson.status === "active"
                          ? "bg-blue-600 font-semibold text-white"
                          : "text-gray-700"
                      )}
                    >
                      {lesson.status === "done" && (
                        <CheckCircle2 className="size-[18px] shrink-0 text-emerald-500" />
                      )}
                      {lesson.status === "active" && (
                        <PlayCircle className="size-[18px] shrink-0 fill-white/20" />
                      )}
                      {lesson.status === "locked" && (
                        <Lock className="size-[18px] shrink-0 text-gray-400" />
                      )}
                      <span className="flex-1 truncate">{lesson.title}</span>
                      <span className={cn("text-xs", lesson.status === "active" ? "text-white/80" : "text-gray-400")}>
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-100 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
      >
        <Sparkles className="size-4" />
        Ask ReadAm AI
      </button>
    </aside>
  );
}
