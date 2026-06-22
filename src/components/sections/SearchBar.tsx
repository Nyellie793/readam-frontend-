import { Sparkles, Paperclip, Mic } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full rounded-[1.5rem] bg-gradient-to-br from-blue-400/50 via-orange-200/40 to-blue-300/40 p-[2px] shadow-[0_20px_45px_-12px_rgba(37,99,235,0.35)]">
      <div className="relative w-full overflow-hidden rounded-[calc(1.5rem-2px)] border border-white/60 bg-white px-5 py-5 sm:px-6 sm:py-6">

        {/* Blue glow — bottom right */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[140px] w-[280px] translate-x-1/4 translate-y-1/4"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(147,197,253,0.7) 0%, rgba(191,219,254,0.4) 40%, transparent 70%)",
            filter: "blur(28px)",
          }}
        />

        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          </span>
          <span className="text-sm font-bold text-gray-800">Ask ReadAM</span>
          <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
            AI
          </span>
        </div>

        {/* Input row */}
        <div className="flex items-center gap-3">
          <Paperclip className="h-4 w-4 shrink-0 text-gray-400" />

          <input
            type="text"
            placeholder="Explain the theory of relativity..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none sm:text-base"
          />

          <Mic className="h-4 w-4 shrink-0 text-gray-400" />

          {/* CTA — brighter, bigger, with glow shadow */}
          <button
            type="button"
            aria-label="Ask ReadAM"
            className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl
            bg-orange-500
            brightness-110
            shadow-[0_4px_14px_rgba(249,115,22,0.4)]
            transition-all
            hover:brightness-125
            hover:bg-orange-600
            hover:shadow-[0_4px_20px_rgba(249,115,22,0.6)]
          ">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
