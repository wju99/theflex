import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "flex-green": "#1a4d3a",
        "flex-green-light": "#2d6b4f",
        "flex-beige": "#f5f1eb",
      },
    },
  },
  plugins: [],
};
export default config;

