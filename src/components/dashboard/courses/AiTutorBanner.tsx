import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiTutorBannerProps {
  variant?: "wide" | "compact";
}

export default function AiTutorBanner({ variant = "wide" }: AiTutorBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-600 p-6 text-white sm:p-8",
        variant === "compact" && "flex flex-col gap-5"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 200">
          <path
            d="M-20 150 C 80 100, 140 200, 220 120 S 380 60, 440 100"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-20 100 C 100 40, 160 160, 260 80 S 380 20, 440 60"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div
        className={cn(
          "relative flex gap-5",
          variant === "compact" ? "flex-col items-start" : "items-center justify-between"
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold sm:text-xl">Can&apos;t find your specific niche?</h3>
            <p className="mt-1 max-w-md text-sm text-white/80">
              Our AI Tutor can help you curate a personalized study path for complex engineering
              or design topics within our library.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-white/90"
        >
          Ask ReadAm AI
        </button>
      </div>
    </div>
  );
}
