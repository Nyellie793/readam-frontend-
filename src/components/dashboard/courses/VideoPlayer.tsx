"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AlertTriangle, Captions, CaptionsOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHlsSource } from "@/hooks/useHlsSource";
import TranscriptPanel from "./TranscriptPanel";

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
  const t = useTranslations("dash");
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastReportedRef = useRef(0);
  const locale = useLocale();
  // Browsers do expose a native CC control, but it is inconsistent — Safari
  // hides it behind the overflow menu — so subtitles get an explicit toggle.
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  // Drives the transcript highlight. Kept separate from progress reporting so
  // the panel updates every tick while the API is still written every 15s.
  const [position, setPosition] = useState(0);

  // Sets the element's source: natively on Safari, through hls.js elsewhere.
  // See the hook for why `src` is deliberately not a JSX attribute below.
  const { failed, retry } = useHlsSource(videoRef, src);

  function reportProgress(completed = false) {
    const video = videoRef.current;
    if (!video) return;
    onProgress(Math.floor(video.currentTime), completed);
    lastReportedRef.current = video.currentTime;
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setPosition(video.currentTime);
    // Persist progress at most once every 15s of playback, not on every tick.
    if (video.currentTime - lastReportedRef.current >= 15) {
      reportProgress();
    }
  }

  function seekTo(seconds: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    setPosition(seconds);
    void video.play().catch(() => {
      // Autoplay can be refused if the user has not interacted yet; seeking
      // still worked, so there is nothing to report.
    });
  }

  /**
   * The API returns a caption URL whenever the lesson has a stream_uid, whether
   * or not that language was actually generated — the URL resolves but the VTT
   * may 404. Only offer tracks once the transcript pipeline reports "ready",
   * and let the browser silently drop any track that fails to load.
   */
  const ready = captions?.status === "ready";
  /**
   * Only tracks with a real URL are offered. In practice this is a single
   * track in the language actually spoken: Cloudflare's caption `language` is
   * a hint for Whisper's decoding, not a translation target, so asking for a
   * second language returned the same words under a different label. The
   * switcher below therefore only appears if a video genuinely has more than
   * one track.
   */
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
  /**
   * Only the <track> elements rendered below count. The stream's own manifest
   * lists an auto-generated subtitle track in the same language, which Safari
   * (natively) and hls.js (unless told otherwise) expose alongside ours in
   * `video.textTracks`; toggling every match would show the captions twice.
   */
  const ownTextTracks = useCallback((): TextTrack[] => {
    const video = videoRef.current;
    if (!video) return [];
    return Array.from(video.querySelectorAll<HTMLTrackElement>("track[data-readam-track]")).map(
      (el) => el.track
    );
  }, []);

  const applyTracks = useCallback(
    (lang: string | null, visible: boolean) => {
      for (const textTrack of ownTextTracks()) {
        textTrack.mode = visible && textTrack.language === lang ? "showing" : "disabled";
      }
    },
    [ownTextTracks]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || trackCount === 0) return;

    const langs = ownTextTracks().map((t) => t.language);
    const preferred = langs.includes(locale) ? locale : langs[0];
    setActiveLang(preferred);
    applyTracks(preferred, showCaptions);
  }, [locale, trackCount, src, showCaptions, applyTracks, ownTextTracks]);

  function chooseLang(lang: string) {
    setActiveLang(lang);
    setShowCaptions(true);
    applyTracks(lang, true);
  }

  // The transcript follows whichever subtitle language is selected, and stays
  // available when subtitles are switched off.
  const transcriptSrc = tracks.find((t) => t.lang === activeLang)?.src ?? tracks[0]?.src ?? null;

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-gray-950 shadow-lg">
      <div className="relative">
      <video
        ref={videoRef}
        key={src}
        poster={poster}
        controls
        // Required for cross-origin <track> files to load at all.
        crossOrigin="anonymous"
        className="aspect-video w-full bg-black"
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;
          if (startAtSeconds) {
            video.currentTime = startAtSeconds;
          }
          // Every lesson change — auto-advance, "Up Next", or picking one from
          // the outline — remounts this element with a new src (key={src}),
          // which loads paused. Nothing used to press play again, so the
          // player sat there ready but silent until the student clicked it
          // themselves.
          void video.play().catch(() => {
            // Autoplay refused (browser policy on first load with no prior
            // interaction, most likely) — controls are still there.
          });
        }}
        onTimeUpdate={handleTimeUpdate}
        onPause={() => reportProgress()}
        onEnded={() => reportProgress(true)}
      >
        {tracks.map((t) => (
          <track
            key={t.lang}
            data-readam-track=""
            kind="subtitles"
            srcLang={t.lang}
            label={t.label}
            src={t.src}
          />
        ))}
      </video>

      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950/95 px-6 text-center text-white/80">
          <AlertTriangle className="size-7 text-orange-400" />
          <p className="text-sm">{t("lessonFailed")}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}
      </div>

      {trackCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-gray-950 px-3 py-2">
          <button
            type="button"
            onClick={() => setShowCaptions((v) => !v)}
            aria-pressed={showCaptions}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {showCaptions ? <Captions className="size-4" /> : <CaptionsOff className="size-4" />}
            {showCaptions ? t("subtitlesOn") : t("subtitlesOff")}
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
          {t("subtitlesPending")}
        </p>
      )}
      </div>

      <TranscriptPanel src={transcriptSrc} currentTime={position} onSeek={seekTo} />
    </>
  );
}
