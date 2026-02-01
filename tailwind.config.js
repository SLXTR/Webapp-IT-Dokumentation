/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8f8f7",
        sidebar: "#f1f1ef",
        ink: "#1f1f1f"
      }
    }
  },
  plugins: []
};
