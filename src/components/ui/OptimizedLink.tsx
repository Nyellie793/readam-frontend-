"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { startMeasure } from "@/lib/performance";

interface OptimizedLinkProps extends React.ComponentProps<typeof Link> {
  prefetchRoute?: boolean;
}

/**
 * An optimized Link component that prefetches route assets on hover (desktop) or touchstart (mobile).
 * Enforces touch-action: manipulation to eliminate click delay on iOS Safari.
 */
export default function OptimizedLink({
  href,
  onClick,
  prefetchRoute = true,
  style,
  ...props
}: OptimizedLinkProps) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !prefetchRoute) return;

    const hrefStr = typeof href === "string" ? href : href.pathname || "";
    // Only prefetch relative internal routes
    const isInternal =
      hrefStr &&
      !hrefStr.startsWith("http") &&
      !hrefStr.startsWith("mailto:") &&
      !hrefStr.startsWith("tel:") &&
      !hrefStr.startsWith("#");

    if (!isInternal) return;

    const handlePrefetch = () => {
      try {
        router.prefetch(hrefStr);
      } catch (err) {
        // Quietly fail if router is not ready
      }
    };

    // Prefetch immediately on touch start (mobile) or pointer hover (desktop)
    el.addEventListener("touchstart", handlePrefetch, { passive: true });
    el.addEventListener("pointerenter", handlePrefetch, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handlePrefetch);
      el.removeEventListener("pointerenter", handlePrefetch);
    };
  }, [href, router, prefetchRoute]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Record start of navigation measurement
    const hrefStr = typeof href === "string" ? href : href.pathname || "";
    if (hrefStr && !hrefStr.startsWith("#")) {
      startMeasure("navigation");
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={handleLinkClick}
      style={{
        touchAction: "manipulation",
        ...style,
      }}
      {...props}
    />
  );
}
