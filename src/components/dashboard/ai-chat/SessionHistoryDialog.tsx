"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History, Loader2, MessageSquare, Play, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import AI from "@/services/ai.service";
import type { AISessionListItem } from "@/types/api.types";

/**
 * Past AI sessions, with a way back into the ones still running.
 *
 * Sessions were only reachable by whatever id happened to be in localStorage,
 * so a student who closed the tab, or opened the AI from a different device,
 * had no way to find a session they had already paid for. Anything still
 * active or paused can be resumed from here.
 */
/** Only these four exist server-side; anything else falls through to the raw value. */
const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  expired: "Expired",
  ended: "Ended",
};

export default function SessionHistoryDialog({
  open,
  onOpenChange,
  currentSessionId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSessionId?: string;
}) {
  const t = useTranslations("dash");
  const router = useRouter();
  const [items, setItems] = useState<AISessionListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await AI.listSessions());
    } catch {
      setError(t("historyFailed"));
    }
  }, [t]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  function resume(id: string) {
    onOpenChange(false);
    router.push(`/dashboard/ai-tutor/ai-chat?session=${id}`);
  }

  const totalMessages = (items ?? []).reduce((n, s) => n + s.message_count, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4 text-blue-600" />
            {t("historyTitle")}
          </DialogTitle>
        </DialogHeader>

        {items === null && !error && (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-gray-400" />
          </div>
        )}

        {error && <p className="py-6 text-center text-sm text-red-500">{error}</p>}

        {items && items.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">{t("historyEmpty")}</p>
        )}

        {items && items.length > 0 && (
          <>
            {/* A running total is the closest thing to "progress" that is
                actually true — sessions have no completion state. */}
            <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-xs text-gray-600">
              <span>
                <strong className="text-gray-900">{items.length}</strong> {t("historySessions")}
              </span>
              <span>
                <strong className="text-gray-900">{totalMessages}</strong> {t("historyMessages")}
              </span>
            </div>

            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
              {items.map((s) => {
                const resumable = s.status === "active" || s.status === "paused";
                const isCurrent = s.id === currentSessionId;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                      isCurrent ? "border-blue-200 bg-blue-50/50" : "border-gray-100"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {s.session_type === "lesson" ? t("historyLesson") : t("historyGeneral")}
                        {isCurrent && (
                          <span className="ml-2 text-[11px] font-semibold text-blue-600">
                            {t("historyCurrent")}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {s.message_count}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(s.started_at).toLocaleDateString()}
                        </span>
                        <span
                          className={cn(
                            "font-semibold",
                            s.status === "active" && "text-teal-600",
                            s.status === "paused" && "text-orange-500"
                          )}
                        >
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                      </p>
                    </div>

                    {resumable && !isCurrent && (
                      <button
                        type="button"
                        onClick={() => resume(s.id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Play className="size-3" />
                        {t("resume")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
