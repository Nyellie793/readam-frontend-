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

let cachedRaw: string | null = null;
let cachedUser: User | null = null;

function getSnapshot(): User | null {
  // Called on every render, so the parsed object is memoised against the raw
  // string. Returning a fresh object each time would loop forever.
  const raw = typeof window === "undefined" ? null : localStorage.getItem("readam_user");
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedUser = getStoredUser();
  }
  return cachedUser;
}

function getServerSnapshot(): User | null {
  return EMPTY_SNAPSHOT;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function useStoredUser(): User | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Two-letter initials for an avatar fallback. */
export function initialsOf(fullName: string | null | undefined, fallback = "ST"): string {
  if (!fullName) return fallback;
  const letters = fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return letters || fallback;
}
