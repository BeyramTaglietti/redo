import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tailwindColors = {
  background: {
    DEFAULT: "#F2F2F8",
    dark: "#000000",
  },
  primary: {
    DEFAULT: "#F97316",
    foreground: "#FFFFFF",
  },
  sheet: {
    DEFAULT: "#FFFFFF",
    dark: "#1C1C1E",
  },
  "sheet-card": {
    DEFAULT: "#F2F2F8",
    dark: "#3A3A3C",
  },
  foreground: { DEFAULT: "#000000", dark: "#FFFFFF" },
  success: "#4CAF50",
  destructive: "#C74B4B",
  muted: "#718096",
};
