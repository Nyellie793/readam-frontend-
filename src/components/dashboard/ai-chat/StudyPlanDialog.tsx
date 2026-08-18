"use client";

import { useState } from "react";
import { Loader2, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export interface StudyBrief {
  exam_date?: string;
  hours_per_week?: string;
  target_grade?: string;
  focus?: string;
}

/**
 * Asks what the plan needs to know before generating one.
 *
 * The stored profile only says what a student is broadly interested in, which
 * is not enough to schedule anything. A plan that does not know they sit the
 * exam in three weeks, or that they have four hours a week rather than twenty,
 * is one they abandon in the first week.
 *
 * Every field is optional. Someone who just wants a plan can skip straight
 * through and get a general one.
 */
export default function StudyPlanDialog({
  open,
  onOpenChange,
  onGenerate,
  busy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (brief: StudyBrief) => void;
  busy: boolean;
}) {
  const t = useTranslations("dash");
  const [brief, setBrief] = useState<StudyBrief>({});

  function set(key: keyof StudyBrief, value: string) {
    setBrief((b) => ({ ...b, [key]: value }));
  }

  const field =
    "h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="size-4 text-blue-600" />
            {t("planTitle")}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm leading-relaxed text-gray-500">{t("planIntro")}</p>

        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("planExam")}</label>
              <input
                className={field}
                placeholder={t("planExamPh")}
                value={brief.exam_date ?? ""}
                onChange={(e) => set("exam_date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("planHours")}</label>
              <input
                className={field}
                placeholder={t("planHoursPh")}
                value={brief.hours_per_week ?? ""}
                onChange={(e) => set("hours_per_week", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("planGrade")}</label>
            <input
              className={field}
              placeholder={t("planGradePh")}
              value={brief.target_grade ?? ""}
              onChange={(e) => set("target_grade", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("planFocus")}</label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={t("planFocusPh")}
              value={brief.focus ?? ""}
              onChange={(e) => set("focus", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => onGenerate({})}
            disabled={busy}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {t("planSkip")}
          </button>
          <button
            type="button"
            onClick={() => onGenerate(brief)}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {t("planGenerate")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
