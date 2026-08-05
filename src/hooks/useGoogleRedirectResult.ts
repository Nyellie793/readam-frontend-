"use client";

import { useEffect, useRef } from "react";

const HANDOFF_COOKIE = "readam_google_credential";

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

/**
 * Completes a Google sign-in that came back through redirect mode.
 *
 * The popup flow hands the credential straight to the button's callback. On
 * mobile the popup is usually blocked, so GIS redirects instead and our
 * /api/auth/google route parks the credential in a short-lived cookie. This
 * picks it up and runs the same googleAuth() path, so both flows converge on
 * one piece of logic.
 *
 * @param onCredential same handler the button uses in popup mode
 */
export function useGoogleRedirectResult(onCredential: (idToken: string) => void) {
  // Guards against React 18 StrictMode double-invoking the effect, which would
  // otherwise fire the sign-in request twice.
  const consumedRef = useRef(false);
  const handlerRef = useRef(onCredential);

  useEffect(() => {
    handlerRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (consumedRef.current) return;

    const credential = readCookie(HANDOFF_COOKIE);
    if (!credential) return;

    consumedRef.current = true;
    // Single use: drop it before the exchange so a failure cannot leave a
    // stale token sitting in the jar for the next page load to retry.
    clearCookie(HANDOFF_COOKIE);

    // Strip the ?google=1 marker so a refresh does not look like a fresh
    // redirect return.
    const url = new URL(window.location.href);
    if (url.searchParams.has("google")) {
      url.searchParams.delete("google");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    handlerRef.current(credential);
  }, []);
}
