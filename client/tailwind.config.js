/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enable dark mode via 'class'
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // scan all files in src
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED", // purple 600
          light: "#A78BFA", 
          dark: "#5B21B6",
        },
        secondary: {
          DEFAULT: "#EC4899", // pink 500
          light: "#F472B6",
          dark: "#BE185D",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      spacing: {
        128: "32rem", // custom spacing
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // for Markdown / prose
  ],
};
