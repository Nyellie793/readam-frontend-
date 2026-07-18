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
    <div className="overflow-hidden rounded-2xl bg-gray-950 shadow-sm">
      <div
        className="relative flex aspect-video items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        <button
          aria-label="Play video"
          className="relative flex size-16 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-xl transition-transform hover:scale-105"
        >
          <Play className="size-6 translate-x-0.5 fill-current" />
        </button>
      </div>

      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-3 text-white">
        <button aria-label="Play" className="hover:text-blue-400">
          <Play className="size-4 fill-current" />
        </button>
        <button aria-label="Next lesson" className="hover:text-blue-400">
          <SkipForward className="size-4 fill-current" />
        </button>
        <button aria-label="Volume" className="hover:text-blue-400">
          <Volume2 className="size-4" />
        </button>
        <span className="text-xs font-medium text-white/80">
          {currentTime} / {duration}
        </span>

        <div className="ml-auto flex items-center gap-4">
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">1.25x</span>
          <button aria-label="Captions" className="hover:text-blue-400">
            <Captions className="size-4" />
          </button>
          <button aria-label="Settings" className="hover:text-blue-400">
            <Settings className="size-4" />
          </button>
          <button aria-label="Fullscreen" className="hover:text-blue-400">
            <Maximize className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
