"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Landmark,
  AlertTriangle,
} from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import Chart from "@/components/shared/Chart";
import ADMIN from "@/services/admin.service";
import type {
  AdminAnalyticsResponse,
  AdminRevenueTrendResponse,
} from "@/types/api.types";

/** XAF has no minor unit, so amounts are whole francs. */
function xaf(amount: number): string {
  return `${amount.toLocaleString()} XAF`;
}

/** Large sums are unreadable in full on a stat card. */
function compact(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 10_000) return `${Math.round(amount / 1000)}k`;
  return amount.toLocaleString();
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
  sub?: React.ReactNode;
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
        <span className={`flex size-8 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">{value}</p>
      {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

export default function RevenuePage() {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  const [trend, setTrend] = useState<{ label: string; value: number }[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      ADMIN.getAnalytics(10) as Promise<AdminAnalyticsResponse>,
      ADMIN.getRevenueTrend(days) as Promise<AdminRevenueTrendResponse>,
    ])
      .then(([analytics, t]) => {
        if (cancelled) return;
        setData(analytics);
        setTrend(t.points);
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError((e as { detail?: string })?.detail ?? "Could not load revenue.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const sourceTotal = data?.by_source.reduce((sum, s) => sum + s.amount, 0) ?? 0;
  // A network failing more than a fifth of its attempts is losing real money
  // and is worth surfacing rather than leaving in a table to be noticed.
  const strugglingNetwork = data?.by_medium.find(
    (m) => m.successful + m.failed >= 10 && m.success_rate < 80
  );

  return (
    <>
      <Topbar title="Revenue" description="Where the money comes from, and where it goes." />

      <div className="space-y-6 p-4 sm:p-6">
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* Headline */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="This month"
                value={xaf(data.revenue.this_month)}
                icon={data.revenue.change_pct !== null && data.revenue.change_pct < 0 ? TrendingDown : TrendingUp}
                tone={data.revenue.change_pct !== null && data.revenue.change_pct < 0 ? "orange" : "teal"}
                sub={
                  data.revenue.change_pct === null ? (
                    // Nothing last month, so there is no percentage to show.
                    <span>No revenue last month to compare</span>
                  ) : (
                    <span
                      className={
                        data.revenue.change_pct >= 0 ? "text-teal-600" : "text-orange-500"
                      }
                    >
                      {data.revenue.change_pct >= 0 ? "+" : ""}
                      {data.revenue.change_pct}% vs last month
                    </span>
                  )
                }
              />
              <Stat
                label="All time"
                value={xaf(data.revenue.all_time)}
                icon={Landmark}
                sub="Total successful payments"
              />
              <Stat
                label="Platform earned"
                value={xaf(data.flow.platform_earned)}
                icon={Wallet}
                tone="blue"
                sub="After tutor earnings"
              />
              <Stat
                label="Owed to tutors"
                value={xaf(data.flow.pending_payouts)}
                icon={Clock}
                tone="orange"
                sub={`${xaf(data.flow.paid_out)} already paid`}
              />
            </div>

            {strugglingNetwork && (
              <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-500" />
                <p className="text-sm text-orange-900">
                  <span className="font-semibold uppercase">{strugglingNetwork.medium}</span>{" "}
                  payments are succeeding only {strugglingNetwork.success_rate}% of the time
                  ({strugglingNetwork.failed} failed). Students are likely being charged
                  nothing and giving up, which looks like lost interest rather than a
                  payment problem.
                </p>
              </div>
            )}

            {/* Trend */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Revenue over time</h3>
                  <p className="text-xs text-gray-400">Successful payments per day</p>
                </div>
                <div className="flex gap-1.5">
                  {[7, 30, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        days === d
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              {trend.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  No payments in this period.
                </p>
              ) : (
                <Chart title="" data={trend} />
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Where it comes from */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900">Where revenue comes from</h3>
                <p className="text-xs text-gray-400">Successful payments, all time</p>

                {data.by_source.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">No payments yet.</p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {data.by_source.map((s) => {
                      const pct = sourceTotal ? (s.amount / sourceTotal) * 100 : 0;
                      return (
                        <div key={s.source}>
                          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                            <span className="font-medium text-gray-700">{s.label}</span>
                            <span className="tabular-nums text-gray-500">
                              {xaf(s.amount)}
                              <span className="ml-1.5 text-gray-400">
                                ({s.count} {s.count === 1 ? "payment" : "payments"})
                              </span>
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-blue-600 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Where it goes */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900">Where it goes</h3>
                <p className="text-xs text-gray-400">Split of everything collected</p>

                <div className="mt-5 space-y-3">
                  {[
                    { label: "Platform keeps", value: data.flow.platform_earned, tone: "bg-blue-600" },
                    { label: "Tutors earn", value: data.flow.tutor_net, tone: "bg-teal-500" },
                  ].map((row) => {
                    const total = data.flow.platform_earned + data.flow.tutor_net;
                    const pct = total ? (row.value / total) * 100 : 0;
                    return (
                      <div key={row.label}>
                        <div className="mb-1.5 flex items-baseline justify-between text-xs">
                          <span className="font-medium text-gray-700">{row.label}</span>
                          <span className="tabular-nums text-gray-500">
                            {xaf(row.value)}{" "}
                            <span className="text-gray-400">({Math.round(pct)}%)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div
                            className={`h-2 rounded-full ${row.tone}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 border-t border-gray-50 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paid out to tutors</span>
                    <span className="font-semibold tabular-nums text-gray-800">
                      {xaf(data.flow.paid_out)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Still owed</span>
                    <span className="font-semibold tabular-nums text-orange-600">
                      {xaf(data.flow.pending_payouts)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment health */}
            {data.by_medium.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900">Payment success by network</h3>
                <p className="text-xs text-gray-400">
                  A failing network costs sales without anything in the product changing
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.by_medium.map((m) => (
                    <div key={m.medium} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold uppercase text-gray-700">
                          {m.medium}
                        </span>
                        <span
                          className={`text-sm font-black tabular-nums ${
                            m.success_rate >= 90
                              ? "text-teal-600"
                              : m.success_rate >= 80
                                ? "text-gray-700"
                                : "text-orange-500"
                          }`}
                        >
                          {m.success_rate}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {m.successful} succeeded · {m.failed} failed
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course performance */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900">Best performing courses</h3>
                <p className="text-xs text-gray-400">
                  Revenue counts direct purchases. Bundle buyers show as students without
                  per-course revenue.
                </p>
              </div>

              {data.top_courses.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-gray-400">
                  No published courses yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Course
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Tutor
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                          Price
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                          Students
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.top_courses.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <Link
                              href={`/admin/courses/${c.id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {c.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{c.tutor_name ?? "—"}</td>
                          <td className="px-5 py-4 text-right tabular-nums text-gray-600">
                            {c.price === 0 ? "Free" : compact(c.price)}
                          </td>
                          <td className="px-5 py-4 text-right tabular-nums text-gray-600">
                            {c.students}
                          </td>
                          <td className="px-5 py-4 text-right font-semibold tabular-nums text-gray-900">
                            {c.revenue === 0 ? "—" : xaf(c.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
