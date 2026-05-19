"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  dateRangeOptions,
  defaultFilters,
  defaultWidgets,
  sortOptions,
  widgetResizeOrder,
} from "@/lib/constants";
import { cloneWidgets, createSnapshotName } from "@/lib/utils";
import type {
  DashboardFilters,
  SavedLayoutSnapshot,
  WidgetLayoutItem,
  WidgetSize,
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

const widgetTemplates = new Map(defaultWidgets.map((widget) => [widget.id, widget]));
const validDateRanges = new Set(dateRangeOptions.map((option) => option.value));
const validSortOptions = new Set(sortOptions.map((option) => option.value));
const validWidgetSizes = new Set<WidgetSize>([
  "compact",
  "standard",
  "wide",
  "hero",
  "tall",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeFilters(rawFilters: unknown): DashboardFilters {
  if (!isObject(rawFilters)) {
    return defaultFilters;
  }

  const dateRange = validDateRanges.has(rawFilters.dateRange as DashboardFilters["dateRange"])
    ? (rawFilters.dateRange as DashboardFilters["dateRange"])
    : defaultFilters.dateRange;
  const sortBy = validSortOptions.has(rawFilters.sortBy as DashboardFilters["sortBy"])
    ? (rawFilters.sortBy as DashboardFilters["sortBy"])
    : defaultFilters.sortBy;
  const category = isNonEmptyString(rawFilters.category)
    ? rawFilters.category.trim()
    : defaultFilters.category;
  const search = typeof rawFilters.search === "string" ? rawFilters.search : defaultFilters.search;

  return {
    dateRange,
    category,
    sortBy,
    search,
  };
}

function sanitizeWidget(rawWidget: unknown) {
  if (!isObject(rawWidget) || !isNonEmptyString(rawWidget.id)) {
    return null;
  }

  const template = widgetTemplates.get(rawWidget.id.trim());

  if (!template) {
    return null;
  }

  const allowedSizes = widgetResizeOrder[template.id] ?? [template.size];
  const size =
    validWidgetSizes.has(rawWidget.size as WidgetSize) &&
    allowedSizes.includes(rawWidget.size as WidgetSize)
      ? (rawWidget.size as WidgetSize)
      : template.size;

  return {
    ...template,
    size,
  };
}

function sanitizeWidgets(rawWidgets: unknown) {
  if (!Array.isArray(rawWidgets)) {
    return cloneWidgets(defaultWidgets);
  }

  const seen = new Set<string>();
  const sanitized = rawWidgets
    .map(sanitizeWidget)
    .filter((widget): widget is WidgetLayoutItem => widget !== null)
    .filter((widget) => {
      if (seen.has(widget.id)) {
        return false;
      }

      seen.add(widget.id);
      return true;
    });

  for (const template of defaultWidgets) {
    if (!seen.has(template.id)) {
      sanitized.push({ ...template });
    }
  }

  return sanitized;
}

function sanitizeSavedLayout(rawLayout: unknown) {
  if (!isObject(rawLayout) || !isNonEmptyString(rawLayout.id)) {
    return null;
  }

  const createdAt =
    typeof rawLayout.createdAt === "string" && !Number.isNaN(Date.parse(rawLayout.createdAt))
      ? rawLayout.createdAt
      : new Date().toISOString();

  return {
    id: rawLayout.id.trim(),
    name: isNonEmptyString(rawLayout.name) ? rawLayout.name.trim() : "Saved layout",
    createdAt,
    widgets: sanitizeWidgets(rawLayout.widgets),
  };
}

function sanitizeSavedLayouts(rawLayouts: unknown) {
  if (!Array.isArray(rawLayouts)) {
    return [];
  }

  const seen = new Set<string>();

  return rawLayouts
    .map(sanitizeSavedLayout)
    .filter((layout): layout is SavedLayoutSnapshot => layout !== null)
    .filter((layout) => {
      if (seen.has(layout.id)) {
        return false;
      }

      seen.add(layout.id);
      return true;
    })
    .slice(0, 6);
}

function sanitizePersistedState(rawState: unknown) {
  if (!isObject(rawState)) {
    return {
      filters: defaultFilters,
      widgets: cloneWidgets(defaultWidgets),
      savedLayouts: [],
    };
  }

  return {
    filters: sanitizeFilters(rawState.filters),
    widgets: sanitizeWidgets(rawState.widgets),
    savedLayouts: sanitizeSavedLayouts(rawState.savedLayouts),
  };
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
      widgets: cloneWidgets(defaultWidgets),
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
      resetLayout: () => set({ widgets: cloneWidgets(defaultWidgets) }),
      saveCurrentLayout: () =>
        set((state) => ({
          savedLayouts: [
            {
              id: `layout-${Date.now()}`,
              name: createSnapshotName(state.savedLayouts.length),
              createdAt: new Date().toISOString(),
              widgets: cloneWidgets(state.widgets),
            },
            ...state.savedLayouts,
          ].slice(0, 6),
        })),
      loadSavedLayout: (layoutId) =>
        set((state) => {
          const match = state.savedLayouts.find((layout) => layout.id === layoutId);
          return match ? { widgets: cloneWidgets(match.widgets) } : state;
        }),
      deleteSavedLayout: (layoutId) =>
        set((state) => ({
          savedLayouts: state.savedLayouts.filter((layout) => layout.id !== layoutId),
        })),
    }),
    {
      name: "pulseboard-dashboard",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedState(persistedState),
      }),
      partialize: (state) => ({
        filters: state.filters,
        widgets: state.widgets,
        savedLayouts: state.savedLayouts,
      }),
    },
  ),
);
