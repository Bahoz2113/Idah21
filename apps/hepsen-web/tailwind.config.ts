import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        hepsenNavy: "#0f2439",
        hepsenBlue: "#1c4e80",
        hepsenAccent: "#c9a227",
        risk: {
          low: "#16a34a",
          medium: "#eab308",
          high: "#ea580c",
          blocked: "#dc2626",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
