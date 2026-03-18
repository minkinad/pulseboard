"use client";

import { RotateCcw, Save, SlidersHorizontal } from "lucide-react";

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
      <span className="text-xs uppercase tracking-[0.22em] text-foreground/55">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-stroke/15 bg-card/80 px-4 text-sm shadow-sm transition focus:border-accent/40"
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
  const filters = useDashboardStore((state) => state.filters);
  const updateFilter = useDashboardStore((state) => state.updateFilter);

  return (
    <section className="surface-panel p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-accent/10 p-3 text-accent">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Filter the current narrative</h2>
            <p className="text-sm text-foreground/65">
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

      <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:flex-wrap">
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
