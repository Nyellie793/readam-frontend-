"use client";

import { useState } from "react";
import type { ChartPoint } from "@/types/dashboard.types";

interface ChartProps {
  title: string;
  subtitle?: string;
  data: ChartPoint[];
  variant?: "bar" | "line";
  period?: "weekly" | "monthly";
  onPeriodChange?: (period: "weekly" | "monthly") => void;
  /** Render placeholder bars instead of an empty chart while data loads. */
  loading?: boolean;
}

/**
 * Dependency-free chart placeholder. Renders real proportional bars/lines
 * from `data` so the layout looks production-ready immediately, while
 * staying trivial to swap for Recharts/Chart.js once real time-series
 * data is wired up later.
 */
export default function Chart({ title, subtitle, data, variant = "bar", period, onPeriodChange, loading = false }: ChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        {onPeriodChange && (
          <div className="flex items-center gap-1 rounded-full bg-gray-50 p-1 text-xs font-semibold text-gray-500">
            <button
              type="button"
              onClick={() => onPeriodChange("weekly")}
              className={`rounded-full px-3 py-1 transition-colors ${
                period === "monthly" ? "hover:text-gray-700" : "bg-white text-gray-900 shadow-sm"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("monthly")}
              className={`rounded-full px-3 py-1 transition-colors ${
                period === "monthly" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-8 flex h-48 items-end gap-3" aria-busy="true" aria-label="Loading chart">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div
                data-slot="skeleton"
                className="w-full rounded-t-lg"
                style={{ height: `${30 + ((i * 37) % 55)}%` }}
              />
            </div>
          ))}
        </div>
      ) : variant === "bar" ? (
        <div className={`mt-8 flex h-48 ${data.length > 10 ? "gap-1" : "gap-3"}`}>
          {data.map((point, i) => {
            const labelEvery = Math.max(1, Math.ceil(data.length / 8));
            const showLabel = i % labelEvery === 0 || i === data.length - 1;
            return (
              <div
                key={`${point.label}-${i}`}
                className="group flex flex-1 flex-col items-center gap-2"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="relative flex w-full flex-1 items-end">
                  {active === i && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white">
                      {point.value}
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      active === i ? "bg-blue-600" : "bg-blue-200"
                    }`}
                    style={{ height: `${(point.value / max) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {showLabel ? point.label : " "}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <svg viewBox="0 0 300 120" className="mt-6 h-40 w-full overflow-visible">
          <polyline
            fill="none"
            stroke="var(--color-primary, #2563EB)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data
              .map(
                (d, i) =>
                  `${(i / (data.length - 1)) * 300},${120 - (d.value / max) * 110}`
              )
              .join(" ")}
          />
          {data.map((d, i) => (
            <circle
              key={`${d.label}-${i}`}
              cx={(i / (data.length - 1)) * 300}
              cy={120 - (d.value / max) * 110}
              r={3}
              fill="#2563EB"
            />
          ))}
        </svg>
      )}
    </div>
  );
}
