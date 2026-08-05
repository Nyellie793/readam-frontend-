"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * Common reasons, offered as one-click starting points.
 *
 * Rejecting used to be a bare confirm() with no explanation attached, so the
 * tutor saw a rejected course and had to guess. Presets exist because a busy
 * admin will otherwise write nothing, and an empty reason is the failure mode
 * this whole screen is meant to prevent.
 */
const PRESETS = [
  "Video or audio quality is too low to follow.",
  "The content does not match the course title or description.",
  "Some lessons are empty or incomplete.",
  "The material appears to be copied from another source.",
  "The course is too short for the price set.",
];

interface RejectCourseDialogProps {
  open: boolean;
  courseTitle: string;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export default function RejectCourseDialog({
  open,
  courseTitle,
  submitting,
  onCancel,
  onConfirm,
}: RejectCourseDialogProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();

  function addPreset(preset: string) {
    setReason((current) => (current.trim() ? `${current.trim()}\n${preset}` : preset));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reject this course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{courseTitle}</span> goes back to
            the tutor for revision. They will be emailed the reason below, so be specific
            enough that they know what to fix.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="reject-reason" className="text-xs font-semibold text-gray-700">
              Reason
            </label>
            <textarea
              id="reject-reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain what needs to change before this can be published."
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Common reasons
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => addPreset(p)}
                  className="rounded-lg border border-gray-200 px-2.5 py-1 text-left text-[11px] text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(trimmed)}
            disabled={submitting || trimmed.length === 0}
            title={trimmed.length === 0 ? "Add a reason first" : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            Reject and notify tutor
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
