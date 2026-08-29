import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        transit: {
          sukhumvit: "#75B832",
          silom: "#007B5F",
          gold: "#C9920E",
          mrtBlue: "#193E94",
          mrtPurple: "#6F2C91",
          mrtYellow: "#FDB813",
          mrtPink: "#EC6B9E",
          arl: "#7E1E2C",
          srtDarkRed: "#C8102E",
          srtLightRed: "#D6334D",
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'float': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 25px rgba(37, 99, 235, 0.35)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-kanit)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
