"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";

/** Scoped to /dashboard/* so a failing widget does not take out the shell. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("dash");
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <AlertTriangle className="size-5" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-gray-900">{t("sectionFailed")}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
          {t("sectionFailedBody")}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <RotateCw className="size-4" />
            {t("tryAgain")}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {t("dashboardHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
