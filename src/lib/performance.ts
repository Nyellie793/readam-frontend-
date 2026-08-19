"use client";

/**
 * Start measuring a specific user interaction or navigation.
 */
export function startMeasure(name: string) {
  if (typeof window !== "undefined" && window.performance) {
    try {
      // Clear previous marks
      window.performance.clearMarks(`${name}-start`);
      window.performance.clearMarks(`${name}-end`);
      window.performance.clearMeasures(name);
      
      window.performance.mark(`${name}-start`);
    } catch (e) {
      console.warn("[PERF] Failed to start mark:", e);
    }
  }
}

/**
 * End measuring and compare the duration against a budget (in milliseconds).
 *
 * The budget only means anything in production. In `next dev`, Turbopack
 * compiles each route on its first visit, which alone can take seconds —
 * that's compiler latency, not app slowness, and it's absent once deployed.
 * Logging it as a "violation" in dev is a false alarm, so the check is
 * skipped there; the marks/measures still get recorded for the browser's own
 * Performance panel.
 */
export function endMeasure(name: string, budgetMs: number) {
  if (typeof window !== "undefined" && window.performance) {
    try {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);

      if (process.env.NODE_ENV !== "production") return;

      const entries = window.performance.getEntriesByName(name);
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        const duration = lastEntry.duration;

        if (duration > budgetMs) {
          console.warn(
            `%c[PERF BUDGET VIOLATION] ${name} took ${duration.toFixed(2)}ms (Budget: ${budgetMs}ms)`,
            "color: #ff3333; font-weight: bold;"
          );
        } else {
          console.log(
            `%c[PERF BUDGET MET] ${name} took ${duration.toFixed(2)}ms (Budget: ${budgetMs}ms)`,
            "color: #00b300; font-weight: bold;"
          );
        }
      }
    } catch (e) {
      // Quietly ignore if marks don't exist
    }
  }
}
