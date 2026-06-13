"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function useNetworkStatus() {
  useEffect(() => {

    const online = () => {
      toast.success("Connection restored.");
    };

    const offline = () => {
      toast.error(
        "No internet connection."
      );
    };

    window.addEventListener(
      "online",
      online
    );

    window.addEventListener(
      "offline",
      offline
    );

    return () => {
      window.removeEventListener(
        "online",
        online
      );

      window.removeEventListener(
        "offline",
        offline
      );
    };

  }, []);
}