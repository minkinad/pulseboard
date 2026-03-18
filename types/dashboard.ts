export type ThemeMode = "light" | "dark";

export type DateRange = "7d" | "30d" | "90d" | "180d";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc"
  | "name-asc";

export type WidgetKind = "summary" | "line" | "bar" | "pie" | "table";

export type WidgetSize = "compact" | "standard" | "wide" | "hero" | "tall";

export type TransactionType = "income" | "expense";

export interface FinanceTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  counterparty: string;
  channel: string;
  note: string;
  amount: number;
}

export interface DashboardFilters {
  dateRange: DateRange;
  category: string;
  sortBy: SortOption;
  search: string;
}

export interface WidgetLayoutItem {
  id: string;
  kind: WidgetKind;
  title: string;
  description: string;
  size: WidgetSize;
}

export interface SavedLayoutSnapshot {
  id: string;
  name: string;
  createdAt: string;
  widgets: WidgetLayoutItem[];
}

export interface SummaryCardMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  format: "currency" | "percent" | "number";
}

export interface ChartDatum {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface DashboardInsight {
  title: string;
  description: string;
}

export interface DashboardComputation {
  transactions: FinanceTransaction[];
  categories: string[];
  summary: SummaryCardMetric[];
  lineSeries: ChartDatum[];
  barSeries: ChartDatum[];
  pieSeries: ChartDatum[];
  insight: DashboardInsight;
  livePulse: {
    activeStreams: number;
    variance: number;
    syncedAt: string;
  };
}
