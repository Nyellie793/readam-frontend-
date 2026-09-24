"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import ADMIN from "@/services/admin.service";
import { xaf } from "@/lib/utils";
import type { AdminPromoCodeItem, PromoCodeSummary } from "@/types/api.types";


/**
 * Dashboard-home card: how much business influencer codes are bringing in,
 * and which codes are doing it. Full management lives at /admin/promo-codes.
 */
export default function PromoCodesPanel() {
  const [summary, setSummary] = useState<PromoCodeSummary | null>(null);
  const [top, setTop] = useState<AdminPromoCodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ADMIN.getPromoCodes(1, false, 5)
      .then((d) => {
        if (cancelled) return;
        setSummary(d.summary);
        setTop(d.items);
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
          <Ticket className="size-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Promo Code Sales</h3>
        </div>
        <Link
          href="/admin/promo-codes"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
        >
          Manage codes <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ) : summary === null ? (
        <p className="p-5 text-sm text-gray-400">Promo code stats are unavailable right now.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 divide-x divide-gray-50 border-b border-gray-50">
            <div className="p-5">
              <p className="text-xs text-gray-500">Purchases via codes</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">
                {summary.successful_purchases}
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500">Revenue via codes</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">
                {xaf(summary.revenue_xaf)}
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {top.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">
                No active codes yet.{" "}
                <Link href="/admin/promo-codes" className="font-semibold text-blue-600 hover:underline">
                  Create one
                </Link>{" "}
                to start tracking an influencer.
              </p>
            ) : (
              top.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold tracking-widest text-gray-900">
                      {item.code}
                    </p>
                    <p className="truncate text-xs text-gray-400">{item.label ?? "No label"}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums text-gray-900">
                      {item.successful_purchases}{" "}
                      <span className="text-xs font-medium text-gray-400">
                        {item.successful_purchases === 1 ? "purchase" : "purchases"}
                      </span>
                    </p>
                    <p className="text-xs tabular-nums text-gray-400">
                      {item.revenue_xaf === 0 ? "—" : xaf(item.revenue_xaf)}
                    </p>
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
