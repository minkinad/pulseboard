import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";

import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import type { DashboardComputation } from "@/types/dashboard";

interface SummaryWidgetProps {
  summary: DashboardComputation["summary"];
  insight: DashboardComputation["insight"];
  livePulse: DashboardComputation["livePulse"];
}

function formatValue(value: number, format: "currency" | "percent" | "number") {
  if (format === "percent") {
    return formatPercent(value);
  }

  if (format === "number") {
    return Intl.NumberFormat("en-US").format(value);
  }

  return formatCurrency(value, value >= 100000);
}

export function SummaryWidget({ summary, insight, livePulse }: SummaryWidgetProps) {
  if (summary.length === 0) {
    return (
      <WidgetEmptyState
        title="No summary available"
        description="Try broadening your filters to restore headline metrics."
      />
    );
  }

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[1.5fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {summary.map((metric) => {
          const positive = metric.change >= 0;
          const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={metric.id}
              className="soft-card p-5"
            >
              <p className="tiny-label">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">
                {formatValue(metric.value, metric.format)}
              </p>
              <div
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                  positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
                )}
              >
                <ChangeIcon className="h-3.5 w-3.5" />
                {positive ? "+" : ""}
                {metric.change.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-stroke bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-stroke bg-white p-2 text-slate-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="tiny-label">Signal</p>
            <h3 className="text-xl font-semibold text-slate-950">{insight.title}</h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">{insight.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="soft-card p-4">
            <p className="tiny-label">Live streams</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{livePulse.activeStreams}</p>
          </div>
          <div className="soft-card p-4">
            <p className="tiny-label">Variance</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {livePulse.variance >= 0 ? "+" : ""}
              {livePulse.variance.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
