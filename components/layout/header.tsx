"use client";

import { startTransition } from "react";
import { Bell, Download, Menu, RefreshCw, Search } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { DashboardComputation } from "@/types/dashboard";

interface HeaderProps {
  onMenuClick: () => void;
  onExport: () => void;
  onRefresh: () => void;
  livePulse: DashboardComputation["livePulse"];
}

export function Header({ onMenuClick, onExport, onRefresh, livePulse }: HeaderProps) {
  const { search, setSearch } = useDashboardStore(
    useShallow((state) => ({
      search: state.filters.search,
      setSearch: state.setSearch,
    })),
  );

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 rounded-2xl border border-stroke bg-card px-4 py-3 sm:px-5">
        <button
          type="button"
          className="control-base lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              const next = event.target.value;
              startTransition(() => setSearch(next));
            }}
            placeholder="Search counterparties, notes, or categories"
            className="field-shell h-11 w-full pl-11 pr-4 text-sm text-slate-950 transition placeholder:text-slate-400 focus:border-slate-300"
            aria-label="Search dashboard data"
          />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-stroke bg-slate-50 px-3 py-2 text-sm text-slate-600 md:flex">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>{livePulse.activeStreams} live signals</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[11px] font-medium",
              livePulse.variance >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
            )}
          >
            {livePulse.variance >= 0 ? "+" : ""}
            {livePulse.variance.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="control-base" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button type="button" className="control-base" onClick={onExport}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button type="button" className="control-base px-3" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-slate-50 text-sm font-semibold text-slate-700">
            AB
          </div>
        </div>
      </div>
    </header>
  );
}
