"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, TrendingUp, Users, Receipt } from "lucide-react";
import ADMIN from "@/services/admin.service";
import type { CourseSalesReport } from "@/types/api.types";

/**
 * Sales for one course over time, with a CSV export.
 *
 * Revenue counts direct purchases. Bundle buyers enrol without a per-course
 * payment row, so enrolments can exceed sales — both are shown rather than
 * reconciled, because the gap is real and flattening it would misstate one of
 * them.
 */
export default function CourseSalesPanel({ courseId }: { courseId: string }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<CourseSalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (ADMIN.getCourseSales(courseId, days) as Promise<CourseSalesReport>)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError((e as { detail?: string })?.detail ?? "Could not load sales.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, days]);

  function downloadCsv() {
    if (!data) return;
    // Built by hand rather than pulled from a library: three columns of digits
    // and ISO dates need no escaping, and a dependency for this would be silly.
    const rows = [
      ["Date", "Sales", `Revenue (${data.currency})`],
      ...data.points.map((p) => [p.date, String(p.sales), String(p.revenue)]),
      [],
      ["Course", data.title],
      ["Tutor", data.tutor_name ?? ""],
      ["Price", String(data.price)],
      ["Total sales", String(data.total_sales)],
      ["Total revenue", String(data.total_revenue)],
      ["Active enrolments", String(data.total_enrollments)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-sales-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const max = Math.max(...(data?.points ?? []).map((p) => p.revenue), 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Sales over time</h3>
          <p className="text-xs text-gray-400">Direct purchases of this course</p>
        </div>
        <div className="flex items-center gap-1.5">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                days === d
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {d}d
            </button>
          ))}
          <button
            onClick={downloadCsv}
            disabled={!data}
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="size-3.5" />
            CSV
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && error && <p className="py-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && data && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Revenue", value: `${data.total_revenue.toLocaleString()} ${data.currency}`, icon: TrendingUp },
              { label: "Sales", value: String(data.total_sales), icon: Receipt },
              { label: "Enrolments", value: String(data.total_enrollments), icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-gray-100 px-4 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <Icon className="size-3.5" />
                  {label}
                </p>
                <p className="mt-1 text-lg font-black tabular-nums text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {data.total_enrollments > data.total_sales && (
            <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-[11px] leading-relaxed text-blue-800">
              More enrolments than sales is expected: students who bought a bundle
              are enrolled without a payment recorded against this course.
            </p>
          )}

          <div className="mt-5 flex h-32 items-end gap-px">
            {data.points.map((p) => (
              <div
                key={p.date}
                title={`${p.date}: ${p.revenue.toLocaleString()} ${data.currency} (${p.sales})`}
                className="flex-1 rounded-t bg-blue-500/80 transition-colors hover:bg-blue-600"
                style={{ height: `${Math.max(2, (p.revenue / max) * 100)}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-gray-400">
            <span>{data.points[0]?.date}</span>
            <span>{data.points[data.points.length - 1]?.date}</span>
          </div>
        </>
      )}
    </div>
  );
}
