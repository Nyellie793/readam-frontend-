"use client";

import { useEffect } from "react";
import { storeReferralCode } from "@/lib/referral";

/**
 * Remembers a `?ref=CODE` the visitor arrived with, so it is still there when
 * they get round to signing up. Renders nothing.
 *
 * Read from window.location in an effect rather than useSearchParams: that
 * hook opts the whole page out of prerendering unless it sits in a Suspense
 * boundary, and this runs in the root layout.
 */
export default function ReferralCapture() {
  useEffect(() => {
    storeReferralCode(new URLSearchParams(window.location.search).get("ref"));
  }, []);
  return null;
}
