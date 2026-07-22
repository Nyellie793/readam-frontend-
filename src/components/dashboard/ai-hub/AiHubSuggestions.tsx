"use client";

import Link from "next/link";

const SUGGESTIONS = [
  "Revise Integration by Parts",
  "Attempt a Physics Quiz",
  "Solve 5 WAEC Mathematics Questions",
];

export default function AiHubSuggestions() {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        Suggested for you
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((text) => (
          <Link
            key={text}
            href={`/dashboard/ai-chat?q=${encodeURIComponent(text)}`}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {text}
          </Link>
        ))}
      </div>
    </div>
  );
}