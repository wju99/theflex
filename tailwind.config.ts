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
        "flex-green": "rgb(40 78 76)",
        "flex-green-light": "#2d6b4f",
        "flex-beige": "#f5f1eb",
      },
    },
  },
  plugins: [],
};
export default config;

