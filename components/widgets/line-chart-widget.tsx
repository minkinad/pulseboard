"use client";

import { Line } from "react-chartjs-2";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { getChartPalette } from "@/lib/chart";
import { formatDateLabel } from "@/lib/format";
import type { ChartDatum, ThemeMode } from "@/types/dashboard";

interface LineChartWidgetProps {
  series: ChartDatum[];
  theme: ThemeMode;
}

export function LineChartWidget({ series, theme }: LineChartWidgetProps) {
  if (series.every((datum) => datum.value === 0 && (datum.secondaryValue ?? 0) === 0)) {
    return (
      <WidgetEmptyState
        title="No trend to chart"
        description="This slice has no income or expense movement yet."
      />
    );
  }

  const palette = getChartPalette(theme);

  return (
    <div className="h-full min-h-[290px]">
      <Line
        data={{
          labels: series.map((datum) => formatDateLabel(datum.label)),
          datasets: [
            {
              label: "Income",
              data: series.map((datum) => datum.value),
              borderColor: palette.accent,
              backgroundColor: palette.accentSoft,
              pointRadius: 0,
              borderWidth: 2.5,
              fill: true,
              tension: 0.36,
            },
            {
              label: "Expenses",
              data: series.map((datum) => datum.secondaryValue ?? 0),
              borderColor: palette.secondary,
              backgroundColor: palette.secondarySoft,
              pointRadius: 0,
              borderWidth: 2.5,
              fill: true,
              tension: 0.36,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              labels: {
                color: palette.text,
                usePointStyle: true,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: palette.text,
                maxTicksLimit: 7,
              },
              grid: {
                color: palette.muted,
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
