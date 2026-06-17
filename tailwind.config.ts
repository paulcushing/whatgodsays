import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#f6f8fb",
        surface: "#edf2f8",
        ink: "#243347",
        scriptureInk: "#1b2737",
        softInk: "#5d6f85",
        mutedInk: "#8492a5",
        mutedInkAlt: "#9aa6b6",
        accent: "#607691",
        accentDeep: "#42576f",
        accentBright: "#7e94ad",
        tint: "#dce4ee",
        border: "#cfd7e2",
        borderSoft: "#dfe5ee",
        borderCool: "#c2ccd9",
        danger: "#8c6154",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "14px",
        md: "20px",
        lg: "24px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 18px 28px rgba(30, 42, 60, 0.16)",
        soft: "0 8px 18px rgba(30, 42, 60, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
