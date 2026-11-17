"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, ShoppingBag, UserPlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import REFERRAL from "@/services/referral.service";
import { errorMessage } from "@/lib/api";
import type { ReferredPersonItem } from "@/types/api.types";

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Everyone the user's code has brought in: who signed up with it (whether or
 * not they have bought anything yet) and who used it at checkout, with the
 * courses each one bought. Names and dates only — never contact details.
 */
export default function ReferredPeopleList() {
  const t = useTranslations("referrals");
  const [people, setPeople] = useState<ReferredPersonItem[]>([]);
  const [total, setTotal] = useState(0);
  // The last page that loaded successfully (0 = none yet), so a failed "Show
  // more" retries that page instead of replacing the list with page 1.
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    (target: number) => {
      setLoading(true);
      setError(null);
      REFERRAL.getMyPeople(target, PAGE_SIZE)
        .then((d) => {
          setPeople((prev) => {
            if (target === 1) return d.items;
            // A signup between fetches shifts a newest-first list, so a row
            // can come round again; keep one of each.
            const seen = new Set(prev.map((p) => p.user_id));
            return [...prev, ...d.items.filter((p) => !seen.has(p.user_id))];
          });
          setTotal(d.total);
          setPage(target);
        })
        .catch((e) => setError(errorMessage(e, t("loadFailed"))))
        .finally(() => setLoading(false));
    },
    [t]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-900">{t("peopleTitle")}</h2>
        <p className="text-xs text-gray-400">{t("peopleBody")}</p>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => load(page + 1)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}

      {loading && people.length === 0 ? (
        <ul className="divide-y divide-gray-50">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="px-5 py-4">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-gray-100" />
            </li>
          ))}
        </ul>
      ) : people.length === 0 && !error ? (
        <div className="px-5 py-12 text-center">
          <Users className="mx-auto size-8 text-gray-300" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{t("emptyTitle")}</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-gray-500">
            {t("emptyBody")}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {people.map((p) => (
            <li key={p.user_id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-gray-900">{p.full_name}</p>
                <p className="text-xs text-gray-400">{t("joined", { date: formatDate(p.joined_at) })}</p>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                <UserPlus className="size-3" />
                {p.signed_up_with_code ? t("viaSignup") : t("viaCheckout")}
              </p>

              {p.purchases.length === 0 ? (
                <p className="mt-2 text-xs text-gray-400">{t("noPurchases")}</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {p.purchases.map((x) => (
                    <li key={x.payment_id} className="flex items-start gap-2 text-xs text-gray-700">
                      <ShoppingBag className="mt-0.5 size-3 shrink-0 text-teal-600" />
                      <span className="min-w-0 flex-1">
                        <span className="text-gray-400">{t("boughtLabel")} </span>
                        <span className="font-medium">{x.course_title ?? "—"}</span>
                      </span>
                      <span className="shrink-0 text-gray-400">{formatDate(x.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {people.length < total && (
        <div className="border-t border-gray-100 p-3 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => load(page + 1)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-3.5 animate-spin" />}
            {loading ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}
    </section>
  );
}
