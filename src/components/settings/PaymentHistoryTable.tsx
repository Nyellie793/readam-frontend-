"use client";

import { Badge } from "@/components/ui/Badge";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const INVOICES = [
  { id: "EDF-9928-2026", date: "Jul 15, 2026", method: "Orange Money", amount: "15,000 XAF", status: "Paid" },
  { id: "EDF-9812-2026", date: "Jun 15, 2026", method: "Orange Money", amount: "15,000 XAF", status: "Paid" },
  { id: "EDF-9703-2026", date: "May 15, 2026", method: "MTN MoMo", amount: "15,000 XAF", status: "Paid" },
  { id: "EDF-8821-2026", date: "Apr 10, 2026", method: "MTN MoMo", amount: "25,000 XAF", status: "Paid" },
];

export default function PaymentHistoryTable() {
  const handleDownload = (id: string) => {
    toast.success(`Downloading invoice ${id}...`);
  };

  return (
    <div className="border border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
      <div className="border-b border-gray-50 p-5">
        <h3 className="text-base font-bold text-gray-900">Billing History</h3>
        <p className="text-xs text-gray-500 mt-1">Download your past receipts and invoice details.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 border-collapse">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4">Invoice ID</th>
              <th scope="col" className="px-6 py-4">Billing Date</th>
              <th scope="col" className="px-6 py-4">Method</th>
              <th scope="col" className="px-6 py-4">Amount</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-950 flex items-center gap-2">
                  <FileText className="size-4 text-gray-400" />
                  {inv.id}
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{inv.date}</td>
                <td className="px-6 py-4 text-xs text-gray-600">{inv.method}</td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-800">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDownload(inv.id)}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    aria-label={`Download invoice ${inv.id}`}
                  >
                    <Download className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
