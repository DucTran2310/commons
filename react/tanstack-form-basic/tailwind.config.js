/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ rất quan trọng!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
  extend: {
  animation: {
    'fade-in-out': 'fadeInOut 2s ease-in-out',
  },
  keyframes: {
    fadeInOut: {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '10%': { opacity: 1, transform: 'translateY(0)' },
      '90%': { opacity: 1, transform: 'translateY(0)' },
      '100%': { opacity: 0, transform: 'translateY(-20px)' },
    },
  },
},
}