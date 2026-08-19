"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

const DISMISSED_KEY = "readam_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Chrome/Edge/Android fire `beforeinstallprompt` and let a site trigger the
 * native install dialog programmatically. Safari (including iOS) never
 * fires it — there is no programmatic install API there — so the only way
 * to prompt an iOS user is to show them the manual "Share > Add to Home
 * Screen" steps. Both paths are handled here; nothing renders once the app
 * is already installed (standalone display mode) or the user dismissed it.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari's own non-standard flag for "launched from home screen"
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    if (isStandalone || dismissed) return;

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    if (iOS) setVisible(true);

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[100] mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:left-auto sm:right-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {isIOS ? <Share className="size-5" /> : <Download className="size-5" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900">Install ReadAM</p>
        {isIOS ? (
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Tap <Share className="mx-0.5 inline size-3.5 align-text-bottom" /> then
            &quot;Add to Home Screen&quot; for quick, full-screen access.
          </p>
        ) : (
          <>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Add ReadAM to your home screen for quick, full-screen access.
            </p>
            <button
              type="button"
              onClick={install}
              className="mt-2.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Install
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
