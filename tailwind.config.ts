import type { Config } from "tailwindcss";

// Values mirror design-system/tokens.json (source: lepasuae.com).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-source-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-almarai)", "system-ui", "sans-serif"],
      },
      colors: {
        lepas: {
          black: "#0a0a0a",
          ink: "#1a1a1a",
          graphite: "#111111",
          steel: "#404040",
          ash: "#767676",
          mist: "#bababa",
          fog: "#e0e0e0",
          sand: "#f3f2ef",
          cream: "#f5f0eb",
          amber: "#eb9201",
          "amber-hover": "#d68300",
          navy: "#04182f",
          "form-ink": "#090e15",
          error: "#c43000",
          success: "#4caf50",
        },
      },
      maxWidth: {
        "8xl": "1440px",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      borderRadius: {
        pill: "100px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.22,0.61,0.36,1) both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
