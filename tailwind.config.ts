import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      maxWidth: { article: "42rem" },
      screens: {
        xs: "480px",
      },
      colors: {
        buzz: {
          yellow: "#FFD700",
          black: "#0A0A0A",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;