import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "24px",
          sm: "24px",
          lg: "24px",
          xl: "0",
        },
      },
    },
  },
  plugins: [],
} satisfies Config

