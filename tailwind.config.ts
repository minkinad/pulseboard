import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        stroke: "rgb(var(--stroke) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
      },
      backgroundImage: {
        "dashboard-grid":
          "linear-gradient(to right, rgb(var(--stroke) / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--stroke) / 0.12) 1px, transparent 1px)",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.12)",
        glow: "0 12px 40px rgba(15, 118, 110, 0.18)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(15, 118, 110, 0.18)" },
          "50%": { boxShadow: "0 0 0 14px rgba(15, 118, 110, 0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.8s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
