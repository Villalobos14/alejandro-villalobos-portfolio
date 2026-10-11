import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.5rem, 0.8rem + 6.9vw, 7rem)",
          { lineHeight: "0.8929", letterSpacing: "-0.045em", fontWeight: "600" },
        ],
        "display-l": [
          "clamp(2.25rem, 0.9rem + 4.55vw, 5rem)",
          { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.75rem, 1.05rem + 2.17vw, 3rem)",
          { lineHeight: "1.125", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        h3: ["1.75rem", { lineHeight: "2.125rem", fontWeight: "500" }],
        h4: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "500" }],
        "body-l": ["1.25rem", { lineHeight: "1.9375rem", fontWeight: "400" }],
        body: ["1.0625rem", { lineHeight: "1.6875rem", fontWeight: "400" }],
        "body-s": ["0.9375rem", { lineHeight: "1.4375rem", fontWeight: "400" }],
        stat: ["3.25rem", { lineHeight: "1", fontWeight: "600" }],
        /* Still referenced. Drop each one once its call sites move to the scale above. */
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        label: ["1rem", { lineHeight: "1.5rem" }],
        display: ["3rem", { lineHeight: "1" }],
      },
      maxWidth: {
        content: "80rem",
      },
      spacing: {
        scale: "1rem",
        stack: "4rem",
      },
      screens: {
        fine: { raw: "(hover: hover) and (pointer: fine)" },
      },
    },
    colors: {
      white: "#ffffff",
      black: "#000000",
      bg: "rgb(var(--bg) / <alpha-value>)",
      "bg-subtle": "rgb(var(--bg-subtle) / <alpha-value>)",
      ink: "rgb(var(--ink) / <alpha-value>)",
      "ink-secondary": "rgb(var(--ink-secondary) / <alpha-value>)",
      "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
      border: "rgb(var(--border) / <alpha-value>)",
      "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
      accent: "rgb(var(--accent) / <alpha-value>)",
      signal: "rgb(var(--signal-red) / <alpha-value>)",
      "mat-minor": "rgb(var(--mat-minor) / <alpha-value>)",
      "mat-major": "rgb(var(--mat-major) / <alpha-value>)",
      "mat-number": "rgb(var(--mat-number) / <alpha-value>)",
      "mat-wordmark": "rgb(var(--mat-wordmark) / <alpha-value>)",
      "tint-ice": "rgb(var(--tint-ice) / <alpha-value>)",
      "tint-sky": "rgb(var(--tint-sky) / <alpha-value>)",
      "tint-mint": "rgb(var(--tint-mint) / <alpha-value>)",
      "tint-lilac": "rgb(var(--tint-lilac) / <alpha-value>)",
      "tint-stone": "rgb(var(--tint-stone) / <alpha-value>)",
      "cover-ink": "rgb(var(--cover-ink) / <alpha-value>)",
      "cover-ink-raised": "rgb(var(--cover-ink-raised) / <alpha-value>)",
      "on-ink-secondary": "rgb(var(--on-ink-secondary) / <alpha-value>)",
      "on-ink-positive": "rgb(var(--on-ink-positive) / <alpha-value>)",
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-mono": {
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "0.75rem",
          lineHeight: "1",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: "400",
        },
        ".text-mono-s": {
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "0.6875rem",
          lineHeight: "1",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontWeight: "400",
        },
      });
    }),
  ],
};
export default config;
