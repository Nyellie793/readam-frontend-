import { WifiOff } from "lucide-react";
import RetryButton from "@/components/shared/RetryButton";

export const metadata = {
  title: "You're offline",
  description: "No internet connection.",
};

/**
 * Shown by the service worker (public/sw.js) when a page navigation fails
 * with no network. Deliberately has no data fetching or next-intl server
 * call — it has to render from the cache alone with zero network available.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <WifiOff className="size-6" />
        </span>

        <h1 className="mt-5 text-xl font-black text-gray-900">You&apos;re offline</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          This page needs an internet connection. Check your connection and
          try again.
        </p>

        <RetryButton />
      </div>
    </main>
  );
}
