import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C0E29",
        bone: "#F3EADB",
        magenta: "#E0337E",
        peach: "#F2B79E",
        teal: "#1C9C95",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        hanken: ["var(--font-hanken)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        prism: "linear-gradient(90deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)",
      },
      animation: {
        "paren-open": "parenOpen 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "light-sweep": "lightSweep 2s ease-in-out infinite",
        "pulse-warm": "pulseWarm 1.5s ease-in-out",
        "glint": "glint 0.4s ease-out forwards",
      },
      keyframes: {
        parenOpen: {
          "0%": { letterSpacing: "-0.5em", opacity: "0" },
          "100%": { letterSpacing: "normal", opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lightSweep: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseWarm: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(224, 51, 126, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(224, 51, 126, 0)" },
        },
        glint: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)", opacity: "0.6" },
          "100%": { transform: "translateX(200%) skewX(-15deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
