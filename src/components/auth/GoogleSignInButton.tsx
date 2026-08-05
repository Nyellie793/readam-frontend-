"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback?: (response: { credential: string }) => void;
            ux_mode?: "popup" | "redirect";
            login_uri?: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "small" | "medium" | "large";
              shape?: "rectangular" | "pill";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with";
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
}

export default function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const renderedRef = useRef(false);

  /**
   * Callers pass an inline arrow (`onCredential={(t) => googleAuth(t)}`), so its
   * identity changes on every render. Holding it in a ref keeps it out of the
   * effect's dependencies — otherwise the effect re-ran constantly and called
   * renderButton repeatedly into the same node, which is what made the button
   * flicker or vanish.
   */
  const callbackRef = useRef(onCredential);
  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  const render = useCallback(() => {
    if (renderedRef.current) return;
    if (!CLIENT_ID || !containerRef.current || !window.google) return;

    /**
     * Popup mode returns the credential straight to this callback, which is
     * what we want when it works. On mobile, Safari's tracking prevention
     * routinely blocks the popup and GIS falls back to redirect mode on its
     * own — but with no login_uri it POSTed to the current page, which only
     * answers GET, so sign-up died on a blank gsi/transform screen.
     *
     * Choosing redirect explicitly on touch devices means the fallback is a
     * route we actually own. Desktop keeps the nicer popup.
     */
    const preferRedirect =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: none) and (pointer: coarse)").matches === true;

    if (preferRedirect) {
      // Keep the query string: /signup?role=tutor resolves the role server
      // side, and dropping it would silently sign every mobile tutor up as a
      // student.
      const returnTo = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        ux_mode: "redirect",
        login_uri: `${window.location.origin}/api/auth/google?return_to=${returnTo}`,
      });
    } else {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        ux_mode: "popup",
        callback: (response) => callbackRef.current(response.credential),
      });
    }

    // Match the surrounding form instead of a fixed 300px, which overflowed
    // narrow phones and looked misaligned against full-width inputs.
    const width = Math.round(containerRef.current.getBoundingClientRect().width) || 320;

    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      width,
      text: "continue_with",
    });

    renderedRef.current = true;
    setReady(true);
  }, []);

  /**
   * next/script only fires onLoad for the load it initiates. Navigating between
   * /login and /signup client-side reuses the already-loaded script, so onLoad
   * never fired again and the button silently never appeared. Poll briefly for
   * the global instead, which covers both the first load and every reuse.
   */
  useEffect(() => {
    if (!CLIENT_ID) return;
    if (window.google) {
      render();
      return;
    }
    const started = Date.now();
    const timer = setInterval(() => {
      if (window.google) {
        render();
        clearInterval(timer);
      } else if (Date.now() - started > 10_000) {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [render]);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        title="Google sign-in isn't configured yet — set NEXT_PUBLIC_GOOGLE_CLIENT_ID"
        className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-medium text-gray-400"
      >
        Sign in with Google (not configured)
      </button>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={render}
      />
      {/* Reserve the button's height so the form does not jump when it renders. */}
      <div className="relative min-h-[44px] w-full">
        {!ready && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
          />
        )}
        <div ref={containerRef} className="flex w-full justify-center" />
      </div>
    </>
  );
}
