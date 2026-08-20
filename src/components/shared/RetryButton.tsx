"use client";

import { RotateCw } from "lucide-react";

export default function RetryButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
    >
      <RotateCw className="size-4" />
      Try again
    </button>
  );
}
