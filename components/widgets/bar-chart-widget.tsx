"use client";

import { Bar } from "react-chartjs-2";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { getChartPalette } from "@/lib/chart";
import type { ChartDatum, ThemeMode } from "@/types/dashboard";

interface BarChartWidgetProps {
  series: ChartDatum[];
  theme: ThemeMode;
}

export function BarChartWidget({ series, theme }: BarChartWidgetProps) {
  if (series.length === 0) {
    return (
      <WidgetEmptyState
        title="No category spend"
        description="Once expenses exist in the active slice, category comparison will appear here."
      />
    );
  }

  const palette = getChartPalette(theme);

  return (
    <div className="h-full min-h-[290px]">
      <Bar
        data={{
          labels: series.map((datum) => datum.label),
          datasets: [
            {
              label: "Expense volume",
              data: series.map((datum) => datum.value),
              backgroundColor: palette.pie,
              borderRadius: 16,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                color: palette.text,
              },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                color: palette.text,
              },
              grid: {
                color: palette.muted,
              },
            },
          },
        }}
      />
    </div>
  );
}
