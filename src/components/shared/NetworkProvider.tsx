"use client";

import useNetworkStatus from "@/hooks/useNetworkStatus";

export default function NetworkProvider() {
  useNetworkStatus();

  return null;
}