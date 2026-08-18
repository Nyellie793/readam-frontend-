"use client";

import {
  Lightbulb,
  CheckCircle2,
  BarChart3,
  ChevronRight,
  Clock,
  Loader2,
  BookOpen,
  CalendarCheck,
  Pause,
  Play,
  History,
} from "lucide-react";
import type { SessionSummaryResponse, QuizResponse } from "@/types/api.types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/duration";

interface SessionSummaryPanelProps {
  sessionType: "lesson" | "general";
  isActive: boolean;
  remainingSeconds: number;
  /** True while the clock is stopped. The countdown freezes, it does not run down. */
  isPaused: boolean;
  pauseBusy: boolean;
  onTogglePause: () => void;
  onOpenHistory: () => void;
  summary: SessionSummaryResponse | null;
  summaryLoading: boolean;
  generatingRevision: boolean;
  generatingQuiz: boolean;
  generatingStudyPlan: boolean;
  onGenerateRevision: () => void;
  onGenerateQuiz: () => void;
  onGenerateStudyPlan: () => void;
  onOpenQuiz: (quiz: QuizResponse) => void;
  cachedQuizzesById: Record<string, QuizResponse>;
}

export default function SessionSummaryPanel({
  sessionType,
  isActive,
  remainingSeconds,
  isPaused,
  pauseBusy,
  onTogglePause,
  onOpenHistory,
  summary,
  summaryLoading,
  generatingRevision,
  generatingQuiz,
  generatingStudyPlan,
  onGenerateRevision,
  onGenerateQuiz,
  onGenerateStudyPlan,
  onOpenQuiz,
  cachedQuizzesById,
}: SessionSummaryPanelProps) {
  const t = useTranslations("dash");
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 overflow-y-auto lg:block">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">{t("sessionSummary")}</h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            isActive
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-gray-200 bg-gray-50 text-gray-500"
          }`}
        >
          {isActive ? "Live" : "Expired"}
        </span>
      </div>

      {summaryLoading && (
        <div className="flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {summary && (
        <>
          {summary.revisions.length > 0 && (
            <div className="space-y-2">
              {summary.revisions.map((r) => (
                <details key={r.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Lightbulb className="size-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{t("revisionSummary")}</p>
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
                    {r.content}
                  </p>
                </details>
              ))}
            </div>
          )}

          {summary.quizzes.length > 0 && (
            <div className="space-y-2">
              {summary.quizzes.map((q) => {
                const cached = cachedQuizzesById[q.quiz_id];
                return (
                  <button
                    key={q.quiz_id}
                    type="button"
                    disabled={!cached}
                    onClick={() => cached && onOpenQuiz(cached)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm disabled:cursor-default"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <CheckCircle2 className="size-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Quiz &middot; {q.num_questions} questions
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {q.taken ? `Best: ${q.best_score}/${q.best_total}` : t("notAttempted")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {summary.study_plans.length > 0 && (
            <div className="space-y-2">
              {summary.study_plans.map((p) => (
                <div key={p.id} className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-700">{t("studyPlanReady")}</p>
                  </div>
                  <p className="mt-1.5 text-xs text-purple-600">
                    Generated {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Next Actions
            </p>
            <div className="space-y-2">
              {sessionType === "lesson" && (
                <button
                  type="button"
                  onClick={onGenerateRevision}
                  disabled={!isActive || generatingRevision}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center gap-2 truncate">
                    <BookOpen className="size-4 shrink-0" />
                    Generate Revision
                  </span>
                  {generatingRevision ? (
                    <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                  ) : (
                    <ChevronRight className="ml-2 size-4 shrink-0 text-gray-400" />
                  )}
                </button>
              )}
              {sessionType === "lesson" && (
                <button
                  type="button"
                  onClick={onGenerateQuiz}
                  disabled={!isActive || generatingQuiz}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="size-4 shrink-0" />
                    Generate Quiz
                  </span>
                  {generatingQuiz ? (
                    <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                  ) : (
                    <ChevronRight className="ml-2 size-4 shrink-0 text-gray-400" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={onGenerateStudyPlan}
                disabled={!isActive || generatingStudyPlan}
                className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center gap-2 truncate">
                  <CalendarCheck className="size-4 shrink-0" />
                  Generate Study Plan
                </span>
                {generatingStudyPlan ? (
                  <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                ) : (
                  <ChevronRight className="ml-2 size-4 shrink-0 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">XP Earned</p>
            <p className="mt-1 text-xl font-extrabold text-gray-900">+{summary.xp_earned}</p>
          </div>
        </>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {isPaused ? "Paused" : isActive ? "Time Remaining" : "Session Ended"}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Clock className={cn("size-4", isPaused ? "text-orange-500" : "text-blue-500")} />
          <p
            className={cn(
              "text-2xl font-extrabold tabular-nums",
              isPaused ? "text-orange-600" : "text-gray-900"
            )}
          >
            {isActive || isPaused ? formatDuration(remainingSeconds) : "00:00"}
          </p>
        </div>

        {/* A credit buys a fixed window, so stepping away used to burn minutes
            the student paid for. Pausing banks whatever is left. */}
        {(isActive || isPaused) && (
          <button
            type="button"
            onClick={onTogglePause}
            disabled={pauseBusy}
            className={cn(
              "mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
              isPaused
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            {pauseBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isPaused ? (
              <Play className="size-4" />
            ) : (
              <Pause className="size-4" />
            )}
            {isPaused ? "Resume session" : "Pause session"}
          </button>
        )}

        {/* Sessions were only reachable via whatever id was in localStorage,
            so one already paid for could be lost by closing the tab. */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <History className="size-3.5" />
          {t("historyTitle")}
        </button>

        {isPaused && (
          <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
            Your remaining time is held. Nothing is lost while paused.
          </p>
        )}
      </div>
    </aside>
  );
}
