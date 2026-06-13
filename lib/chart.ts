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

export const chartPalette = {
  text: "#0F172A",
  muted: "rgba(148, 163, 184, 0.25)",
  accent: "#2563EB",
  accentSoft: "rgba(37, 99, 235, 0.12)",
  secondary: "#EA580C",
  secondarySoft: "rgba(234, 88, 12, 0.1)",
  pie: ["#2563EB", "#16A34A", "#EA580C", "#7C3AED", "#0891B2", "#DB2777"],
} as const;
