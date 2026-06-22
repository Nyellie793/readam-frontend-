"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 1024;

/**
 * Reusable responsive hook (Task 6/7). Returns true once we know the
 * viewport is below the given breakpoint. Defaults to `false` during SSR
 * so server and first client render match.
 */
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const onChange = () => setIsMobile(window.innerWidth < breakpoint);
    onChange();

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
