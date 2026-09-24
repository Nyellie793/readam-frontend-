"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import ADMIN from "@/services/admin.service";
import { errorMessage } from "@/lib/api";
import { xaf } from "@/lib/utils";
import type { AdminPromoCodeItem, PromoCodePurchaseItem } from "@/types/api.types";

const PAGE_SIZE = 20;

const statusVariant: Record<PromoCodePurchaseItem["status"], "success" | "warning" | "destructive"> = {
  successful: "success",
  pending: "warning",
  failed: "destructive",
  expired: "destructive",
};


interface PromoCodePurchasesDialogProps {
  /** The code to show purchases for; null closes the dialog. */
  promo: AdminPromoCodeItem | null;
  onClose: () => void;
}

/**
 * Every payment that carried one code, newest first. Failed and pending
 * attempts are listed too, so an admin can see a code that drives clicks
 * but not completed mobile-money prompts.
 */
export default function PromoCodePurchasesDialog({ promo, onClose }: PromoCodePurchasesDialogProps) {
  const [items, setItems] = useState<PromoCodePurchaseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The parent keys this component on the promo id, so a different code always
  // mounts a fresh dialog on page 1 — no reset effect needed here.
  const promoId = promo?.id ?? null;

  useEffect(() => {
    if (!promoId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    ADMIN.getPromoCodePurchases(promoId, page, PAGE_SIZE)
      .then((d) => {
        if (cancelled) return;
        setItems(d.items);
        setTotal(d.total);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Could not load purchases."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [promoId, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Dialog open={promo !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono tracking-widest">{promo?.code}</span>
            {promo?.label && <span className="text-sm font-normal text-gray-500">· {promo.label}</span>}
          </DialogTitle>
          <DialogDescription>
            {promo
              ? `${promo.successful_purchases} paid ${promo.successful_purchases === 1 ? "purchase" : "purchases"} · ${xaf(promo.revenue_xaf)} · ${promo.total_attempts} ${promo.total_attempts === 1 ? "attempt" : "attempts"} in total`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Student</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Course</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500">Amount</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                    No one has used this code yet.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.student_name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.course_title ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-900">{xaf(p.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
