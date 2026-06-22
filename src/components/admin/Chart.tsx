"use client";

import { useState } from "react";
import type { ChartPoint } from "@/types/dashboard.types";

interface ChartProps {
  title: string;
  subtitle?: string;
  data: ChartPoint[];
  variant?: "bar" | "line";
}

/**
 * Dependency-free chart placeholder. Renders real proportional bars/lines
 * from `data` so the layout looks production-ready immediately, while
 * staying trivial to swap for Recharts/Chart.js once real time-series
 * data is wired up later.
 */
export default function Chart({ title, subtitle, data, variant = "bar" }: ChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-gray-50 p-1 text-xs font-semibold text-gray-500">
          <button type="button" className="rounded-full bg-white px-3 py-1 text-gray-900 shadow-sm">
            Weekly
          </button>
          <button type="button" className="rounded-full px-3 py-1 hover:text-gray-700">
            Monthly
          </button>
        </div>
      </div>

      {variant === "bar" ? (
        <div className="mt-8 flex h-48 items-end gap-3">
          {data.map((point, i) => (
            <div
              key={point.label}
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
              <span className="text-[11px] font-medium text-gray-400">{point.label}</span>
            </div>
          ))}
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
              key={d.label}
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
