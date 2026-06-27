import Topbar from "@/components/admin/Topbar";
import StatCards from "@/components/admin/StatCards";
import Chart from "@/components/admin/Chart";
import TransactionsTable from "@/components/admin/tables/TransactionsTable";
import { Download } from "lucide-react";
import { PAYMENTS_STATS, REVENUE_TRENDS, TRANSACTIONS } from "@/data/admin-mock";

export default function PaymentsPage() {
  return (
    <>
      <Topbar title="Financial Overview" />
      <div className="space-y-6 p-4 sm:p-6">
        <StatCards stats={PAYMENTS_STATS} />
        <Chart title="Revenue Trends" subtitle="Weekly vs. projection" data={REVENUE_TRENDS} variant="line" />
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-xs text-gray-400">Live feed of all financial movements</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
          <div className="p-5">
            <TransactionsTable rows={TRANSACTIONS} />
          </div>
        </div>
      </div>
    </>
  );
}
