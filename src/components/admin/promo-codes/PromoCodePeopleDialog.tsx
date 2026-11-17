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
import type { AdminPromoCodeItem, ReferredPersonItem, ReferredPurchase } from "@/types/api.types";

const PAGE_SIZE = 20;

const statusVariant: Record<ReferredPurchase["status"], "success" | "warning" | "destructive"> = {
  successful: "success",
  pending: "warning",
  failed: "destructive",
  expired: "destructive",
};

interface PromoCodePeopleDialogProps {
  /** The code to show people for; null closes the dialog. */
  promo: AdminPromoCodeItem | null;
  onClose: () => void;
}

/**
 * Everyone a code brought in — those who signed up with it, including anyone
 * who has not bought yet, and those who only paid with it — with every payment
 * it carried. Unlike the referrer's own page this includes failed and pending
 * attempts, so an admin can tell a code that converts from one that does not.
 */
export default function PromoCodePeopleDialog({ promo, onClose }: PromoCodePeopleDialogProps) {
  const [items, setItems] = useState<ReferredPersonItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  // True from the start: the parent keys this dialog per code, so it mounts
  // already about to fetch, and starting false flashed the empty state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Keyed on the promo id by the parent, so a different code mounts a fresh
  // dialog on page 1 and no reset effect is needed.
  const promoId = promo?.id ?? null;

  useEffect(() => {
    if (!promoId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    ADMIN.getPromoCodePeople(promoId, page, PAGE_SIZE)
      .then((d) => {
        if (cancelled) return;
        setItems(d.items);
        setTotal(d.total);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Could not load people."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [promoId, page, attempt]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Dialog open={promo !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="font-mono tracking-widest">{promo?.code}</span>
            {promo?.owner && (
              <span className="text-sm font-normal text-gray-500">· {promo.owner.full_name}</span>
            )}
            {!promo?.owner && promo?.label && (
              <span className="text-sm font-normal text-gray-500">· {promo.label}</span>
            )}
          </DialogTitle>
          <DialogDescription>
            {promo
              ? `${promo.signups} signed up · ${promo.buyers} bought · ${promo.successful_purchases} paid purchases`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-red-500">{error}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        )}

        <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-gray-100">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            !error && (
              <p className="px-4 py-8 text-center text-sm text-gray-400">
                No one has signed up with or used this code yet.
              </p>
            )
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map((p) => (
                <li key={p.user_id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{p.full_name}</p>
                    <p className="text-xs text-gray-400">
                      Joined {new Date(p.joined_at).toLocaleDateString()} ·{" "}
                      {p.signed_up_with_code ? "signed up with the code" : "used it at checkout"}
                    </p>
                  </div>
                  {p.purchases.length === 0 ? (
                    <p className="mt-1 text-xs text-gray-400">No purchases yet</p>
                  ) : (
                    <ul className="mt-1.5 space-y-1">
                      {p.purchases.map((x) => (
                        <li key={x.payment_id} className="flex items-center gap-2 text-xs text-gray-700">
                          <Badge variant={statusVariant[x.status]}>{x.status}</Badge>
                          <span className="min-w-0 flex-1 truncate">{x.course_title ?? "—"}</span>
                          <span className="shrink-0 tabular-nums text-gray-500">
                            {x.amount === null ? "" : `${x.amount.toLocaleString()} XAF`}
                          </span>
                          <span className="shrink-0 text-gray-400">
                            {new Date(x.created_at).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
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
