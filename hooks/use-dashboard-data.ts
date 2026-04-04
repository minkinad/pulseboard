"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { buildDashboardComputation } from "@/lib/dashboard-data";
import {
  createLivePulse,
  evolveLivePulse,
  loadFinanceTransactions,
} from "@/lib/finance-data";
import { useDashboardStore } from "@/store/dashboard-store";
import type { FinanceTransaction } from "@/types/dashboard";

type LoadState = "ready" | "error";

function readFinanceDataset(): {
  error: string | null;
  status: LoadState;
  transactions: FinanceTransaction[];
} {
  try {
    return {
      error: null,
      status: "ready",
      transactions: loadFinanceTransactions(),
    };
  } catch (loadError) {
    return {
      error:
        loadError instanceof Error
          ? loadError.message
          : "The finance dataset could not be loaded.",
      status: "error",
      transactions: [],
    };
  }
}

export function useDashboardData() {
  const filters = useDashboardStore((state) => state.filters);
  const deferredSearch = useDeferredValue(filters.search);

  const [dataset, setDataset] = useState(readFinanceDataset);
  const [livePulse, setLivePulse] = useState(createLivePulse);
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
    const timer = window.setInterval(() => {
      setLivePulse((current) => evolveLivePulse(current));
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const computed = useMemo(
    () => buildDashboardComputation(dataset.transactions, computationFilters, livePulse),
    [dataset.transactions, computationFilters, livePulse],
  );

  return {
    ...computed,
    status: dataset.status,
    error: dataset.error,
    refresh: () => {
      setDataset(readFinanceDataset());
      setLivePulse(createLivePulse());
    },
  };
}
