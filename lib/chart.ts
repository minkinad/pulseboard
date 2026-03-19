import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

import type { ThemeMode } from "@/types/dashboard";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

export function getChartPalette(theme: ThemeMode) {
  if (theme === "dark") {
    return {
      text: "#0F172A",
      muted: "rgba(148, 163, 184, 0.25)",
      accent: "#0F172A",
      accentSoft: "rgba(15, 23, 42, 0.08)",
      secondary: "#64748B",
      secondarySoft: "rgba(100, 116, 139, 0.08)",
      surface: "#FFFFFF",
      negative: "#DC2626",
      positive: "#16A34A",
      pie: ["#0F172A", "#475569", "#94A3B8", "#CBD5E1", "#334155", "#64748B"],
    };
  }

  return {
    text: "#0F172A",
    muted: "rgba(148, 163, 184, 0.25)",
    accent: "#0F172A",
    accentSoft: "rgba(15, 23, 42, 0.08)",
    secondary: "#64748B",
    secondarySoft: "rgba(100, 116, 139, 0.08)",
    surface: "#FFFFFF",
    negative: "#DC2626",
    positive: "#16A34A",
    pie: ["#0F172A", "#475569", "#94A3B8", "#CBD5E1", "#334155", "#64748B"],
  };
}
