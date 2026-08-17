"use client";

import { useSyncExternalStore } from "react";
import { getStoredUser } from "@/lib/auth";
import type { User } from "@/types/user.types";

/**
 * The signed-in user, read safely on both server and client.
 *
 * localStorage does not exist during SSR. Reading it during render produces
 * different HTML on server and client and triggers a hydration mismatch;
 * reading it in an effect avoids that but costs an extra render and trips
 * react-hooks/set-state-in-effect.
 *
 * useSyncExternalStore is the intended tool: it returns the server snapshot
 * (null) during SSR and the real value on the client, with no effect and no
 * mismatch. It also re-renders on `storage` events, so signing out in one tab
 * updates the others.
 */
const EMPTY_SNAPSHOT: User | null = null;

let cachedUser: User | null = null;
let initialized = false;

function getSnapshot(): User | null {
  // Memoize user retrieval in memory to prevent slow localStorage reads during React render passes
  if (!initialized && typeof window !== "undefined") {
    cachedUser = getStoredUser();
    initialized = true;
  }
  return cachedUser;
}

function getServerSnapshot(): User | null {
  return EMPTY_SNAPSHOT;
}

function subscribe(onChange: () => void): () => void {
  const handleAuthChange = () => {
    cachedUser = getStoredUser();
    onChange();
  };

  window.addEventListener("storage", handleAuthChange);
  window.addEventListener("readam_auth_change", handleAuthChange);

  return () => {
    window.removeEventListener("storage", handleAuthChange);
    window.removeEventListener("readam_auth_change", handleAuthChange);
  };
}

export function useStoredUser(): User | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Two-letter initials for an avatar fallback. */

// Lives in a plain module so server components can call it too.
export { initialsOf } from "@/lib/initials";
