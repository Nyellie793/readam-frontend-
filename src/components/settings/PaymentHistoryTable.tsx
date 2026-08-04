"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import STUDENT from "@/services/student.service";
import type { PaymentListItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<string, string> = {
  successful: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  failed: "bg-red-50 text-red-700 border-red-100",
  expired: "bg-gray-100 text-gray-500 border-gray-200",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function PaymentHistoryTable() {
  const t = useTranslations("settings");
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    STUDENT.getPayments()
      .then((data) => setPayments(data.items))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="border border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
      <div className="border-b border-gray-50 p-5">
        <h3 className="text-base font-bold text-gray-900">{t("billingHistory")}</h3>
        <p className="text-xs text-gray-500 mt-1">Every course purchase and AI credit pack you&apos;ve bought.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 border-collapse">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4">Item</th>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">{t("method")}</th>
              <th scope="col" className="px-6 py-4">{t("amount")}</th>
              <th scope="col" className="px-6 py-4">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr><td colSpan={5} className="px-6 py-6 text-center text-xs text-gray-400">Loading…</td></tr>
            )}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-6 text-center text-xs text-gray-400">{t("noPayments")}</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-950 flex items-center gap-2">
                  <FileText className="size-4 text-gray-400 shrink-0" />
                  {p.course_title ?? p.product_name ?? "Purchase"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{formatDate(p.created_at)}</td>
                <td className="px-6 py-4 text-xs text-gray-600 capitalize">{p.medium ?? "—"}</td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-800">{p.amount.toLocaleString()} XAF</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold border capitalize ${STATUS_STYLES[p.status] ?? STATUS_STYLES.pending}`}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
