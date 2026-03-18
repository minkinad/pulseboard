import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSnapshotName(count: number) {
  return `Layout ${String(count + 1).padStart(2, "0")}`;
}
