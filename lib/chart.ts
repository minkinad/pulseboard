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
      text: "#D6E2DF",
      muted: "rgba(148, 163, 184, 0.35)",
      accent: "#2DD4BF",
      accentSoft: "rgba(45, 212, 191, 0.18)",
      secondary: "#F59E0B",
      secondarySoft: "rgba(245, 158, 11, 0.18)",
      surface: "#11202B",
      negative: "#F87171",
      positive: "#4ADE80",
      pie: ["#2DD4BF", "#F59E0B", "#38BDF8", "#FB7185", "#A78BFA", "#34D399"],
    };
  }

  return {
    text: "#11212D",
    muted: "rgba(100, 116, 139, 0.28)",
    accent: "#0F766E",
    accentSoft: "rgba(15, 118, 110, 0.12)",
    secondary: "#EA580C",
    secondarySoft: "rgba(234, 88, 12, 0.14)",
    surface: "#FFFBF5",
    negative: "#DC2626",
    positive: "#16A34A",
    pie: ["#0F766E", "#EA580C", "#0284C7", "#E11D48", "#7C3AED", "#059669"],
  };
}
