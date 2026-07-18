"use client";

import { Captions, Maximize, Play, Settings, SkipForward, Volume2 } from "lucide-react";

interface VideoPlayerProps {
  poster: string;
  currentTime: string;
  duration: string;
  progress: number;
}

export default function VideoPlayer({ poster, currentTime, duration, progress }: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gray-950 shadow-lg">
      <div
        className="relative flex aspect-video items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
        <button
          aria-label="Play video"
          className="relative flex size-16 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <Play className="size-6 translate-x-0.5 fill-current" />
        </button>
      </div>

      {/* Progress bar with scrubber thumb */}
      <div className="px-4 pt-3">
        <div className="relative h-1.5 w-full cursor-pointer overflow-visible rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-blue-500"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 px-4 py-3 text-white">
        <button aria-label="Play" className="transition-colors hover:text-blue-400">
          <Play className="size-4 fill-current" />
        </button>
        <button aria-label="Next lesson" className="transition-colors hover:text-blue-400">
          <SkipForward className="size-4 fill-current" />
        </button>
        <button aria-label="Volume" className="transition-colors hover:text-blue-400">
          <Volume2 className="size-4" />
        </button>
        <span className="text-xs font-medium text-white/80">
          {currentTime} / {duration}
        </span>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20"
          >
            1.25x
          </button>
          <button aria-label="Captions" className="transition-colors hover:text-blue-400">
            <Captions className="size-4" />
          </button>
          <button aria-label="Settings" className="transition-colors hover:text-blue-400">
            <Settings className="size-4" />
          </button>
          <button aria-label="Fullscreen" className="transition-colors hover:text-blue-400">
            <Maximize className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}