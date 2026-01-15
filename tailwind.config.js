/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: We point to our app and src folders
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Define our brand colors for the "Second Brain" aesthetic
        primary: '#4F46E5', // Indigo-600
        background: '#0F172A', // Slate-900 (Dark mode default)
        surface: '#1E293B', // Slate-800
        text: '#F8FAFC', // Slate-50
      }
    },
  },
  plugins: [],
}