import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/types/dashboard.types";

interface StatCardsProps {
  stats: StatCardData[];
}

/**
 * Reusable overview metric grid. Pass any StatCardData[] in — this is
 * used on Dashboard Home, Courses, Students and Payments today, and can
 * consume live API data later with no markup changes.
 */
export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isDark = stat.tone === "dark";
        const isAccent = stat.tone === "accent";

        return (
          <div
            key={stat.id}
            className={cn(
              "rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
              isDark
                ? "border-transparent bg-[#0B1437] text-white"
                : isAccent
                ? "border-orange-100 bg-orange-50"
                : "border-gray-100 bg-white"
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  isDark
                    ? "bg-white/10 text-white"
                    : isAccent
                    ? "bg-orange-100 text-orange-600"
                    : "bg-blue-50 text-blue-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>

              {stat.delta && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold",
                    stat.trend === "up"
                      ? "bg-emerald-100 text-emerald-700"
                      : stat.trend === "down"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600",
                    isDark && "bg-white/10 text-white"
                  )}
                >
                  {stat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                  {stat.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                  {stat.delta}
                </span>
              )}
            </div>

            <p
              className={cn(
                "mt-4 text-2xl font-black",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              {stat.value}
            </p>
            <p className={cn("mt-1 text-xs font-semibold", isDark ? "text-white/60" : "text-gray-400")}>
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
