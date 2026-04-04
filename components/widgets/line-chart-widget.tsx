"use client";

import { Line } from "react-chartjs-2";

import { WidgetEmptyState } from "@/components/dashboard/widget-empty-state";
import { chartPalette } from "@/lib/chart";
import { formatDateLabel } from "@/lib/format";
import type { ChartDatum } from "@/types/dashboard";

interface LineChartWidgetProps {
  series: ChartDatum[];
}

export function LineChartWidget({ series }: LineChartWidgetProps) {
  if (series.every((datum) => datum.value === 0 && (datum.secondaryValue ?? 0) === 0)) {
    return (
      <WidgetEmptyState
        title="No trend to chart"
        description="This slice has no income or expense movement yet."
      />
    );
  }

  return (
    <div className="h-full min-h-[290px]">
      <Line
        data={{
          labels: series.map((datum) => formatDateLabel(datum.label)),
          datasets: [
            {
              label: "Income",
              data: series.map((datum) => datum.value),
              borderColor: chartPalette.accent,
              backgroundColor: chartPalette.accentSoft,
              pointRadius: 0,
              borderWidth: 2.5,
              fill: true,
              tension: 0.36,
            },
            {
              label: "Expenses",
              data: series.map((datum) => datum.secondaryValue ?? 0),
              borderColor: chartPalette.secondary,
              backgroundColor: chartPalette.secondarySoft,
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
                color: chartPalette.text,
                usePointStyle: true,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: chartPalette.text,
                maxTicksLimit: 7,
              },
              grid: {
                color: chartPalette.muted,
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
