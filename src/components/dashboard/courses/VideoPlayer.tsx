"use client";

import { useRef } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  startAtSeconds?: number;
  onProgress: (positionSeconds: number, completed: boolean) => void;
}

export default function VideoPlayer({ src, poster, startAtSeconds, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastReportedRef = useRef(0);

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

  return (
    <div className="overflow-hidden rounded-2xl bg-gray-950 shadow-lg">
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        controls
        className="aspect-video w-full bg-black"
        onLoadedMetadata={() => {
          if (videoRef.current && startAtSeconds) {
            videoRef.current.currentTime = startAtSeconds;
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        onPause={() => reportProgress()}
        onEnded={() => reportProgress(true)}
      />
    </div>
  );
}
