"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Whether the desktop dashboard sidebar is collapsed to icon-only. Persisted
 * to localStorage and broadcast via a window event — the same pattern
 * src/lib/auth.ts uses for readam_auth_change — rather than React Context,
 * which this project avoids for state (see AGENTS.md). Both the sidebar
 * itself and the layout that sizes its column read this hook independently
 * and stay in sync without prop drilling.
 */
const STORAGE_KEY = "readam_sidebar_collapsed";
const EVENT = "readam_sidebar_change";

function readStored(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function useSidebarCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(readStored());
    function onChange() {
      setCollapsed(readStored());
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = !readStored();
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* private browsing or storage disabled — the toggle still works for
         this render via the event below, it just won't persist. */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [collapsed, toggle];
}
