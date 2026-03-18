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
          "linear-gradient(to right, rgb(var(--stroke) / 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--stroke) / 0.14) 1px, transparent 1px)",
      },
      boxShadow: {
        soft: "0 18px 42px rgba(15, 23, 42, 0.08)",
        glow: "0 14px 36px rgb(var(--accent) / 0.18)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(var(--accent) / 0.2)" },
          "50%": { boxShadow: "0 0 0 14px rgb(var(--accent) / 0)" },
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
