import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// ---------------------------------------------------------------------------
// Planora AI design tokens
// Palette: a working blueprint, not a marketing gradient. Ink-navy and
// blueprint-cyan carry the drafting-table world; stamp-red is reserved for
// single, deliberate moments (primary conversions, "official" signals) the
// way a surveyor's stamp is reserved for a final approval.
// ---------------------------------------------------------------------------
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A1420",
          50: "#EEF1EC",
          100: "#D8E0DE",
          200: "#AFC0C4",
          300: "#7E97A0",
          400: "#526A76",
          500: "#33495A",
          600: "#223649",
          700: "#172838",
          800: "#101B2C",
          900: "#0A1420",
          950: "#060B12",
        },
        paper: {
          DEFAULT: "#EDF0EA",
          dim: "#E2E6DE",
        },
        blueprint: {
          DEFAULT: "#1F5FA8",
          50: "#EAF2FB",
          100: "#CFE2F5",
          200: "#9FC5EB",
          300: "#6BA6DF",
          400: "#3E86CE",
          500: "#1F5FA8",
          600: "#194C89",
          700: "#143C6D",
          800: "#0F2D52",
          900: "#0A1F38",
        },
        stamp: {
          DEFAULT: "#B23A2E",
          50: "#FBEAE8",
          400: "#C6493B",
          500: "#B23A2E",
          600: "#8F2E24",
          700: "#6E241C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 4.5vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 3vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(to right, rgba(63,134,206,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(63,134,206,0.10) 1px, transparent 1px)",
        "blueprint-grid-fine":
          "linear-gradient(to right, rgba(63,134,206,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(63,134,206,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
        "grid-fine": "12px 12px",
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "10px",
        xl: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,20,32,0.06), 0 8px 24px -12px rgba(10,20,32,0.18)",
        "card-dark": "0 1px 2px rgba(0,0,0,0.3), 0 12px 32px -12px rgba(0,0,0,0.55)",
      },
      animation: {
        "draw-line": "draw 1.8s ease forwards",
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        draw: {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
