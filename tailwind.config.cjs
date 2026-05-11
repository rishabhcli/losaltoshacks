const animate = require("tailwindcss-animate");

const cssVarColor = (name) => `hsl(var(--${name}-hsl) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./e2e/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: cssVarColor("background"),
        foreground: cssVarColor("foreground"),
        card: {
          DEFAULT: cssVarColor("card"),
          foreground: cssVarColor("card-foreground"),
        },
        popover: {
          DEFAULT: cssVarColor("popover"),
          foreground: cssVarColor("popover-foreground"),
        },
        primary: {
          DEFAULT: cssVarColor("primary"),
          foreground: cssVarColor("primary-foreground"),
        },
        secondary: {
          DEFAULT: cssVarColor("secondary"),
          foreground: cssVarColor("secondary-foreground"),
        },
        muted: {
          DEFAULT: cssVarColor("muted"),
          foreground: cssVarColor("muted-foreground"),
        },
        accent: {
          DEFAULT: cssVarColor("accent"),
          foreground: cssVarColor("accent-foreground"),
        },
        destructive: {
          DEFAULT: cssVarColor("destructive"),
          foreground: cssVarColor("destructive-foreground"),
        },
        border: cssVarColor("border"),
        input: cssVarColor("input"),
        ring: cssVarColor("ring"),
        chart: {
          1: cssVarColor("chart-1"),
          2: cssVarColor("chart-2"),
          3: cssVarColor("chart-3"),
          4: cssVarColor("chart-4"),
          5: cssVarColor("chart-5"),
        },
        sidebar: {
          DEFAULT: cssVarColor("sidebar"),
          foreground: cssVarColor("sidebar-foreground"),
          primary: cssVarColor("sidebar-primary"),
          "primary-foreground": cssVarColor("sidebar-primary-foreground"),
          accent: cssVarColor("sidebar-accent"),
          "accent-foreground": cssVarColor("sidebar-accent-foreground"),
          border: cssVarColor("sidebar-border"),
          ring: cssVarColor("sidebar-ring"),
        },
        obsidian: "#fafbfd",
        coral: "#2563eb",
        bone: "#0f172a",
        surface: "#ffffff",
        "surface-hover": "#f1f5f9",
        divider: "#e2e8f0",
        grid: "#e2e8f0",
        "tag-bg": "#eff6ff",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      fontFamily: {
        display: ['"DM Sans"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [animate],
};
