import Link from "next/link";

export default function AiHubBanner() {
  return (
    <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 p-6 text-white sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 600 300" preserveAspectRatio="none">
          <circle cx="480" cy="60" r="140" fill="white" />
          <circle cx="540" cy="200" r="80" fill="white" />
        </svg>
      </div>

      <p className="pointer-events-none absolute right-6 top-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 sm:text-xs">
        AI Learning Partner
      </p>

      <div className="relative max-w-sm">
        <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">
          Master Your Toughest Subject
          <br />
          with <span className="text-orange-300">&ldquo;ReadAm AI&rdquo;</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          Our AI Tutor doesn&apos;t just give answers, it explains concepts.
          Connect with &ldquo;ReadAm AI&rdquo; for a deep dive session on
          Physics, Math, or Biology.
        </p>
        <Link
          href="/dashboard/ai-chat"
          className="mt-5 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow transition-colors hover:bg-blue-50"
        >
          Start AI Session
        </Link>
      </div>
    </div>
  );
}