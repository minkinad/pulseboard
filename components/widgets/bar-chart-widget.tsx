"use client";

import { Bar } from "react-chartjs-2";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { chartPalette } from "@/lib/chart";
import type { ChartDatum } from "@/types/dashboard";

interface BarChartWidgetProps {
  series: ChartDatum[];
}

export function BarChartWidget({ series }: BarChartWidgetProps) {
  if (series.length === 0) {
    return (
      <WidgetEmptyState
        title="No category spend"
        description="Once expenses exist in the active slice, category comparison will appear here."
      />
    );
  }

  return (
    <div className="h-full min-h-[290px]">
      <Bar
        data={{
          labels: series.map((datum) => datum.label),
          datasets: [
            {
              label: "Expense volume",
              data: series.map((datum) => datum.value),
              backgroundColor: chartPalette.pie,
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
                color: chartPalette.text,
              },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                color: chartPalette.text,
              },
              grid: {
                color: chartPalette.muted,
              },
            },
          },
        }}
      />
    </div>
  );
}
