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
              className="rounded-[26px] border border-stroke/15 bg-surface/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/55">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-foreground">
                {formatValue(metric.value, metric.format)}
              </p>
              <div
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                  positive ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
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

      <div className="rounded-[28px] border border-accent/15 bg-accent/10 p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-accent/15 p-2 text-accent">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent/85">Signal</p>
            <h3 className="text-xl font-semibold">{insight.title}</h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-foreground/75">{insight.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-stroke/15 bg-card/80 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/55">Live streams</p>
            <p className="mt-2 text-2xl font-semibold">{livePulse.activeStreams}</p>
          </div>
          <div className="rounded-3xl border border-stroke/15 bg-card/80 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/55">Variance</p>
            <p className="mt-2 text-2xl font-semibold">
              {livePulse.variance >= 0 ? "+" : ""}
              {livePulse.variance.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
