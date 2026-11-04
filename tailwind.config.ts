import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-paper)",
        canvas2: "var(--color-paper-2)",
        surface: "var(--color-paper-3)",
        ink: "var(--color-ink)",
        ink2: "var(--color-ink-2)",
        muted: "var(--color-muted)",
        rule: "var(--color-rule)",
        accent: "var(--color-accent)",
        "accent-ink": "var(--color-accent-ink)",
        signal: "var(--color-signal)",
        ember: "var(--color-ember)",
        sun: "var(--color-sun)",
        violet: "var(--color-violet)",
        danger: "var(--color-danger)",
        void: "var(--color-paper)",
        arcade: "var(--color-paper)",
        cyan: "var(--color-accent)",
        yellow: "var(--color-sun)",
        orange: "var(--color-ember)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
