import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "sans-serif"],
      },
      colors: {
        brand: {
          background: "var(--bg)",
          backgroundElevated: "var(--bg-elev)",
          backgroundOverlay: "var(--bg-overlay)",
          text: "var(--text)",
          textMuted: "var(--text-muted)",
          accent: "var(--accent)",
          accentHover: "var(--accent-hover)",
          accentInverse: "var(--accent-inverse)",
          border: "var(--border)",
          neutralElevated: "var(--neutral-elev)",
        },
        surface: {
          light: "#f3f4f6",
          dark: "#0b1120",
        },
        state: {
          critical: "var(--critical)",
          criticalSurface: "var(--critical-surface)",
          positive: "var(--positive)",
          positiveSurface: "var(--positive-surface)",
          warning: "var(--warning)",
          warningSurface: "var(--warning-surface)",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "8px",
        lg: "10px",
      },
      boxShadow: {
        card: "0 32px 70px -50px rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};

export default config;
