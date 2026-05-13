import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          cyan: "#06b6d4",
          "cyan-light": "#67e8f9",
          "cyan-dark": "#0891b2",
          purple: "#8b5cf6",
          "purple-light": "#a78bfa",
          "purple-dark": "#7c3aed",
          "purple-darker": "#1e1b4b",
          yellow: "#eab308",
          "yellow-light": "#fde047",
          "yellow-dark": "#ca8a04",
          black: "#0a0a0a",
          "gray-dark": "#1f1f1f",
          "gray-light": "#f3f4f6",
          white: "#ffffff",
        },
      },
      boxShadow: {
        "neo": "4px 4px 0px 0px rgba(0,0,0,1)",
        "neo-hover": "6px 6px 0px 0px rgba(0,0,0,1)",
        "neo-active": "2px 2px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "6px 6px 0px 0px rgba(0,0,0,1)",
        "neo-xl": "8px 8px 0px 0px rgba(0,0,0,1)",
        "neo-cyan": "4px 4px 0px 0px #06b6d4",
        "neo-purple": "4px 4px 0px 0px #8b5cf6",
        "neo-yellow": "4px 4px 0px 0px #eab308",
      },
      borderRadius: {
        "neo": "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
