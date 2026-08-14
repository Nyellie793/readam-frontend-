"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to attach optimized passive touchstart and active touchend listeners.
 * Eliminates the 300ms click delay on mobile Safari while handling normal scroll fallback.
 */
export function useTapResponse(callback: () => void) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | any>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const diffX = Math.abs(touch.clientX - touchStartX);
      const diffY = Math.abs(touch.clientY - touchStartY);

      // If the touch moved less than 10px, treat it as a tap (not a scroll/swipe)
      if (diffX < 10 && diffY < 10) {
        // Prevent default to bypass browser click translation (which causes the 300ms delay)
        e.preventDefault();
        savedCallback.current();
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return ref;
}
