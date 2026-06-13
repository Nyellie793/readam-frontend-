"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function LoadingTimeout() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navigator.onLine) {
        toast.error(
          "No internet connection detected.",
          {
            description:
             "Please check your network and try again"
          }
        );
      } else {
        toast.warning(
          "The server is taking longer than expected.",
          {
            description:
             "Our Servers may be busy"
          }
        );
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}