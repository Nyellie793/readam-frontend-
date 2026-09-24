"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import ADMIN from "@/services/admin.service";
import { xaf } from "@/lib/utils";
import type { AdminCourseSalesItem, CourseSalesTotals } from "@/types/api.types";


function pct(part: number, whole: number): string {
  return whole === 0 ? "—" : `${Math.round((part / whole) * 100)}%`;
}

/**
 * Dashboard-home card: how many course purchases there have been, how many
 * came through a promo code, and the best-selling courses. The full table
 * lives at /admin/sales.
 */
export default function SalesOverviewPanel() {
  const [totals, setTotals] = useState<CourseSalesTotals | null>(null);
  const [top, setTop] = useState<AdminCourseSalesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ADMIN.getSalesByCourse({ page: 1, pageSize: 5, sort: "purchases", status: "published" })
      .then((d) => {
        if (cancelled) return;
        setTotals(d.totals);
        setTop(d.items.filter((c) => c.purchases > 0));
      })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Course Sales</h3>
        </div>
        <Link
          href="/admin/sales"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
        >
          All courses <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ) : totals === null ? (
        <p className="p-5 text-sm text-gray-400">Sales figures are unavailable right now.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 divide-x divide-gray-50 border-b border-gray-50">
            <div className="p-5">
              <p className="text-xs text-gray-500">Purchases</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">
                {totals.purchases}
              </p>
              <p className="text-[11px] text-gray-400">{xaf(totals.revenue)}</p>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500">With promo code</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">
                {totals.purchases_with_promo}
              </p>
              <p className="text-[11px] text-gray-400">
                {pct(totals.purchases_with_promo, totals.purchases)} of purchases
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500">Without a code</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">
                {totals.purchases_without_promo}
              </p>
              <p className="text-[11px] text-gray-400">
                {pct(totals.purchases_without_promo, totals.purchases)} of purchases
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {top.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No course has been bought yet.</p>
            ) : (
              top.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="block truncate text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {c.title}
                    </Link>
                    <p className="truncate text-xs text-gray-400">
                      {c.purchases_with_promo} with a code · {c.purchases_without_promo} without
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums text-gray-900">
                      {c.purchases}{" "}
                      <span className="text-xs font-medium text-gray-400">
                        {c.purchases === 1 ? "purchase" : "purchases"}
                      </span>
                    </p>
                    <p className="text-xs tabular-nums text-gray-400">{xaf(c.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
