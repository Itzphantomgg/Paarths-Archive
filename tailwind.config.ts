import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        archive: {
          950: "#050505",
          900: "#0a0a0a",
          850: "#101010",
          800: "#161616",
          700: "#222222",
          600: "#333333",
          500: "#555555",
          400: "#888888",
          300: "#aaaaaa",
          200: "#cccccc",
          100: "#e5e5e5",
          50: "#f5f5f5",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Bodoni Moda", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        ultra: "0.25em",
        widest: "0.35em",
      },
      animation: {
        "fade-in": "fadeIn 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-slow": "fadeIn 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal-up": "revealUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "ken-burns": "kenBurns 24s ease-out infinite alternate",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
