"use client";

import { Flame } from "lucide-react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const ACTIVE = [0, 1, 2, 3, 4];

export default function AiHubLearningStreak() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Learning Streak</h3>
        <div className="flex size-8 items-center justify-center rounded-full bg-orange-100">
          <Flame className="size-4 text-orange-500" />
        </div>
      </div>

      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-orange-500">
        <Flame className="size-3.5" />
        6-Day Streak
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">XP</p>
          <p className="text-xl font-extrabold text-gray-900">1,250</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Weekly Goal</p>
          <p className="text-xl font-extrabold text-gray-900">80%</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        {DAYS.map((day, i) => (
          <span
            key={`${day}-${i}`}
            className={`flex size-8 items-center justify-center rounded-full text-[11px] font-bold ${
              ACTIVE.includes(i) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-800">Keep going!</p>
        <p className="text-xs text-gray-500">You&apos;re ahead of 72% of students.</p>
        <button
          type="button"
          className="mt-3 w-full rounded-xl border-2 border-orange-400 py-2 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50"
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
}