import type { Config } from "tailwindcss";
import daisyui from 'daisyui';

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
	plugins: [daisyui],
	daisyui: {
		themes: [
      {
        wgstheme: {    
          "primary": "#3b82f6",
          "secondary": "#2563eb",
          "accent": "#00ffff",
          "neutral": "#d1d5db",
          "base-100": "#ffffff",
          "info": "#0000ff",
          "success": "#00ff00",
          "warning": "#00ff00",
          "error": "#ff0000",
          },
        },
      ]
	}
};
export default config;
