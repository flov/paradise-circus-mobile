/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pc: {
          bg: "#0D0A07",
          card: "#1C1815",
          cardBorder: "#2A2420",
          accent: "#F09010",
          accentDanger: "#3A1808",
          text: "#FFFFFF",
          textMuted: "#8A8078",
          textSecondary: "#C0B8B0",
          separator: "#2A2420",
        },
      },
    },
  },
  plugins: [],
}
