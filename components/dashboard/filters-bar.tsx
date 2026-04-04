"use client";

import { RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { dateRangeOptions, sortOptions } from "@/lib/constants";
import { useDashboardStore } from "@/store/dashboard-store";

interface FiltersBarProps {
  categories: string[];
  resultCount: number;
  onSaveLayout: () => void;
  onResetLayout: () => void;
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-[180px] flex-col gap-2 text-sm">
      <span className="tiny-label">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-shell h-11 px-4 text-sm text-slate-950 transition focus:border-slate-300"
      >
        {children}
      </select>
    </label>
  );
}

export function FiltersBar({
  categories,
  resultCount,
  onSaveLayout,
  onResetLayout,
}: FiltersBarProps) {
  const { filters, updateFilter } = useDashboardStore(
    useShallow((state) => ({
      filters: state.filters,
      updateFilter: state.updateFilter,
    })),
  );

  return (
    <section className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-stroke bg-slate-50 p-3 text-slate-700">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Filters</h2>
            <p className="mt-1 text-sm text-slate-500">
              {resultCount} matching transactions across the active dashboard slice.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="control-base" onClick={onSaveLayout}>
            <Save className="h-4 w-4" />
            Save layout
          </button>
          <button type="button" className="control-base" onClick={onResetLayout}>
            <RotateCcw className="h-4 w-4" />
            Reset layout
          </button>
        </div>
      </div>

      <hr className="section-divider my-5" />

      <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap">
        <SelectField
          label="Date range"
          value={filters.dateRange}
          onChange={(value) => updateFilter("dateRange", value as typeof filters.dateRange)}
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Category"
          value={filters.category}
          onChange={(value) => updateFilter("category", value)}
        >
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Sort"
          value={filters.sortBy}
          onChange={(value) => updateFilter("sortBy", value as typeof filters.sortBy)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>
    </section>
  );
}
