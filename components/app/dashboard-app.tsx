"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ErrorState } from "@/components/dashboard/error-state";
import { FiltersBar } from "@/components/dashboard/filters-bar";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { downloadTransactionsCsv } from "@/lib/export";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const widgets = useDashboardStore((state) => state.widgets);
  const savedLayouts = useDashboardStore((state) => state.savedLayouts);
  const saveCurrentLayout = useDashboardStore((state) => state.saveCurrentLayout);
  const loadSavedLayout = useDashboardStore((state) => state.loadSavedLayout);
  const deleteSavedLayout = useDashboardStore((state) => state.deleteSavedLayout);
  const resetLayout = useDashboardStore((state) => state.resetLayout);
  const theme = useDashboardStore((state) => state.theme);

  const { status, error, refresh, ...dashboard } = useDashboardData();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-dashboard-grid bg-[size:26px_26px] opacity-50" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-success/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        savedLayouts={savedLayouts}
        onLoadLayout={(layoutId) => {
          loadSavedLayout(layoutId);
          setSidebarOpen(false);
        }}
        onDeleteLayout={deleteSavedLayout}
      />

      <div className="relative min-h-screen lg:pl-[320px]">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onExport={() => downloadTransactionsCsv(dashboard.transactions)}
          onRefresh={refresh}
          livePulse={dashboard.livePulse}
        />

        <main className="px-4 pb-16 pt-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-[1180px] flex-col gap-6"
          >
            <section className="surface-panel overflow-hidden px-6 py-7 sm:px-8">
              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr] xl:items-end">
                <div className="max-w-3xl">
                  <p className="tiny-label">Executive dashboard</p>
                  <h1 className="mt-4 max-w-[18ch] text-[clamp(2rem,4vw,3.45rem)] font-semibold leading-[1.04]">
                    Pulseboard keeps your operating picture live, ordered, and actionable.
                  </h1>
                  <p className="mt-4 max-w-[60ch] text-sm leading-7 text-foreground/70 sm:text-base">
                    Drag widgets, resize the layout, filter your mock finance data, and export
                    exactly the slice you are reviewing.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-foreground/70 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="soft-card p-4">
                    <p className="tiny-label">Widgets</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">{widgets.length}</p>
                  </div>
                  <div className="soft-card p-4">
                    <p className="tiny-label">Snapshots</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">
                      {savedLayouts.length}
                    </p>
                  </div>
                  <div className="soft-card p-4">
                    <p className="tiny-label">Theme</p>
                    <p className="mt-3 text-3xl font-semibold capitalize text-foreground">
                      {theme}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <FiltersBar
              categories={dashboard.categories}
              resultCount={dashboard.transactions.length}
              onSaveLayout={saveCurrentLayout}
              onResetLayout={resetLayout}
            />

            <AnimatePresence mode="wait">
              {status === "loading" ? (
                <DashboardSkeleton key="loading" />
              ) : status === "error" ? (
                <ErrorState key="error" message={error ?? "Unknown loading error."} onRetry={refresh} />
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <DashboardGrid theme={theme} data={dashboard} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
