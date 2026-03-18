import { LayoutGrid, PieChart, WalletCards, Waypoints, TableProperties } from "lucide-react";

import type {
  DateRange,
  SortOption,
  WidgetLayoutItem,
  WidgetSize,
} from "@/types/dashboard";

export const dateRangeOptions: Array<{ value: DateRange; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "180d", label: "Last 180 days" },
];

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
  { value: "name-asc", label: "A-Z counterparty" },
];

export const defaultFilters = {
  dateRange: "90d" as const,
  category: "All",
  sortBy: "date-desc" as const,
  search: "",
};

export const defaultWidgets: WidgetLayoutItem[] = [
  {
    id: "summary",
    kind: "summary",
    title: "Finance overview",
    description: "Headline performance with period-over-period deltas.",
    size: "hero",
  },
  {
    id: "cashflow",
    kind: "line",
    title: "Cashflow timeline",
    description: "Income versus expenses across the selected date range.",
    size: "wide",
  },
  {
    id: "categories",
    kind: "bar",
    title: "Expense concentration",
    description: "Compare spend by category to spot operating drag fast.",
    size: "standard",
  },
  {
    id: "distribution",
    kind: "pie",
    title: "Expense distribution",
    description: "See where the current period budget is actually going.",
    size: "compact",
  },
  {
    id: "activity",
    kind: "table",
    title: "Recent activity",
    description: "Searchable and sortable transactions for the current slice.",
    size: "wide",
  },
];

export const widgetResizeOrder: Record<string, WidgetSize[]> = {
  summary: ["wide", "hero"],
  cashflow: ["standard", "wide", "hero"],
  categories: ["compact", "standard", "wide"],
  distribution: ["compact", "standard", "tall"],
  activity: ["standard", "wide", "hero"],
};

export const widgetSizeClassNames: Record<WidgetSize, string> = {
  compact: "col-span-12 md:col-span-6 xl:col-span-4 min-h-[340px]",
  standard: "col-span-12 md:col-span-6 xl:col-span-6 min-h-[360px]",
  wide: "col-span-12 xl:col-span-8 min-h-[380px]",
  hero: "col-span-12 min-h-[260px]",
  tall: "col-span-12 md:col-span-6 xl:col-span-4 min-h-[460px]",
};

export const sidebarNavigation = [
  {
    label: "Overview",
    description: "Live financial health",
    icon: LayoutGrid,
  },
  {
    label: "Cashflow",
    description: "Revenue and spend",
    icon: Waypoints,
  },
  {
    label: "Mix",
    description: "Category distribution",
    icon: PieChart,
  },
  {
    label: "Records",
    description: "Transactions ledger",
    icon: TableProperties,
  },
  {
    label: "Layouts",
    description: "Saved dashboard states",
    icon: WalletCards,
  },
];
