"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin progress bar across the top of the viewport during navigation.
 *
 * loading.tsx already covers the wait once the new route starts rendering, but
 * there is a gap before that: the moment between the tap and the first frame
 * of the skeleton. On a slow connection that gap is where the app feels
 * unresponsive, so this fills it.
 *
 * It creeps toward 90% rather than animating linearly to 100%, because the
 * duration is unknown — a bar that reaches the end and sits there reads as
 * stuck. It only completes when the pathname actually changes.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const firstRender = useRef(true);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  // Any click on a same-origin link starts the bar. Listening at the document
  // avoids wrapping every Link in the app.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Let the browser handle modified clicks and new-tab intents.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") return;
      // External links leave the app; the browser shows its own indicator.
      if (/^[a-z]+:\/\//i.test(href) && !href.startsWith(window.location.origin)) return;
      // Navigating to where we already are produces no route change, so the
      // bar would never be completed by the pathname effect below.
      if (href === pathname) return;

      clearTimers();
      setVisible(true);
      setProgress(8);
      // Ease toward 90 and stop. The remaining 10% is the render landing.
      [[80, 25], [220, 45], [500, 65], [900, 80], [1500, 90]].forEach(([delay, value]) => {
        timers.current.push(setTimeout(() => setProgress(value), delay));
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      clearTimers();
    };
  }, [pathname]);

  // The route changed, so the navigation finished.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    clearTimers();
    setProgress(100);
    const hide = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
    return () => clearTimeout(hide);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-orange-400 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
        style={{
          width: `${progress}%`,
          transition: "width 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
