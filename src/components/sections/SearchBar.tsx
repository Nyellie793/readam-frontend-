import { Sparkles, Paperclip, Mic } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-lg overflow-hidden">

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
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-orange-400" />
        <span className="text-sm font-semibold text-gray-700">Ask ReadAM</span>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-3">
        <Paperclip className="h-4 w-4 shrink-0 text-gray-400" />

        <input
          type="text"
          placeholder="Explain the theory of relativity..."
          className="flex-1 bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none"
        />

        <Mic className="h-4 w-4 shrink-0 text-gray-400" />

        {/* CTA — brighter, bigger, with glow shadow */}
        <button className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl
          bg-orange-500
          brightness-110
          shadow-[0_4px_14px_rgba(249,115,22,0.4)]
          hover:brightness-125
          hover:bg-orange-600
          hover:shadow-[0_4px_20px_rgba(249,115,22,0.6)]
          transition-all
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
  );
}