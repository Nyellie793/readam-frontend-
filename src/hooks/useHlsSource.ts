"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

const HLS_MIME = "application/vnd.apple.mpegurl";

// How many times a fatal error of each class is retried before the player
// gives up and says so. Without a bound, a lesson whose manifest is missing
// (Cloudflare returns 404 until transcoding finishes) or a connection that
// drops mid-lesson would loop silently forever behind an inert player.
const MAX_NETWORK_RESTARTS = 2;
const MAX_MEDIA_RECOVERIES = 2;

export interface HlsSource {
  /** True once playback has failed for good; show a message and offer retry. */
  failed: boolean;
  /** Start over from the manifest (or reload the native source). */
  retry: () => void;
}

/**
 * Feed a video URL to a <video> element, going through hls.js unless the
 * browser is one that plays HLS well on its own.
 *
 * Every lesson video is a Cloudflare Stream HLS manifest (.m3u8). Safari on
 * macOS and iOS plays those natively, which is why the player worked for
 * whoever tested on an iPhone. Firefox cannot at all ("No video with
 * supported format and MIME type found"); Chrome and Edge *claim* they can
 * (`canPlayType` answers "maybe") but hls.js's own guidance is not to trust
 * that, as their built-in HLS fails on some streams. So, per that guidance:
 * native only on modern Safari (which is the one browser that also exposes
 * ManagedMediaSource), hls.js everywhere it is supported, and the plain
 * source as a last resort for browsers with neither.
 *
 * The library is loaded on demand, only where it is used, so Safari users
 * never download it. Non-HLS URLs are set on the element as they are.
 *
 * The element's `src` is set here, imperatively, and must not also be set as
 * a JSX attribute: React would keep re-applying the manifest URL over the
 * MediaSource one hls.js attaches, and the browser would fail again.
 */
export function useHlsSource(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string | null | undefined
): HlsSource {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = /\.m3u8(\?|$)/i.test(src);
    const nativeIsTrustworthy = !!video.canPlayType(HLS_MIME) && "ManagedMediaSource" in window;

    // The element's own error event is the failure signal on the native path
    // (and the last-resort path below); hls.js reports through its own events.
    const onElementError = () => setFailed(true);

    if (!isHls || nativeIsTrustworthy) {
      video.addEventListener("error", onElementError);
      video.src = src;
      return () => video.removeEventListener("error", onElementError);
    }

    let cancelled = false;
    let hls: { destroy: () => void } | null = null;

    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      const target = videoRef.current;
      if (!target) return;

      if (!Hls.isSupported()) {
        // No Media Source Extensions here (very old WebViews, iPhones before
        // iOS 17.1). Native is all that is left; it may well work. Listener
        // goes on `video`, the same reference the cleanup removes it from.
        video.addEventListener("error", onElementError);
        video.src = src;
        return;
      }

      const instance = new Hls({
        enableWorker: true,
        // Subtitles are React-rendered <track> elements chosen by the player;
        // hls.js must not add the manifest's own copy of the same language or
        // the captions render twice.
        renderTextTracksNatively: false,
        enableWebVTT: false,
        enableIMSC1: false,
        enableCEA708Captions: false,
      });
      hls = instance;

      let networkRestarts = 0;
      let mediaRecoveries = 0;
      instance.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRestarts < MAX_NETWORK_RESTARTS) {
          networkRestarts += 1;
          // startLoad() cannot recover a manifest that never loaded — only
          // loadSource() requests it again. Once levels exist, startLoad()
          // resumes fragment loading from where it stopped.
          if (instance.levels.length === 0) instance.loadSource(src);
          else instance.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveries < MAX_MEDIA_RECOVERIES) {
          mediaRecoveries += 1;
          // hls.js's documented escalation: try once, then swap the audio
          // codec before the second attempt.
          if (mediaRecoveries === 2) instance.swapAudioCodec();
          instance.recoverMediaError();
          return;
        }
        instance.destroy();
        hls = null;
        setFailed(true);
      });

      instance.loadSource(src);
      instance.attachMedia(target);
    });

    return () => {
      cancelled = true;
      video.removeEventListener("error", onElementError);
      hls?.destroy();
    };
  }, [videoRef, src, attempt]);

  return { failed, retry };
}
