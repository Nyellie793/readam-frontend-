"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Paperclip,
  Mic,
  Send,
  Sparkles,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import AI from "@/services/ai.service";
import STUDENT from "@/services/student.service";
import { ApiRequestError, errorMessage } from "@/lib/api";
import QuizModal from "./QuizModal";
import SessionSummaryPanel from "./SessionSummaryPanel";
import type {
  AIMessageResponse,
  AISessionResponse,
  SessionSummaryResponse,
  QuizResponse,
} from "@/types/api.types";
import type { User } from "@/types/user.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) return `${Math.max(1, Math.round(diffMs / 60_000))}m ago`;
  if (diffHours < 24) return `${Math.round(diffHours)}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatContent(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, user }: { msg: AIMessageResponse; user: User | null }) {
  const isTutor = msg.role === "assistant";
  const initials = (user?.full_name ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("flex gap-3", isTutor ? "items-start" : "flex-row-reverse items-start")}>
      {isTutor ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow">
          <Sparkles className="size-4 text-white" />
        </div>
      ) : (
        <Avatar className="size-9 shrink-0 shadow">
          <AvatarImage src={user?.avatar_url ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[72%] space-y-1", !isTutor && "flex flex-col items-end")}>
        {msg.attachments.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5">
            {msg.attachments.map((att) =>
              att.content_type.startsWith("image/") ? (
                <a key={att.id} href={att.file_url} target="_blank" rel="noreferrer">
                  <img
                    src={att.file_url}
                    alt={att.filename}
                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                  />
                </a>
              ) : (
                <a
                  key={att.id}
                  href={att.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <FileText className="size-3.5" />
                  {att.filename}
                </a>
              )
            )}
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isTutor ? "rounded-tl-none bg-white text-gray-800 shadow-sm" : "rounded-tr-none bg-blue-600 text-white"
          )}
        >
          {msg.content.split("\n\n").map((block, bi) => (
            <p key={bi} className={bi > 0 ? "mt-2" : ""}>
              {block.split("\n").map((line, li) => (
                <span key={li} className="block">
                  {formatContent(line)}
                </span>
              ))}
            </p>
          ))}
        </div>

        <p className="text-[11px] text-gray-400">
          {isTutor ? "AI Tutor" : "You"} &middot; {timeAgo(msg.created_at)}
        </p>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow">
        <Sparkles className="size-4 text-white" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-gray-300"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AiChatSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initRan = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);

  const [session, setSession] = useState<AISessionResponse | null>(null);
  const [messages, setMessages] = useState<AIMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<{ status: number; detail: string } | null>(null);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<{
    id: string;
    filename: string;
  } | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [summary, setSummary] = useState<SessionSummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [generatingRevision, setGeneratingRevision] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [generatingStudyPlan, setGeneratingStudyPlan] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<QuizResponse | null>(null);
  const [cachedQuizzesById, setCachedQuizzesById] = useState<Record<string, QuizResponse>>({});

  useEffect(() => {
    setUser(getStoredUser());
    STUDENT.getGamification().then((g) => setStreakDays(g.current_streak_days)).catch(() => null);
    STUDENT.getNotifications().then((d) => setHasUnread(d.unread_count > 0)).catch(() => null);
  }, []);

  const refreshSummary = useCallback(async (sessionId: string) => {
    setSummaryLoading(true);
    try {
      setSummary(await AI.getSessionSummary(sessionId));
    } catch {
      /* summary is a nice-to-have; ignore failures */
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const existingSessionId = searchParams.get("session");
    const lessonId = searchParams.get("lessonId");
    const intent = searchParams.get("intent");
    const topic = searchParams.get("topic");

    (async () => {
      try {
        if (existingSessionId) {
          const detail = await AI.getSession(existingSessionId);
          setSession(detail);
          setMessages(detail.messages);
          await refreshSummary(detail.id);
          return;
        }

        const started = await AI.startSession(lessonId ?? undefined);
        setSession(started);
        router.replace(`/dashboard/ai-tutor/ai-chat?session=${started.id}`);
        await refreshSummary(started.id);

        if (intent === "revision") {
          setGeneratingRevision(true);
          try {
            await AI.generateRevision(started.id);
            toast.success("Revision summary generated.");
            await refreshSummary(started.id);
          } catch (err) {
            toast.error(errorMessage(err, "Couldn't generate a revision summary."));
          } finally {
            setGeneratingRevision(false);
          }
        } else if (intent === "quiz") {
          setGeneratingQuiz(true);
          try {
            const quiz = await AI.generateQuiz(started.id, 5);
            setCachedQuizzesById((prev) => ({ ...prev, [quiz.quiz_id]: quiz }));
            setActiveQuiz(quiz);
            await refreshSummary(started.id);
          } catch (err) {
            toast.error(errorMessage(err, "Couldn't generate a quiz."));
          } finally {
            setGeneratingQuiz(false);
          }
        } else if (intent === "study-plan") {
          setGeneratingStudyPlan(true);
          try {
            await AI.generateStudyPlan(started.id);
            toast.success("Study plan generated.");
            await refreshSummary(started.id);
          } catch (err) {
            toast.error(errorMessage(err, "Couldn't generate a study plan."));
          } finally {
            setGeneratingStudyPlan(false);
          }
        } else if (topic) {
          setSending(true);
          try {
            const resp = await AI.sendMessage(started.id, topic);
            setMessages([resp.user_message, resp.assistant_message]);
          } catch (err) {
            toast.error(errorMessage(err, "Couldn't send your message."));
          } finally {
            setSending(false);
          }
        }
      } catch (err) {
        setInitError({
          status: err instanceof ApiRequestError ? err.status : 500,
          detail: errorMessage(err, "Something went wrong starting your session."),
        });
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })();
  }, []);

  useEffect(() => {
    if (!session) return;
    function tick() {
      if (!session) return;
      const secs = Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000);
      setRemainingSeconds(Math.max(0, secs));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const isActive = !!session && session.status === "active" && remainingSeconds > 0;

  async function handleSend() {
    const text = input.trim();
    if (!text || !session || sending) return;
    if (!isActive) {
      toast.error("This session has expired. Start a new one from the AI Hub.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimistic: AIMessageResponse = {
      id: tempId,
      role: "user",
      content: text,
      model_used: null,
      input_tokens: null,
      output_tokens: null,
      attachments: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    const attachmentIds = pendingAttachment ? [pendingAttachment.id] : [];
    setPendingAttachment(null);
    setSending(true);

    try {
      const resp = await AI.sendMessage(session.id, text, attachmentIds);
      setMessages((prev) => prev.filter((m) => m.id !== tempId).concat([resp.user_message, resp.assistant_message]));
      setSession((prev) => (prev ? { ...prev, message_count: prev.message_count + 1 } : prev));
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(text);
      if (err instanceof ApiRequestError && err.status === 409) {
        setRemainingSeconds(0);
      }
      toast.error(errorMessage(err, "Message failed to send."));
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await AI.uploadFile(file);
      setPendingAttachment({ id: uploaded.attachment_id, filename: file.name });
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't upload that file."));
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerateRevisionClick() {
    if (!session) return;
    setGeneratingRevision(true);
    try {
      await AI.generateRevision(session.id);
      toast.success("Revision summary generated.");
      await refreshSummary(session.id);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't generate a revision summary."));
    } finally {
      setGeneratingRevision(false);
    }
  }

  async function handleGenerateQuizClick() {
    if (!session) return;
    setGeneratingQuiz(true);
    try {
      const quiz = await AI.generateQuiz(session.id, 5);
      setCachedQuizzesById((prev) => ({ ...prev, [quiz.quiz_id]: quiz }));
      setActiveQuiz(quiz);
      await refreshSummary(session.id);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't generate a quiz."));
    } finally {
      setGeneratingQuiz(false);
    }
  }

  async function handleGenerateStudyPlanClick() {
    if (!session) return;
    setGeneratingStudyPlan(true);
    try {
      await AI.generateStudyPlan(session.id);
      toast.success("Study plan generated.");
      await refreshSummary(session.id);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't generate a study plan."));
    } finally {
      setGeneratingStudyPlan(false);
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-blue-600" />
      </div>
    );
  }

  // ── Error / blocked states ───────────────────────────────────────────────────
  if (initError) {
    const noCredits = initError.status === 402;
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-lg font-bold text-gray-900">
          {noCredits ? "No AI sessions remaining" : "Couldn't start this session"}
        </p>
        <p className="max-w-sm text-sm text-gray-500">
          {noCredits
            ? "You've used up your AI tutor credits. Buy more to keep chatting, generating quizzes, and more."
            : initError.detail}
        </p>
        {noCredits ? (
          <Link
            href="/payment/ai-sessions"
            className="mt-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Buy More Credits
          </Link>
        ) : (
          <Link
            href="/dashboard/ai-tutor/ai-hub"
            className="mt-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to AI Hub
          </Link>
        )}
      </div>
    );
  }

  const lessonLabel = summary?.lesson_title
    ? `Topic: ${summary.lesson_title}`
    : session?.session_type === "lesson"
      ? "Topic: this lesson"
      : "General session";

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col overflow-hidden">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ai-tutor/ai-hub"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Back to AI Hub"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-sm font-bold text-gray-900">AI Active Session</h1>
            <div className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", isActive ? "bg-green-500" : "bg-gray-300")} />
              <p className="text-xs text-gray-500">{lessonLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {hasUnread && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500" />}
          </Link>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 gap-6 bg-blue-50 px-4 py-4 sm:px-6">
        {/* Chat column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-5 pb-4">
              {messages.length === 0 && !sending && (
                <p className="pt-10 text-center text-sm text-gray-400">
                  Ask a question to get started.
                </p>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} user={user} />
              ))}
              {sending && <TypingBubble />}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="mt-3 shrink-0">
            {!isActive && (
              <p className="mb-2 text-center text-xs font-semibold text-orange-500">
                This session has expired.{" "}
                <Link href="/dashboard/ai-tutor/ai-hub" className="underline">
                  Start a new one
                </Link>
              </p>
            )}

            {pendingAttachment && (
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <FileText className="size-3.5 shrink-0" />
                <span className="flex-1 truncate">{pendingAttachment.filename}</span>
                <button onClick={() => setPendingAttachment(null)} aria-label="Remove attachment">
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                aria-label="Attach file"
                disabled={!isActive || uploading}
                onClick={() => fileInputRef.current?.click()}
                className="mb-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Paperclip className="size-4" />}
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question or explain your reasoning..."
                rows={1}
                disabled={!isActive}
                className="flex-1 resize-none bg-transparent py-1.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                style={{ maxHeight: "120px" }}
              />

              <button
                type="button"
                aria-label="Voice input"
                disabled
                title="Voice input isn't available yet."
                className="mb-1 shrink-0 rounded-lg p-1.5 text-gray-300"
              >
                <Mic className="size-4" />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || sending || !isActive}
                aria-label="Send"
                className={cn(
                  "mb-1 shrink-0 rounded-lg p-2 transition-colors",
                  input.trim() && isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-100 text-gray-300"
                )}
              >
                <Send className="size-4" />
              </button>
            </div>

            <p className="mt-1.5 text-center text-[11px] text-gray-400">
              ReadAm AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>

        {/* Right panel */}
        {session && (
          <SessionSummaryPanel
            sessionType={session.session_type}
            isActive={isActive}
            remainingSeconds={remainingSeconds}
            summary={summary}
            summaryLoading={summaryLoading}
            generatingRevision={generatingRevision}
            generatingQuiz={generatingQuiz}
            generatingStudyPlan={generatingStudyPlan}
            onGenerateRevision={handleGenerateRevisionClick}
            onGenerateQuiz={handleGenerateQuizClick}
            onGenerateStudyPlan={handleGenerateStudyPlanClick}
            onOpenQuiz={setActiveQuiz}
            cachedQuizzesById={cachedQuizzesById}
          />
        )}
      </div>

      {/* ── Mobile bottom CTA ──────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={user?.avatar_url ?? ""} />
            <AvatarFallback>{(user?.full_name ?? "S")[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.full_name ?? "Student"}
            </p>
            <p className="text-xs text-orange-500">{streakDays} Day Streak 🔥</p>
          </div>
          <Link
            href="/payment/ai-sessions"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
          >
            Get More Credits
          </Link>
        </div>
      </div>

      <QuizModal
        quiz={activeQuiz}
        onOpenChange={(open) => !open && setActiveQuiz(null)}
        onGraded={() => session && refreshSummary(session.id)}
      />
    </div>
  );
}
