"use client";

import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EarningItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600",
  paid_out: "bg-teal-50 text-teal-600",
};


interface EarningsHistoryTableProps {
  earnings: EarningItem[];
  courseTitles: Record<string, string>;
}

export default function EarningsHistoryTable({ earnings, courseTitles }: EarningsHistoryTableProps) {
  const t = useTranslations("tutor");
  const STATUS_LABELS: Record<string, string> = {
    pending: t("pending"),
    paid_out: t("paidOut"),
  };
  if (earnings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white py-12 text-center shadow-sm">
        <Receipt className="size-8 text-gray-300" />
        <p className="text-sm text-gray-500">{t("noSales")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs font-semibold text-gray-500">
              <th className="px-5 py-3">{t("course")}</th>
              <th className="px-5 py-3">Gross</th>
              <th className="px-5 py-3">{t("platformFee")}</th>
              <th className="px-5 py-3">Net</th>
              <th className="px-5 py-3">{t("status")}</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0">
                <td className="max-w-[220px] truncate px-5 py-3.5 font-medium text-gray-900">
                  {courseTitles[item.course_id] ?? t("course")}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{item.gross_amount.toLocaleString()} XAF</td>
                <td className="px-5 py-3.5 text-gray-400">-{item.platform_fee.toLocaleString()} XAF</td>
                <td className="px-5 py-3.5 font-semibold text-gray-900">{item.net_amount.toLocaleString()} XAF</td>
                <td className="px-5 py-3.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_STYLES[item.status])}>
                    {STATUS_LABELS[item.status] ?? item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-400">{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
