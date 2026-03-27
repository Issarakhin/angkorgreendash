import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oxanium: ["var(--font-oxanium)", "sans-serif"],
        khmer: ["var(--font-khmer)", "sans-serif"],
      },
      colors: {
        green: {
          primary: "#1B6B3A",
          mid: "#2E7D32",
          light: "#4CAF50",
          accent: "#66BB6A",
          subtle: "#E8F5E9",
        },
        sidebar: {
          bg: "#0F1E14",
          border: "#1E3A27",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(27,107,58,0.12), 0 8px 24px rgba(0,0,0,0.06)",
        glow: "0 0 40px rgba(46,125,50,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
