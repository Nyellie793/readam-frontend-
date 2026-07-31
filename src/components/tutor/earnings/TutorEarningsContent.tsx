"use client";

import { useCallback, useEffect, useState } from "react";
import { Wallet, TrendingUp, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonTable from "@/components/skeletons/SkeletonTable";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import RequestPayoutCard from "./RequestPayoutCard";
import EarningsHistoryTable from "./EarningsHistoryTable";
import PayoutHistoryTable from "./PayoutHistoryTable";
import type { EarningItem, EarningsSummaryResponse, PayoutItem } from "@/types/api.types";

type Tab = "earnings" | "payouts";

export default function TutorEarningsContent() {
  const [summary, setSummary] = useState<EarningsSummaryResponse | null>(null);
  const [earnings, setEarnings] = useState<EarningItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [courseTitles, setCourseTitles] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("earnings");

  const load = useCallback(() => {
    return Promise.all([
      TUTOR.getEarningsSummary(),
      TUTOR.listEarnings(),
      TUTOR.listPayouts(),
      TUTOR.listMyCourses(),
    ]).then(([summaryRes, earningsRes, payoutsRes, courses]) => {
      setSummary(summaryRes);
      setEarnings(earningsRes.items);
      setPayouts(payoutsRes.items);
      setCourseTitles(Object.fromEntries(courses.map((c) => [c.id, c.title])));
    });
  }, []);

  useEffect(() => {
    load()
      .catch((err) => setError(errorMessage(err, "Couldn't load your earnings.")))
      .finally(() => setLoading(false));
  }, [load]);

  function refresh() {
    load().catch((err) => setError(errorMessage(err, "Couldn't refresh your earnings.")));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <SkeletonTable rows={4} columns={5} />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  const stats = [
    { label: "Total Earned", value: summary?.total_earned ?? 0, icon: TrendingUp, tint: "text-blue-600 bg-blue-50" },
    { label: "Pending Balance", value: summary?.pending_balance ?? 0, icon: Wallet, tint: "text-orange-600 bg-orange-50" },
    { label: "Total Paid Out", value: summary?.total_paid_out ?? 0, icon: CheckCircle2, tint: "text-teal-600 bg-teal-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500">Track your course sales and withdraw your balance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className={`flex size-9 items-center justify-center rounded-xl ${stat.tint}`}>
              <stat.icon className="size-4.5" />
            </div>
            <p className="mt-3 text-xl font-extrabold text-gray-900">{stat.value.toLocaleString()} XAF</p>
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RequestPayoutCard pendingBalance={summary?.pending_balance ?? 0} onPayoutRequested={refresh} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("earnings")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "earnings" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Sales History
            </button>
            <button
              type="button"
              onClick={() => setTab("payouts")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "payouts" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Payout History
            </button>
          </div>

          {tab === "earnings" ? (
            <EarningsHistoryTable earnings={earnings} courseTitles={courseTitles} />
          ) : (
            <PayoutHistoryTable payouts={payouts} />
          )}
        </div>
      </div>
    </div>
  );
}
