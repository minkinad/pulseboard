"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, X } from "lucide-react";
import Image from "next/image";

import { sidebarNavigation } from "@/lib/constants";
import { formatTimeLabel } from "@/lib/format";
import type { SavedLayoutSnapshot } from "@/types/dashboard";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedLayouts: SavedLayoutSnapshot[];
  onLoadLayout: (layoutId: string) => void;
  onDeleteLayout: (layoutId: string) => void;
}

function SidebarContent({
  savedLayouts,
  onLoadLayout,
  onDeleteLayout,
  onClose,
}: Omit<SidebarProps, "isOpen">) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-stroke px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="overflow-hidden rounded-2xl border border-slate-950/10 bg-slate-950 p-1.5 shadow-soft">
            <Image
              src="/branding/pulseboard.png"
              alt="Pulseboard logo"
              width={52}
              height={52}
              className="h-[52px] w-[52px] rounded-xl object-cover"
              priority
            />
          </div>
          <div>
            <p className="tiny-label">Pulseboard</p>
            <h2 className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-slate-950">
              Analytics
            </h2>
          </div>
        </div>
        <button
          type="button"
          className="control-base lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="soft-card bg-slate-50 p-4 text-sm text-slate-600">
          <p className="tiny-label">Workspace</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">
            Review cashflow, adjust the layout, and keep a few saved dashboard states.
          </p>
        </div>

        <nav className="mt-6 space-y-2">
          {sidebarNavigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="soft-card px-4 py-3 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg border border-stroke bg-slate-50 p-2 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="tiny-label">Saved layouts</h3>
            <PanelLeftClose className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 space-y-3">
            {savedLayouts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stroke bg-slate-50 p-4 text-sm text-slate-500">
                Save your first layout snapshot from the filter bar to keep different dashboard setups.
              </div>
            ) : (
              savedLayouts.map((layout) => (
                <div
                  key={layout.id}
                  className="soft-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{layout.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Saved at {formatTimeLabel(layout.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onLoadLayout(layout.id)}
                        className="control-base px-3 py-1.5 text-xs"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteLayout(layout.id)}
                        className="control-base border-danger/20 px-3 py-1.5 text-xs text-danger hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-4 left-4 z-30 hidden w-[268px] overflow-hidden rounded-2xl border border-stroke bg-card lg:block">
        <SidebarContent {...props} />
      </aside>

      <AnimatePresence>
        {props.isOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={props.onClose}
              aria-label="Close sidebar overlay"
            />
            <motion.aside
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              exit={{ x: -340 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-3 left-3 z-50 w-[280px] overflow-hidden rounded-2xl border border-stroke bg-card lg:hidden"
            >
              <SidebarContent {...props} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
