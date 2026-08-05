"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseVtt, formatTimestamp, type Cue } from "@/lib/vtt";

interface TranscriptPanelProps {
  /** VTT URL for the language currently selected in the player. */
  src: string | null;
  /** Playback position, so the active line can be highlighted. */
  currentTime: number;
  /** Jump the video to a cue's start time. */
  onSeek: (seconds: number) => void;
}

export default function TranscriptPanel({ src, currentTime, onSeek }: TranscriptPanelProps) {
  const t = useTranslations("dash");
  // Cues are stored against the URL they came from, so switching language
  // never shows the previous track's lines while the new one is in flight.
  const [loaded, setLoaded] = useState<{ src: string; cues: Cue[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  // Auto-scroll fights the user while they are reading ahead, so it pauses for
  // a few seconds after any manual scroll.
  const manualScrollUntil = useRef(0);

  useEffect(() => {
    if (!src) return;
    const controller = new AbortController();

    async function load(url: string) {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        setLoaded({ src: url, cues: parseVtt(await res.text()) });
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") setFailed(true);
      } finally {
        setLoading(false);
      }
    }

    void load(src);
    return () => controller.abort();
  }, [src]);

  // Anything loaded from a different URL is stale and must not be shown.
  const cues = useMemo(
    () => (loaded && loaded.src === src ? loaded.cues : []),
    [loaded, src]
  );

  const activeIndex = useMemo(() => {
    for (let i = cues.length - 1; i >= 0; i--) {
      if (currentTime >= cues[i].start) return currentTime <= cues[i].end + 0.5 ? i : -1;
    }
    return -1;
  }, [cues, currentTime]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return new Set(
      cues.reduce<number[]>((acc, cue, i) => {
        if (cue.text.toLowerCase().includes(q)) acc.push(i);
        return acc;
      }, [])
    );
  }, [cues, query]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    if (Date.now() < manualScrollUntil.current) return;
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIndex, open]);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(cues.map((c) => c.text).join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some embedded browsers; the text is still
      // selectable by hand, so this needs no error surface.
    }
  }

  if (!src) return null;

  const shown = matches ? cues.filter((_, i) => matches.has(i)) : cues;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2 text-left text-sm font-bold text-gray-900"
        >
          <ChevronDown
            className={cn("size-4 shrink-0 text-gray-400 transition-transform", open && "rotate-180")}
          />
          {t("transcript")}
          {cues.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
              {t("transcriptLines", { count: cues.length })}
            </span>
          )}
        </button>

        {open && cues.length > 0 && (
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            {copied ? (
              <Check className="size-3.5 text-teal-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? t("copied") : t("copy")}
          </button>
        )}
      </div>

      {open && (
        <div className="border-t border-gray-100">
          {loading && <p className="px-4 py-6 text-sm text-gray-400">{t("transcriptLoading")}</p>}

          {!loading && failed && (
            <p className="px-4 py-6 text-sm text-red-500">{t("transcriptFailed")}</p>
          )}

          {!loading && !failed && cues.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-400">{t("transcriptEmpty")}</p>
          )}

          {!loading && !failed && cues.length > 0 && (
            <>
              <div className="relative border-b border-gray-50 px-4 py-2.5">
                <Search className="pointer-events-none absolute left-7 top-1/2 size-3.5 -translate-y-1/2 text-gray-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("transcriptSearch")}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-8 text-sm outline-none transition placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={t("clear")}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div
                ref={listRef}
                onScroll={() => {
                  manualScrollUntil.current = Date.now() + 5000;
                }}
                className="max-h-96 space-y-0.5 overflow-y-auto px-2 py-2"
              >
                {shown.length === 0 && (
                  <p className="px-2 py-4 text-sm text-gray-400">{t("transcriptNoMatch")}</p>
                )}
                {shown.map((cue) => {
                  const index = cues.indexOf(cue);
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={`${cue.start}-${index}`}
                      ref={isActive ? activeRef : undefined}
                      type="button"
                      onClick={() => onSeek(cue.start)}
                      className={cn(
                        "flex w-full gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                        isActive ? "bg-blue-50" : "hover:bg-gray-50"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 pt-0.5 font-mono text-[11px] tabular-nums",
                          isActive ? "text-blue-600" : "text-gray-400"
                        )}
                      >
                        {formatTimestamp(cue.start)}
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-relaxed",
                          isActive ? "font-medium text-blue-900" : "text-gray-600"
                        )}
                      >
                        {cue.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
