"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ErrorState } from "@/components/dashboard/error-state";
import { FiltersBar } from "@/components/dashboard/filters-bar";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { downloadTransactionsCsv } from "@/lib/export";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    widgets,
    savedLayouts,
    saveCurrentLayout,
    loadSavedLayout,
    deleteSavedLayout,
    resetLayout,
  } = useDashboardStore(
    useShallow((state) => ({
      widgets: state.widgets,
      savedLayouts: state.savedLayouts,
      saveCurrentLayout: state.saveCurrentLayout,
      loadSavedLayout: state.loadSavedLayout,
      deleteSavedLayout: state.deleteSavedLayout,
      resetLayout: state.resetLayout,
    })),
  );

  const { status, error, refresh, ...dashboard } = useDashboardData();

  return (
    <div className="min-h-screen bg-white">
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

      <div className="min-h-screen lg:pl-[288px]">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onExport={() => downloadTransactionsCsv(dashboard.transactions)}
          onRefresh={refresh}
          livePulse={dashboard.livePulse}
        />

        <main className="px-4 pb-12 pt-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-[1180px] flex-col gap-6"
          >
            <section className="surface-panel px-6 py-6 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="max-w-3xl">
                  <p className="tiny-label">Dashboard</p>
                  <h1 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-slate-950">
                    Simple analytics overview for your finance flow.
                  </h1>
                  <p className="mt-3 max-w-[62ch] text-sm leading-7 text-slate-600 sm:text-base">
                    A clean, light dashboard with flexible widgets, quick filters, and export for
                    the slice you are reviewing right now.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="soft-card p-4">
                    <p className="tiny-label">Widgets</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{widgets.length}</p>
                  </div>
                  <div className="soft-card p-4">
                    <p className="tiny-label">Snapshots</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{savedLayouts.length}</p>
                  </div>
                  <div className="soft-card p-4">
                    <p className="tiny-label">Mode</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">Static</p>
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
              {status === "error" ? (
                <ErrorState key="error" message={error ?? "Unknown loading error."} onRetry={refresh} />
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <DashboardGrid data={dashboard} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
