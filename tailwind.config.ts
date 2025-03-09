import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sf)'],
      }
    },
    colors: {
      'primary': '#0C0D0E',
      'secondary': '#3DD964',
      'white': '#ffffff',
      'black': '#000000',
      'gray': '#8C8C8C',
    },
  },
  plugins: [],
};
export default config;
