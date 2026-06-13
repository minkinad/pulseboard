"use client";

import { Doughnut } from "react-chartjs-2";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { chartPalette } from "@/lib/chart";
import { formatCurrency } from "@/lib/format";
import type { ChartDatum } from "@/types/dashboard";

interface PieChartWidgetProps {
  series: ChartDatum[];
}

export function PieChartWidget({ series }: PieChartWidgetProps) {
  if (series.length === 0) {
    return (
      <WidgetEmptyState
        title="No distribution yet"
        description="Expense distribution will appear after matching costs are found."
      />
    );
  }

  return (
    <div className="grid h-full min-h-0 gap-4 overflow-hidden xl:grid-cols-[1.1fr_0.9fr]">
      <div className="min-h-0">
        <Doughnut
          data={{
            labels: series.map((datum) => datum.label),
            datasets: [
              {
                data: series.map((datum) => datum.value),
                backgroundColor: chartPalette.pie,
                borderWidth: 0,
                hoverOffset: 8,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>

      <div className="min-h-0 space-y-2 overflow-auto pr-1">
        {series.map((datum, index) => (
          <div
            key={datum.label}
            className="flex min-w-0 items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    chartPalette.pie[index % chartPalette.pie.length],
                }}
              />
              <span className="truncate text-sm font-medium">{datum.label}</span>
            </div>
            <span className="shrink-0 text-sm text-foreground/70">{formatCurrency(datum.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
