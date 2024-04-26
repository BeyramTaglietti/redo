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
          DEFAULT: "#FFA500",
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
