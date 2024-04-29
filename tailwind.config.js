/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./lib/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
        destructive: "#E01624",
        muted: "#718096",
      },
    },
  },
  plugins: [],
};
