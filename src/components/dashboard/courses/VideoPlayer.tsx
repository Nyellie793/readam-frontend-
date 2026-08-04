"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Captions, CaptionsOff } from "lucide-react";

export interface VideoCaptions {
  en: string | null;
  fr: string | null;
  /** Only "ready" means Cloudflare has finished generating the VTT. */
  status: "none" | "pending" | "ready" | "failed";
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  startAtSeconds?: number;
  onProgress: (positionSeconds: number, completed: boolean) => void;
  captions?: VideoCaptions;
}

export default function VideoPlayer({
  src,
  poster,
  startAtSeconds,
  onProgress,
  captions,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastReportedRef = useRef(0);
  const locale = useLocale();
  // Browsers do expose a native CC control, but it is inconsistent — Safari
  // hides it behind the overflow menu — so subtitles get an explicit toggle.
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeLang, setActiveLang] = useState<string | null>(null);

  function reportProgress(completed = false) {
    const video = videoRef.current;
    if (!video) return;
    onProgress(Math.floor(video.currentTime), completed);
    lastReportedRef.current = video.currentTime;
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    // Persist progress at most once every 15s of playback, not on every tick.
    if (video.currentTime - lastReportedRef.current >= 15) {
      reportProgress();
    }
  }

  /**
   * The API returns a caption URL whenever the lesson has a stream_uid, whether
   * or not that language was actually generated — the URL resolves but the VTT
   * may 404. Only offer tracks once the transcript pipeline reports "ready",
   * and let the browser silently drop any track that fails to load.
   */
  const ready = captions?.status === "ready";
  const tracks = ready
    ? ([
        { lang: "en", label: "English", src: captions?.en },
        { lang: "fr", label: "Français", src: captions?.fr },
      ].filter((t) => !!t.src) as { lang: string; label: string; src: string }[])
    : [];
  const trackCount = tracks.length;

  /**
   * Default the visible subtitle track to the interface language when we have
   * it. `default` on <track> is only honoured on first render, so this is set
   * imperatively and re-run whenever the lesson or track list changes.
   */
  const applyTracks = useCallback(
    (lang: string | null, visible: boolean) => {
      const video = videoRef.current;
      if (!video) return;
      for (const textTrack of Array.from(video.textTracks)) {
        textTrack.mode = visible && textTrack.language === lang ? "showing" : "disabled";
      }
    },
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || trackCount === 0) return;

    const langs = Array.from(video.textTracks).map((t) => t.language);
    const preferred = langs.includes(locale) ? locale : langs[0];
    setActiveLang(preferred);
    applyTracks(preferred, showCaptions);
  }, [locale, trackCount, src, showCaptions, applyTracks]);

  function chooseLang(lang: string) {
    setActiveLang(lang);
    setShowCaptions(true);
    applyTracks(lang, true);
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-gray-950 shadow-lg">
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        controls
        // Required for cross-origin <track> files to load at all.
        crossOrigin="anonymous"
        className="aspect-video w-full bg-black"
        onLoadedMetadata={() => {
          if (videoRef.current && startAtSeconds) {
            videoRef.current.currentTime = startAtSeconds;
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        onPause={() => reportProgress()}
        onEnded={() => reportProgress(true)}
      >
        {tracks.map((t) => (
          <track key={t.lang} kind="subtitles" srcLang={t.lang} label={t.label} src={t.src} />
        ))}
      </video>

      {trackCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-gray-950 px-3 py-2">
          <button
            type="button"
            onClick={() => setShowCaptions((v) => !v)}
            aria-pressed={showCaptions}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {showCaptions ? <Captions className="size-4" /> : <CaptionsOff className="size-4" />}
            {showCaptions ? "Subtitles on" : "Subtitles off"}
          </button>

          {showCaptions && trackCount > 1 && (
            <div className="flex items-center gap-1">
              {tracks.map((t) => (
                <button
                  key={t.lang}
                  type="button"
                  onClick={() => chooseLang(t.lang)}
                  aria-pressed={activeLang === t.lang}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    activeLang === t.lang
                      ? "bg-blue-600 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {captions?.status === "pending" && (
        <p className="border-t border-white/10 bg-gray-950 px-3 py-2 text-xs text-white/40">
          Subtitles are still being generated for this lesson.
        </p>
      )}
    </div>
  );
}
