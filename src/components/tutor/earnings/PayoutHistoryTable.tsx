"use client";

import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PayoutItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600",
  successful: "bg-teal-50 text-teal-600",
  failed: "bg-red-50 text-red-500",
};

interface PayoutHistoryTableProps {
  payouts: PayoutItem[];
}

export default function PayoutHistoryTable({ payouts }: PayoutHistoryTableProps) {
  const t = useTranslations("tutor");
  if (payouts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white py-12 text-center shadow-sm">
        <Wallet className="size-8 text-gray-300" />
        <p className="text-sm text-gray-500">{t("noPayouts")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs font-semibold text-gray-500">
              <th className="px-5 py-3">{t("amount")}</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">{t("levelMedium")}</th>
              <th className="px-5 py-3">{t("status")}</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3.5 font-semibold text-gray-900">{item.amount.toLocaleString()} XAF</td>
                <td className="px-5 py-3.5 text-gray-600">{item.phone}</td>
                <td className="px-5 py-3.5 capitalize text-gray-600">{item.medium ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS_STYLES[item.status])}>
                    {item.status}
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
