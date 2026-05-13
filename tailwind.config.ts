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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        neo: "0.75rem",
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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
