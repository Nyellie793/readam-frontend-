"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Ticket, TicketSlash, Users, Wallet } from "lucide-react";
import StatCards from "@/components/admin/StatCards";
import { Badge } from "@/components/ui/Badge";
import ADMIN from "@/services/admin.service";
import { errorMessage } from "@/lib/api";
import { cn, xaf } from "@/lib/utils";
import type {
  AdminCourseSalesItem,
  CourseSalesSort,
  CourseSalesTotals,
} from "@/types/api.types";
import type { StatCardData } from "@/types/dashboard.types";

const PAGE_SIZE = 20;

const SORTS: { value: CourseSalesSort; label: string }[] = [
  { value: "purchases", label: "Most bought" },
  { value: "revenue", label: "Most revenue" },
  { value: "students", label: "Most students" },
  { value: "newest", label: "Newest" },
];

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All courses" },
  { value: "published", label: "Published" },
  { value: "pending_review", label: "Pending review" },
  { value: "draft", label: "Draft" },
  { value: "rejected", label: "Rejected" },
];

const statusVariant: Record<AdminCourseSalesItem["status"], "success" | "warning" | "muted" | "destructive"> = {
  published: "success",
  pending_review: "warning",
  draft: "muted",
  rejected: "destructive",
};


function pct(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${Math.round((part / whole) * 100)}%`;
}

/**
 * Every course with how many people bought it, split into purchases made
 * with a promo code and without. `purchases` are confirmed direct payments;
 * `students` are active enrolments, which also count bundle buyers and
 * grants, so the two are shown side by side rather than reconciled.
 */
export default function SalesByCourseContent() {
  const [items, setItems] = useState<AdminCourseSalesItem[]>([]);
  const [totals, setTotals] = useState<CourseSalesTotals | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<CourseSalesSort>("purchases");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Debounced so typing in the search box does not fire a request per key.
    const timer = setTimeout(() => {
      ADMIN.getSalesByCourse({ page, pageSize: PAGE_SIZE, sort, status, search })
        .then((d) => {
          if (cancelled) return;
          setItems(d.items);
          setTotals(d.totals);
          setTotal(d.total);
          setError(null);
        })
        .catch((e) => {
          if (!cancelled) setError(errorMessage(e, "Could not load course sales."));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [page, sort, status, search]);

  const stats: StatCardData[] = totals
    ? [
        {
          id: "purchases",
          label: "Course purchases",
          value: String(totals.purchases),
          icon: ShoppingBag,
          tone: "dark",
        },
        {
          id: "with",
          label: `With a promo code (${pct(totals.purchases_with_promo, totals.purchases)})`,
          value: String(totals.purchases_with_promo),
          icon: Ticket,
        },
        {
          id: "without",
          label: `Without a code (${pct(totals.purchases_without_promo, totals.purchases)})`,
          value: String(totals.purchases_without_promo),
          icon: TicketSlash,
        },
        {
          id: "revenue",
          label: "Course revenue",
          value: xaf(totals.revenue),
          icon: Wallet,
          tone: "accent",
        },
      ]
    : [];

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      {loading && !totals ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        totals && (
          <>
            <StatCards stats={stats} />
            <p className="-mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <Users className="size-3.5" />
              {totals.students.toLocaleString()} active enrolments across all courses, including
              bundle buyers and free or granted access, which never show as a purchase.
            </p>
          </>
        )
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by course title..."
              className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by course status"
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 outline-none focus:border-blue-500"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="flex gap-1.5">
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    setSort(s.value);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    sort === s.value
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="px-5 pt-4 text-sm text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Course</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Price</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Bought</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">With code</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Without</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Students</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Revenue</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Last sale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">
                    No courses match.
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {c.title}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                        <span>{c.tutor_name ?? "—"}</span>
                        {c.status !== "published" && (
                          <Badge variant={statusVariant[c.status]} className="px-2 py-0 text-[10px]">
                            {c.status.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-gray-600">
                      {c.price === 0 ? "Free" : xaf(c.price)}
                    </td>
                    <td className="px-5 py-4 text-right text-base font-black tabular-nums text-gray-900">
                      {c.purchases}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-gray-700">
                      {c.purchases_with_promo}
                      {c.purchases > 0 && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({pct(c.purchases_with_promo, c.purchases)})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-gray-700">
                      {c.purchases_without_promo}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-gray-600">
                      {c.students}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-gray-900">
                      {c.revenue === 0 ? "—" : xaf(c.revenue)}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {c.last_purchase_at ? new Date(c.last_purchase_at).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                ))
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
              Page {page} of {totalPages} · {total} {total === 1 ? "course" : "courses"}
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
    </>
  );
}
