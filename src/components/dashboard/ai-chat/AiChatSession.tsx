"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Bell,
  Paperclip,
  Mic,
  Send,
  Lightbulb,
  CheckCircle2,
  BarChart3,
  ChevronRight,
  BrainCircuit,
  Clock,
} from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "tutor" | "user";
  content: string;
  timestamp: Date;
}

// ─── Initial seed messages ────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "tutor",
    content:
      'Hello! I\'m ready to dive into Integration by Parts with you. To start, do you remember the general formula for it? It\'s often remembered by the acronym "LIATE".',
    timestamp: new Date(Date.now() - 5 * 60_000),
  },
  {
    id: "2",
    role: "user",
    content:
      "Yes! It's $\\int u \\, dv = uv - \\int v \\, du$. I struggle with choosing which part should be $u$ and which should be $dv$ though.",
    timestamp: new Date(Date.now() - 2 * 60_000),
  },
  {
    id: "3",
    role: "tutor",
    content:
      "That's a very common hurdle! The LIATE rule helps you pick $u$ by priority:\n\n**Logarithmic functions**\n**Inverse trigonometric**\n**Algebraic**\n**Trigonometric**\n**Exponential**\n\nThe function that appears highest in this list should usually be your $u$.",
    timestamp: new Date(Date.now() - 1 * 60_000),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
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

function MessageBubble({
  msg,
  user,
}: {
  msg: Message;
  user: ReturnType<typeof getStoredUser>;
}) {
  const isTutor = msg.role === "tutor";
  const initials = (user?.full_name ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex gap-3",
        isTutor ? "items-start" : "flex-row-reverse items-start"
      )}
    >
      {isTutor ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow">
          <Sparkles className="size-4 text-white" />
        </div>
      ) : (
        <Avatar className="size-9 shrink-0 shadow">
          <AvatarImage src={user?.avatar ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[72%] space-y-1",
          !isTutor && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isTutor
              ? "rounded-tl-none bg-white text-gray-800 shadow-sm"
              : "rounded-tr-none bg-blue-600 text-white"
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
          {isTutor ? "AI Tutor" : "You"} • {timeAgo(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}

// ─── Session summary panel ────────────────────────────────────────────────────

function SessionSummary({ elapsedSeconds }: { elapsedSeconds: number }) {
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <aside className="hidden w-72 shrink-0 space-y-4 overflow-y-auto lg:block">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Session Summary</h2>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
          Live
        </span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Lightbulb className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Core Concept</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
              Integration by parts is essentially the &ldquo;Product Rule&rdquo;
              of differentiation in reverse.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
            <CheckCircle2 className="size-4 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Method Found</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
              LIATE Rule identified for prioritizing &lsquo;u&rsquo; selection.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-purple-600" />
          <p className="text-sm font-semibold text-purple-700">Confidence Level</p>
        </div>
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-purple-200">
            <div className="h-full w-[65%] rounded-full bg-purple-600" />
          </div>
          <p className="mt-1.5 text-xs font-medium text-purple-600">
            Topic Mastery: Improving (65%)
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Next Actions
        </p>
        <div className="space-y-2">
          {[
            "Practice with $\\int x \\cos(x) \\, dx$",
            "Generate Quiz",
          ].map((label) => (
            <button
              key={label}
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="truncate">{label}</span>
              <ChevronRight className="ml-2 size-4 shrink-0 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Time in Session
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Clock className="size-4 text-blue-500" />
          <p className="text-2xl font-extrabold tabular-nums text-gray-900">
            {timeStr}
          </p>
        </div>
      </div>
    </aside>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AiChatSession() {
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(14 * 60 + 23);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() },
    ]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "tutor",
          content:
            "Great question! Let me break that down step by step so it's crystal clear.",
          timestamp: new Date(),
        },
      ]);
    }, 1200);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    /* Full-height column that sits inside the dashboard's <main> */
    <div className="flex h-[calc(100vh-0px)] flex-col overflow-hidden">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ai-hub"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Back to AI Hub"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-sm font-bold text-gray-900">AI Active Session</h1>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" />
              <p className="text-xs text-gray-500">
                Topic: Advanced Calculus — Integration by Parts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
            aria-label="AI"
          >
            <Sparkles className="size-4" />
          </button>
          <button
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500" />
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 gap-6 bg-blue-50 px-4 py-4 sm:px-6">
        {/* Chat column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-5 pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} user={user} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="mt-3 shrink-0">
            <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
              <button
                type="button"
                aria-label="Attach file"
                className="mb-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <Paperclip className="size-4" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question or explain your reasoning..."
                rows={1}
                className="flex-1 resize-none bg-transparent py-1.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                style={{ maxHeight: "120px" }}
              />

              <button
                type="button"
                aria-label="Voice input"
                className="mb-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <Mic className="size-4" />
              </button>

              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim()}
                aria-label="Send"
                className={cn(
                  "mb-1 shrink-0 rounded-lg p-2 transition-colors",
                  input.trim()
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
        <SessionSummary elapsedSeconds={elapsed} />
      </div>

      {/* ── Mobile bottom CTA ──────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback>
              {(user?.full_name ?? "S")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.full_name ?? "Student"}
            </p>
            <p className="text-xs text-orange-500">7 Day Streak 🔥</p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
          >
            Unlock unlimited AI
          </button>
        </div>
      </div>
    </div>
  );
}