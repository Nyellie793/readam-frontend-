"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import STUDENT from "@/services/student.service";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * Bookmark toggle for a single course. Course cards had one already; the course
 * detail page did not, so once a student was reading a course there was no way
 * to add it to their saved list without going back to the grid.
 */
export default function SaveCourseButton({
  courseId,
  initialSaved,
  className,
}: {
  courseId: string;
  initialSaved: boolean;
  className?: string;
}) {
  const t = useTranslations("dash");
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !saved;
    // Optimistic — the bookmark flips immediately and rolls back on failure.
    setSaved(next);
    try {
      await (next ? STUDENT.saveCourse(courseId) : STUDENT.unsaveCourse(courseId));
    } catch (err) {
      setSaved(!next);
      toast.error(err instanceof ApiRequestError ? err.detail : t("savedFailed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? t("unsaveCourse") : t("saveCourse")}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60",
        className,
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-blue-600 text-blue-600")} />
      {saved ? t("saved") : t("saveCourse")}
    </button>
  );
}
