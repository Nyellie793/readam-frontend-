"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import STUDENT from "@/services/student.service";
import type { CourseListItem } from "@/types/api.types";

interface SubjectPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxCount: number;
  onConfirm: (courseIds: string[]) => void;
}

export default function SubjectPicker({ open, onOpenChange, maxCount, onConfirm }: SubjectPickerProps) {
  const [subjects, setSubjects] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setSelected([]);
    setLoading(true);
    STUDENT.getPastQuestionsCourses()
      .then((data) => setSubjects(data.items))
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= maxCount) return prev;
      return [...prev, id];
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Choose {maxCount} subject{maxCount > 1 ? "s" : ""} ({selected.length}/{maxCount})
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 space-y-1.5 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}
          {!loading && subjects.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              No Past Questions subjects are available yet.
            </p>
          )}
          {!loading &&
            subjects.map((subject) => {
              const isSelected = selected.includes(subject.id);
              const disabled = !isSelected && selected.length >= maxCount;
              return (
                <button
                  key={subject.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(subject.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    isSelected
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-100 text-gray-800 hover:border-blue-200 hover:bg-blue-50/50",
                    disabled && "cursor-not-allowed opacity-40"
                  )}
                >
                  <span className="truncate">{subject.title.replace(" — Past Questions", "")}</span>
                  {isSelected && <Check className="size-4 shrink-0 text-blue-600" />}
                </button>
              );
            })}
        </div>

        <Button
          onClick={() => onConfirm(selected)}
          disabled={selected.length !== maxCount}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          Continue to Checkout
        </Button>
      </DialogContent>
    </Dialog>
  );
}
