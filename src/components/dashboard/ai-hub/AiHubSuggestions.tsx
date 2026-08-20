"use client";

import useSWR from "swr";
import Link from "next/link";
import AI from "@/services/ai.service";

const FALLBACK_SUGGESTIONS = [
  "Revise Integration by Parts",
  "Attempt a Physics Quiz",
  "Solve 5 WAEC Mathematics Questions",
];

export default function AiHubSuggestions() {
  const { data, isLoading: loading } = useSWR("ai-suggested-topics", () => AI.getSuggestedTopics());
  const topics = data && data.topics.length > 0 ? data.topics : FALLBACK_SUGGESTIONS;

  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        Suggested for you
      </p>
      <div className="flex flex-wrap gap-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-40 animate-pulse rounded-lg bg-gray-100" />
            ))
          : topics.map((text) => (
              <Link
                key={text}
                href={`/dashboard/ai-tutor/ai-chat?topic=${encodeURIComponent(text)}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {text}
              </Link>
            ))}
      </div>
    </div>
  );
}
