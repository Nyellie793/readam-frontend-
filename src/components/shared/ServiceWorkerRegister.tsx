"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js. Skipped outside production — a caching service
 * worker fighting Turbopack's dev-mode HMR is a well-known source of
 * "why isn't my change showing up" confusion, and the worker only exists to
 * serve the offline fallback and cache production build output anyway.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installability and the rest of the app work without it; a failed
      // registration (unsupported browser, blocked storage) isn't fatal.
    });
  }, []);

  return null;
}
