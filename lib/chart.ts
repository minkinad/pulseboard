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
      text: "#DCE7F2",
      muted: "rgba(91, 113, 138, 0.35)",
      accent: "#629EFF",
      accentSoft: "rgba(98, 158, 255, 0.18)",
      secondary: "#5EDAA9",
      secondarySoft: "rgba(94, 218, 169, 0.18)",
      surface: "#111B26",
      negative: "#F87171",
      positive: "#5EDAA9",
      pie: ["#629EFF", "#5EDAA9", "#8DB7FF", "#F59EAB", "#B49DFF", "#7ED9C5"],
    };
  }

  return {
    text: "#25303D",
    muted: "rgba(158, 170, 184, 0.35)",
    accent: "#4386FF",
    accentSoft: "rgba(67, 134, 255, 0.12)",
    secondary: "#4CC89B",
    secondarySoft: "rgba(76, 200, 155, 0.16)",
    surface: "#FCFDFC",
    negative: "#D55C5C",
    positive: "#33B784",
    pie: ["#4386FF", "#4CC89B", "#88AEFF", "#F08EA6", "#B49DFF", "#74D3C1"],
  };
}
