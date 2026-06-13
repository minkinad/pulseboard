"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { ErrorState } from "@/components/dashboard/error-state";
import { FiltersBar } from "@/components/dashboard/filters-bar";
import { LoadingState } from "@/components/dashboard/loading-state";
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

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [sidebarOpen]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-slate-50">
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

      <div className="relative min-h-screen lg:pl-[288px]">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onExport={() => downloadTransactionsCsv(dashboard.transactions)}
          onRefresh={refresh}
          livePulse={dashboard.livePulse}
        />

        <main className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-[1240px] flex-col gap-4"
          >
            <section className="flex flex-col gap-3 border-b border-stroke pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="tiny-label">Pulseboard</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Finance operations dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Transaction analytics, layout snapshots, and export controls for the active
                  review slice.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:w-[390px]">
                <div className="rounded-md border border-stroke bg-white px-3 py-2">
                  <p className="tiny-label">Widgets</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">{widgets.length}</p>
                </div>
                <div className="rounded-md border border-stroke bg-white px-3 py-2">
                  <p className="tiny-label">Layouts</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">
                    {savedLayouts.length}
                  </p>
                </div>
                <div className="rounded-md border border-stroke bg-white px-3 py-2">
                  <p className="tiny-label">Data</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">
                    {status === "loading" ? "..." : dashboard.transactions.length}
                  </p>
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
              ) : status === "loading" ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <LoadingState />
                </motion.div>
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
