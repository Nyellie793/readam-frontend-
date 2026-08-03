"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import Chart from "@/components/shared/Chart";
import { Badge } from "@/components/ui/Badge";
import { Wallet, CreditCard, CheckCircle2, ShieldAlert } from "lucide-react";
import ADMIN from "@/services/admin.service";
import type {
  AdminPaymentStatsResponse,
  AdminRevenueTrendResponse,
  AdminTransactionItem,
  AdminTransactionsResponse,
} from "@/types/api.types";
import type { StatCardData, ChartPoint } from "@/types/dashboard.types";

function xaf(n: number): string {
  return `${n.toLocaleString()} XAF`;
}

const statusVariant: Record<string, "success" | "warning" | "destructive"> = {
  successful: "success",
  pending: "warning",
  failed: "destructive",
  expired: "destructive",
};

export default function PaymentsPage() {
  const [stats, setStats] = useState<AdminPaymentStatsResponse | null>(null);
  const [trend, setTrend] = useState<ChartPoint[]>([]);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [transactions, setTransactions] = useState<AdminTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ADMIN.getPaymentStats() as Promise<AdminPaymentStatsResponse>,
      ADMIN.getTransactions(1, 20) as Promise<AdminTransactionsResponse>,
    ])
      .then(([s, t]) => {
        setStats(s);
        setTransactions(t.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    (ADMIN.getRevenueTrend(period === "weekly" ? 7 : 30) as Promise<AdminRevenueTrendResponse>)
      .then((d) => setTrend(d.points))
      .catch(() => null);
  }, [period]);

  const statCards: StatCardData[] = stats
    ? [
        { id: "revenue", label: "Platform Revenue", value: xaf(stats.platform_revenue), icon: CreditCard, tone: "dark" },
        { id: "processed", label: "Total Processed", value: xaf(stats.total_processed), icon: Wallet },
        { id: "paid", label: "Tutor Payouts Paid", value: xaf(stats.paid_out), icon: CheckCircle2 },
        { id: "pending", label: "Pending Payouts", value: xaf(stats.pending_payouts), icon: ShieldAlert, tone: "accent" },
      ]
    : [];

  return (
    <>
      <Topbar title="Financial Overview" />
      <div className="space-y-6 p-4 sm:p-6">
        {!loading && <StatCards stats={statCards} />}

        <Chart
          title="Revenue Trend"
          subtitle="Successful payments per day"
          data={trend}
          variant="line"
          period={period}
          onPeriodChange={setPeriod}
        />

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900">Recent Transactions</h3>
            <p className="text-xs text-gray-400">Student payments and tutor payouts, most recent first</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Party</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Description</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Type</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-100" />
                        </td>
                      </tr>
                    ))
                  : transactions.length === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                          No transactions yet.
                        </td>
                      </tr>
                    )
                  : transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-900">{t.party}</td>
                        <td className="px-5 py-4 text-gray-600">{t.description}</td>
                        <td className="px-5 py-4 capitalize text-gray-600">{t.type}</td>
                        <td className={`px-5 py-4 text-right font-semibold ${t.type === "payout" ? "text-red-600" : "text-emerald-600"}`}>
                          {t.type === "payout" ? "-" : "+"}
                          {xaf(t.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={statusVariant[t.status] ?? "warning"}>{t.status}</Badge>
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {new Date(t.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
