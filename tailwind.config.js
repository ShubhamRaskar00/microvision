/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Sets 'Inter' as the default font
        sans: ['"Inter"', "sans-serif"],
        // Sets 'JetBrains Mono' for the high-tech terminal text we used
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
