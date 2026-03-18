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
    <div className="min-h-screen bg-dashboard-grid bg-[size:28px_28px]">
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

      <div className="min-h-screen lg:pl-[300px]">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onExport={() => downloadTransactionsCsv(dashboard.transactions)}
          onRefresh={refresh}
          livePulse={dashboard.livePulse}
        />

        <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-[1500px] flex-col gap-5"
          >
            <section className="surface-panel overflow-hidden p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-accent/80">
                    Executive dashboard
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
                    Pulseboard keeps your operating picture live, ordered, and actionable.
                  </h1>
                  <p className="mt-3 text-sm text-foreground/70 sm:text-base">
                    Drag widgets, resize the layout, filter your mock finance data, and export
                    exactly the slice you are reviewing.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-foreground/70 sm:grid-cols-3">
                  <div className="rounded-2xl border border-stroke/15 bg-surface/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em]">Widgets</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{widgets.length}</p>
                  </div>
                  <div className="rounded-2xl border border-stroke/15 bg-surface/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em]">Snapshots</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {savedLayouts.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stroke/15 bg-surface/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em]">Theme</p>
                    <p className="mt-2 text-2xl font-semibold capitalize text-foreground">
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
