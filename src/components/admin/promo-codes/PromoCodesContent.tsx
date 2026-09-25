"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  ShoppingBag,
  Ticket,
  TicketCheck,
  Wallet,
} from "lucide-react";
import StatCards from "@/components/admin/StatCards";
import PromoCodePurchasesDialog from "@/components/admin/promo-codes/PromoCodePurchasesDialog";
import { Badge } from "@/components/ui/Badge";
import ADMIN from "@/services/admin.service";
import { errorMessage } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { cn, xaf } from "@/lib/utils";
import type { AdminPromoCodeItem, PromoCodeSummary } from "@/types/api.types";
import type { StatCardData } from "@/types/dashboard.types";

const PAGE_SIZE = 20;


/** Share of attempts that turned into a paid purchase. Null when nothing was tried. */
function conversion(item: AdminPromoCodeItem): number | null {
  if (item.total_attempts === 0) return null;
  return Math.round((item.successful_purchases / item.total_attempts) * 100);
}

/**
 * Admin view of influencer codes: create one, hand it out, and watch how many
 * course purchases it brings in. Codes are deactivated rather than deleted so
 * the purchases already attributed to them stay on the books.
 */
export default function PromoCodesContent() {
  const [items, setItems] = useState<AdminPromoCodeItem[]>([]);
  const [summary, setSummary] = useState<PromoCodeSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [includeInactive, setIncludeInactive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminPromoCodeItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ADMIN.getPromoCodes(page, includeInactive, PAGE_SIZE)
      .then((d) => {
        if (cancelled) return;
        setItems(d.items);
        setSummary(d.summary);
        setTotal(d.total);
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Could not load promo codes."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, includeInactive]);

  async function handleCreate() {
    const code = newCode.trim();
    if (code.length < 3) return;
    setCreating(true);
    try {
      const created = await ADMIN.createPromoCode({
        code,
        label: newLabel.trim() || null,
      });
      setItems((prev) => [created, ...prev]);
      setTotal((n) => n + 1);
      setSummary((s) =>
        s ? { ...s, total_codes: s.total_codes + 1, active_codes: s.active_codes + 1 } : s
      );
      setNewCode("");
      setNewLabel("");
      toast.success(`Code ${created.code} created. Share it with the influencer.`);
    } catch (e) {
      toast.error(errorMessage(e, "Could not create that code."));
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(item: AdminPromoCodeItem) {
    setBusyId(item.id);
    try {
      const updated = await ADMIN.updatePromoCode(item.id, { is_active: !item.is_active });
      if (!includeInactive && !updated.is_active) {
        // The table is only showing active codes, so the row it just left must go.
        setItems((prev) => prev.filter((p) => p.id !== item.id));
        setTotal((n) => Math.max(0, n - 1));
      } else {
        setItems((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
      }
      setSummary((s) =>
        s ? { ...s, active_codes: s.active_codes + (updated.is_active ? 1 : -1) } : s
      );
      toast.success(
        updated.is_active
          ? `${updated.code} is active again.`
          : `${updated.code} deactivated. Its purchases are kept.`
      );
    } catch (e) {
      toast.error(errorMessage(e, "Could not update that code."));
    } finally {
      setBusyId(null);
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied.`);
    } catch {
      toast.error("Could not copy. Select the code and copy it by hand.");
    }
  }

  /** The influencer's own stats page. Private: the token is the only key. */
  function statsLink(item: AdminPromoCodeItem): string {
    return `${SITE_URL}/promo/${item.share_token}`;
  }

  async function copyStatsLink(item: AdminPromoCodeItem) {
    try {
      await navigator.clipboard.writeText(statsLink(item));
      toast.success(`Stats link for ${item.code} copied. Send it to the influencer.`);
    } catch {
      toast.error("Could not copy the link.");
    }
  }

  async function resetStatsLink(item: AdminPromoCodeItem) {
    // One click would otherwise cut off a link the influencer already has.
    if (
      !window.confirm(
        `Reset the stats link for ${item.code}? The link they have now will stop working and you will need to send them the new one.`
      )
    ) {
      return;
    }
    setBusyId(item.id);
    try {
      const updated = await ADMIN.rotatePromoShareToken(item.id);
      setItems((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
      toast.success(`New stats link issued for ${updated.code}. The old link no longer works.`);
    } catch (e) {
      toast.error(errorMessage(e, "Could not reset the link."));
    } finally {
      setBusyId(null);
    }
  }

  const stats: StatCardData[] = summary
    ? [
        {
          id: "purchases",
          label: "Purchases via promo codes",
          value: String(summary.successful_purchases),
          icon: ShoppingBag,
          tone: "dark",
        },
        {
          id: "revenue",
          label: "Revenue via promo codes",
          value: xaf(summary.revenue_xaf),
          icon: Wallet,
        },
        {
          id: "active",
          label: "Active codes",
          value: String(summary.active_codes),
          icon: TicketCheck,
        },
        {
          id: "total",
          label: "All codes",
          value: String(summary.total_codes),
          icon: Ticket,
          tone: "accent",
        },
      ]
    : [];

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      {loading && !summary ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        summary && <StatCards stats={stats} />
      )}

      {/* Create */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900">New promo code</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Hand this to an influencer. Students type it at checkout; it changes nothing about
          the price, it only records who sent them.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
            placeholder="CODE, e.g. JANE10"
            maxLength={32}
            autoCapitalize="characters"
            spellCheck={false}
            disabled={creating}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 font-mono text-sm font-bold uppercase tracking-widest text-gray-900 outline-none placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-56"
          />
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
            placeholder="Who holds it, e.g. Jane Doe (TikTok)"
            maxLength={120}
            disabled={creating}
            className="h-10 w-full flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={creating || newCode.trim().length < 3}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Create code
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray-400">
          3–32 characters: letters, digits, hyphen or underscore. Saved in upper case.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Codes and what they brought in</h3>
            <p className="text-xs text-gray-400">
              Best-performing first. Attempts include failed and pending payments.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => {
                setIncludeInactive(e.target.checked);
                setPage(1);
              }}
              className="size-4 rounded border-gray-300 accent-blue-600"
            />
            Show inactive codes
          </label>
        </div>

        {error && <p className="px-5 pt-4 text-sm text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Code</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Purchases</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Revenue</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Attempts</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Last used</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                    No promo codes yet. Create one above and share it.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const rate = conversion(item);
                  return (
                    <tr key={item.id} className={cn("hover:bg-gray-50", !item.is_active && "opacity-60")}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold tracking-widest text-gray-900">
                            {item.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => void copyCode(item.code)}
                            aria-label={`Copy ${item.code}`}
                            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">{item.label ?? "No label"}</p>
                        <div className="mt-1.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => void copyStatsLink(item)}
                            title={statsLink(item)}
                            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                          >
                            <Link2 className="size-3" />
                            Copy stats link
                          </button>
                          <button
                            type="button"
                            onClick={() => void resetStatsLink(item)}
                            disabled={busyId === item.id}
                            aria-label={`Reset the stats link for ${item.code}`}
                            title="Issue a new link; the old one stops working"
                            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                          >
                            <RefreshCw className="size-3" />
                            Reset
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-base font-black tabular-nums text-gray-900">
                        {item.successful_purchases}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-gray-900">
                        {item.revenue_xaf === 0 ? "—" : xaf(item.revenue_xaf)}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-gray-600">
                        {item.total_attempts}
                        {rate !== null && (
                          <span className="ml-1.5 text-xs text-gray-400">({rate}% paid)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {item.last_used_at ? new Date(item.last_used_at).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={item.is_active ? "success" : "muted"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewing(item)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                          >
                            Purchases
                          </button>
                          <button
                            type="button"
                            onClick={() => void toggleActive(item)}
                            disabled={busyId === item.id}
                            className={cn(
                              "rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50",
                              item.is_active
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            )}
                          >
                            {item.is_active ? "Deactivate" : "Reactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
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
      </div>

      {/* Keyed so each code opens a fresh dialog on page 1, with no reset effect. */}
      <PromoCodePurchasesDialog
        key={viewing?.id ?? "closed"}
        promo={viewing}
        onClose={() => setViewing(null)}
      />
    </>
  );
}
