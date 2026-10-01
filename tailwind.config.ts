import type { Config } from "tailwindcss";

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
        sans: ['var(--font-sf)'],
      },
      fontSize: {
        body: ['0.875rem', { lineHeight: '1.25rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        label: ['1rem', { lineHeight: '1.5rem' }],
        display: ['3rem', { lineHeight: '1' }],
      },
      maxWidth: {
        content: '80rem',
      },
      spacing: {
        scale: '1rem',
        stack: '4rem',
      },
      screens: {
        fine: { raw: "(hover: hover) and (pointer: fine)" },
      },
    },
    colors: {
      'primary': '#0C0D0E',
      'secondary': '#3DD964',
      'white': '#ffffff',
      'black': '#000000',
      'gray': '#8C8C8C',
      'bg': 'rgb(var(--bg) / <alpha-value>)',
      'ink': 'rgb(var(--ink) / <alpha-value>)',
      'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
      'border': 'rgb(var(--border) / <alpha-value>)',
      'accent': 'rgb(var(--accent) / <alpha-value>)',
    },
  },
  plugins: [],
};
export default config;
