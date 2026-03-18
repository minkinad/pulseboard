"use client";

import { useEffect } from "react";

import { useDashboardStore } from "@/store/dashboard-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useDashboardStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return children;
}
