"use client";

import { useDeferredValue, useEffect, useEffectEvent, useMemo, useState } from "react";

import financeData from "@/data/finance-data.json";
import { buildDashboardComputation } from "@/lib/dashboard-data";
import { useDashboardStore } from "@/store/dashboard-store";
import type { DashboardComputation, FinanceTransaction } from "@/types/dashboard";

type LoadState = "loading" | "ready" | "error";

function createLivePulse(): DashboardComputation["livePulse"] {
  return {
    activeStreams: 112,
    variance: 2.4,
    syncedAt: new Date().toISOString(),
  };
}

export function useDashboardData() {
  const filters = useDashboardStore((state) => state.filters);
  const deferredSearch = useDeferredValue(filters.search);

  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [livePulse, setLivePulse] = useState(createLivePulse);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError(null);

    const timer = window.setTimeout(() => {
      try {
        const parsed = financeData as FinanceTransaction[];

        if (!active) {
          return;
        }

        setTransactions(parsed);
        setStatus("ready");
        setLivePulse(createLivePulse());
      } catch (loadError) {
        if (!active) {
          return;
        }

        setStatus("error");
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The mock dataset could not be loaded.",
        );
      }
    }, 850);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [reloadKey]);

  const updateLivePulse = useEffectEvent(() => {
    setLivePulse((current) => {
      const drift = (Math.random() * 10 - 5) / 10;
      const streamDelta = Math.round(Math.random() * 8 - 3);

      return {
        activeStreams: Math.max(86, current.activeStreams + streamDelta),
        variance: Number((Math.max(-4.8, Math.min(8.2, current.variance + drift))).toFixed(1)),
        syncedAt: new Date().toISOString(),
      };
    });
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      updateLivePulse();
    }, 6500);

    return () => window.clearInterval(timer);
  }, [updateLivePulse]);

  const computed = useMemo(
    () =>
      buildDashboardComputation(
        transactions,
        {
          ...filters,
          search: deferredSearch,
        },
        livePulse,
      ),
    [
      transactions,
      filters.category,
      filters.dateRange,
      filters.sortBy,
      deferredSearch,
      livePulse,
    ],
  );

  return {
    ...computed,
    status,
    error,
    refresh: () => setReloadKey((current) => current + 1),
  };
}
