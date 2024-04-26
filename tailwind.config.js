/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./lib/components/*.{js,jsx,ts,tsx}"],
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
        secondary: "#F97316",
        foreground: { DEFAULT: "#000000", dark: "#FFFFFF" },
        success: "#4CAF50",
        destructive: "#C74B4B",
        muted: "#718096",
      },
    },
  },
  plugins: [],
};
