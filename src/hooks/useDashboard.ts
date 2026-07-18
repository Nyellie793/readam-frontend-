"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboard.service";

export default function useDashboard() {
  const [dashboard, setDashboard] = useState<unknown>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    dashboard,
    loading,
  };
}