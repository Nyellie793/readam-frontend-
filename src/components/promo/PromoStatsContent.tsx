"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CalendarClock,
  Loader2,
  MousePointerClick,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import PROMO from "@/services/promo.service";
import { ApiRequestError, errorMessage } from "@/lib/api";
import { cn, xaf } from "@/lib/utils";
import type { PromoCodeStatsPage, PromoCodeStatsPurchase } from "@/types/api.types";

const PAGE_SIZE = 20;

const STATUS_STYLES: Record<PromoCodeStatsPurchase["status"], string> = {
  successful: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  failed: "bg-red-50 text-red-700 border-red-100",
  expired: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_KEYS: Record<PromoCodeStatsPurchase["status"], string> = {
  successful: "statusSuccessful",
  pending: "statusPending",
  failed: "statusFailed",
  expired: "statusExpired",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stat({
  label,
  value,
  sub,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "blue" | "teal" | "orange" | "gray";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600",
    orange: "bg-orange-50 text-orange-500",
    gray: "bg-gray-100 text-gray-500",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <span className={cn("flex size-8 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

/**
 * An influencer's view of their own promo code, opened with the private link
 * an admin sent them. No account, no login: the token in the URL is the key.
 *
 * Shows what the code earned and every attempt to use it, but never who the
 * students were — that stays inside ReadAm.
 */
export default function PromoStatsContent() {
  const t = useTranslations("promoStats");
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PromoCodeStatsPage | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    PROMO.getStats(token, page, PAGE_SIZE)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiRequestError && (e.status === 404 || e.status === 422)) {
          setInvalid(true);
          return;
        }
        const message = errorMessage(e, t("loadFailed"));
        setError(message);
        // Nothing to replace the first page with, so the inline error card
        // handles that case; a later page failing keeps the table and says so.
        if (data) toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // `data` is read only to decide between the error card and a toast; it
    // must not retrigger the fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, attempt, t]);

  const totalPages = data ? Math.max(1, Math.ceil(data.purchases_total / PAGE_SIZE)) : 1;
  const rate =
    data && data.total_attempts > 0
      ? Math.round((data.successful_purchases / data.total_attempts) * 100)
      : null;

  return (
    <>
      <main className="min-h-[70vh] bg-gray-50">
        <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6">
          {invalid ? (
            <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <Ticket className="mx-auto size-8 text-gray-300" />
              <p className="text-lg font-bold text-gray-900">{t("invalidTitle")}</p>
              <p className="text-sm leading-relaxed text-gray-500">{t("invalidBody")}</p>
              <Link
                href="/"
                className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t("goHome")}
              </Link>
            </div>
          ) : loading && !data ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-6 animate-spin text-blue-600" />
            </div>
          ) : error && !data ? (
            <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t("tryAgain")}
              </button>
            </div>
          ) : (
            data && (
              <>
                {/* Header */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {t("eyebrow")}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h1 className="font-mono text-3xl font-black tracking-widest text-gray-900 sm:text-4xl">
                      {data.code}
                    </h1>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        data.is_active
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-100 text-gray-500"
                      )}
                    >
                      {data.is_active ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("subtitle")}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {t("createdOn", { date: formatDate(data.created_at) })}
                  </p>
                  {!data.is_active && (
                    <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-xs text-orange-700">
                      {t("inactiveHint")}
                    </p>
                  )}
                </div>

                {/* Headline numbers */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat
                    label={t("purchases")}
                    value={String(data.successful_purchases)}
                    icon={ShoppingBag}
                    tone="teal"
                  />
                  <Stat label={t("revenue")} value={xaf(data.revenue_xaf)} icon={Wallet} />
                  <Stat
                    label={t("attempts")}
                    value={String(data.total_attempts)}
                    sub={rate === null ? t("noAttempts") : t("paidRate", { rate })}
                    icon={MousePointerClick}
                    tone="orange"
                  />
                  <Stat
                    label={t("lastPurchase")}
                    value={data.last_used_at ? formatDate(data.last_used_at) : t("none")}
                    icon={CalendarClock}
                    tone="gray"
                  />
                </div>

                {/* History */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 p-5">
                    <h2 className="text-sm font-bold text-gray-900">{t("historyTitle")}</h2>
                    <p className="text-xs text-gray-400">{t("historyBody")}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="border-b border-gray-100 bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                            {t("colDate")}
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                            {t("colCourse")}
                          </th>
                          <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                            {t("colAmount")}
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                            {t("colStatus")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className={cn("divide-y divide-gray-50", loading && "opacity-60")}>
                        {data.purchases.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                              {t("empty")}
                            </td>
                          </tr>
                        ) : (
                          data.purchases.map((p, i) => (
                            <tr key={`${p.created_at}-${i}`} className="hover:bg-gray-50">
                              <td className="px-5 py-3.5 text-gray-500">{formatDate(p.created_at)}</td>
                              <td className="px-5 py-3.5 font-medium text-gray-900">
                                {p.course_title ?? "—"}
                              </td>
                              <td className="px-5 py-3.5 text-right tabular-nums text-gray-900">
                                {xaf(p.amount)}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={cn(
                                    "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                    STATUS_STYLES[p.status]
                                  )}
                                >
                                  {t(STATUS_KEYS[p.status])}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                      <button
                        type="button"
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
                      >
                        {t("previous")}
                      </button>
                      <span className="text-xs font-medium text-gray-400">
                        {t("pageOf", { page, total: totalPages })}
                      </span>
                      <button
                        type="button"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
                      >
                        {t("next")}
                      </button>
                    </div>
                  )}
                </div>

                <p className="flex items-start gap-2 text-xs text-gray-400">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                  {t("privacy")}
                </p>
              </>
            )
          )}
        </div>
      </main>
    </>
  );
}
