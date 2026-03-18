"use client";

import { Doughnut } from "react-chartjs-2";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { getChartPalette } from "@/lib/chart";
import { formatCurrency } from "@/lib/format";
import type { ChartDatum, ThemeMode } from "@/types/dashboard";

interface PieChartWidgetProps {
  series: ChartDatum[];
  theme: ThemeMode;
}

export function PieChartWidget({ series, theme }: PieChartWidgetProps) {
  if (series.length === 0) {
    return (
      <WidgetEmptyState
        title="No distribution yet"
        description="Expense distribution will appear after matching costs are found."
      />
    );
  }

  const palette = getChartPalette(theme);

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="min-h-[240px]">
        <Doughnut
          data={{
            labels: series.map((datum) => datum.label),
            datasets: [
              {
                data: series.map((datum) => datum.value),
                backgroundColor: palette.pie,
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

      <div className="space-y-3">
        {series.map((datum, index) => (
          <div
            key={datum.label}
            className="soft-card flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: palette.pie[index % palette.pie.length] }}
              />
              <span className="text-sm font-medium">{datum.label}</span>
            </div>
            <span className="text-sm text-foreground/70">{formatCurrency(datum.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
