import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        accent: "var(--accent)",
        text: {
          primary: "var(--text-primary)",
          negative: "var(--text-negative)",
          faded: "var(--text-faded)",
        },
        navbar: {
          bg: "var(--navbar-bg)",
        },
        highlight: "var(--highlight)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        negative: "var(--text-negative)",
        "soft-gray": "var(--soft-gray)",
        "spotify-green": "var(--spotify-green)",
        "spotify-black": "var(--spotify-black)",
        dark: "#0e0e0e",
        medio: {
          dark: "var(--medio-dark)",
          lila: "var(--medio-lila)",
          purple: "var(--medio-purple)",
          "purple-10": "var(--medio-purple-10)",
          "purple-14": "var(--medio-purple-14)",
          cyan: "var(--medio-cyan)",
          gelb: "var(--medio-gelb)",
          orange: "var(--medio-orange)",
          pink: "var(--medio-pink)",
          creme: "var(--medio-creme)",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("arcade", 'html[data-theme="arcade"] &');
      addVariant("dark", 'html[data-theme="dark"] &');
      addVariant("light", 'html:not([data-theme]) &');
    }),
  ],
};
export default config;
