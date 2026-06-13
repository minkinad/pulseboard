"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

import { fetchFinanceTransactions, isAbortError } from "@/lib/api/transactions";
import { buildDashboardComputation } from "@/lib/dashboard-data";
import { createLivePulse, evolveLivePulse } from "@/lib/finance-data";
import { useDashboardStore } from "@/store/dashboard-store";
import type { FinanceTransaction } from "@/types/dashboard";

type LoadState = "loading" | "ready" | "error";

interface DatasetState {
  error: string | null;
  status: LoadState;
  transactions: FinanceTransaction[];
}

export function useDashboardData() {
  const filters = useDashboardStore((state) => state.filters);
  const deferredSearch = useDeferredValue(filters.search);

  const [dataset, setDataset] = useState<DatasetState>({
    error: null,
    status: "loading",
    transactions: [],
  });
  const [livePulse, setLivePulse] = useState(createLivePulse);
  const [refreshKey, setRefreshKey] = useState(0);
  const computationFilters = useMemo(
    () => ({
      category: filters.category,
      dateRange: filters.dateRange,
      sortBy: filters.sortBy,
      search: deferredSearch,
    }),
    [filters.category, filters.dateRange, filters.sortBy, deferredSearch],
  );

  useEffect(() => {
    const controller = new AbortController();

    setDataset((current) => ({
      ...current,
      error: null,
      status: current.transactions.length > 0 ? "ready" : "loading",
    }));

    fetchFinanceTransactions(controller.signal)
      .then((transactions) => {
        setDataset({
          error: null,
          status: "ready",
          transactions,
        });
      })
      .catch((loadError) => {
        if (isAbortError(loadError)) {
          return;
        }

        setDataset({
          error:
            loadError instanceof Error
              ? loadError.message
              : "The finance dataset could not be loaded.",
          status: "error",
          transactions: [],
        });
      });

    return () => controller.abort();
  }, [refreshKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLivePulse((current) => evolveLivePulse(current));
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const computed = useMemo(
    () => buildDashboardComputation(dataset.transactions, computationFilters, livePulse),
    [dataset.transactions, computationFilters, livePulse],
  );

  const refresh = useCallback(() => {
    setLivePulse(createLivePulse());
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    ...computed,
    status: dataset.status,
    error: dataset.error,
    refresh,
  };
}
