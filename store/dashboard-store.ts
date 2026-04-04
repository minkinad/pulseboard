"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { defaultFilters, defaultWidgets, widgetResizeOrder } from "@/lib/constants";
import { createSnapshotName } from "@/lib/utils";
import type {
  DashboardFilters,
  SavedLayoutSnapshot,
  WidgetLayoutItem,
} from "@/types/dashboard";

interface DashboardStore {
  filters: DashboardFilters;
  widgets: WidgetLayoutItem[];
  savedLayouts: SavedLayoutSnapshot[];
  updateFilter: <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K],
  ) => void;
  setSearch: (search: string) => void;
  reorderWidgets: (activeId: string, overId: string) => void;
  cycleWidgetSize: (widgetId: string, direction?: 1 | -1) => void;
  resetLayout: () => void;
  saveCurrentLayout: () => void;
  loadSavedLayout: (layoutId: string) => void;
  deleteSavedLayout: (layoutId: string) => void;
}

function arrayMoveLocal<T>(array: T[], fromIndex: number, toIndex: number) {
  const next = array.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      widgets: defaultWidgets,
      savedLayouts: [],
      updateFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),
      setSearch: (search) =>
        set((state) => ({
          filters: {
            ...state.filters,
            search,
          },
        })),
      reorderWidgets: (activeId, overId) =>
        set((state) => {
          const fromIndex = state.widgets.findIndex((widget) => widget.id === activeId);
          const toIndex = state.widgets.findIndex((widget) => widget.id === overId);

          if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
            return state;
          }

          return {
            widgets: arrayMoveLocal(state.widgets, fromIndex, toIndex),
          };
        }),
      cycleWidgetSize: (widgetId, direction = 1) =>
        set((state) => ({
          widgets: state.widgets.map((widget) => {
            if (widget.id !== widgetId) {
              return widget;
            }

            const sizes = widgetResizeOrder[widget.id] ?? ["standard", "wide"];
            const currentIndex = Math.max(sizes.indexOf(widget.size), 0);
            const nextIndex =
              (currentIndex + direction + sizes.length) % sizes.length;

            return {
              ...widget,
              size: sizes[nextIndex],
            };
          }),
        })),
      resetLayout: () => set({ widgets: defaultWidgets }),
      saveCurrentLayout: () =>
        set((state) => ({
          savedLayouts: [
            {
              id: `layout-${Date.now()}`,
              name: createSnapshotName(state.savedLayouts.length),
              createdAt: new Date().toISOString(),
              widgets: state.widgets,
            },
            ...state.savedLayouts,
          ].slice(0, 6),
        })),
      loadSavedLayout: (layoutId) =>
        set((state) => {
          const match = state.savedLayouts.find((layout) => layout.id === layoutId);
          return match ? { widgets: match.widgets } : state;
        }),
      deleteSavedLayout: (layoutId) =>
        set((state) => ({
          savedLayouts: state.savedLayouts.filter((layout) => layout.id !== layoutId),
        })),
    }),
    {
      name: "pulseboard-dashboard",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        widgets: state.widgets,
        savedLayouts: state.savedLayouts,
      }),
    },
  ),
);
