"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Route-level error boundary. Without this, any render-time exception in a
 * client component blanks the whole route with the default Next.js screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");
  useEffect(() => {
    // Replace with your error reporter (Sentry etc.) when one is wired up.
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <AlertTriangle className="size-6" />
        </span>

        <h1 className="mt-5 text-xl font-black text-gray-900">{t("somethingWrong")}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          This page failed to load. It is usually temporary, so trying again
          often works. Nothing you were doing has been lost.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-[11px] text-gray-400">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <RotateCw className="size-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="size-4" />
            Back to dashboard
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-blue-600 hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
