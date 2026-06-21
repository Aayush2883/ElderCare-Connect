/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f8f7',
          100: '#e1eff0',
          200: '#c5e0e1',
          300: '#9ac9cc',
          400: '#68aaaf',
          500: '#4c8e93', // Teal primary color (Elderly friendly, calming)
          600: '#3c7277',
          700: '#355e63',
          800: '#314f53',
          900: '#2c4447',
          950: '#192b2e',
        },
        accent: {
          50: '#fdf8f3',
          100: '#f9edd7',
          200: '#f2d8ad',
          300: '#eabc78',
          400: '#e19a4a',
          500: '#d57827', // Warm Amber accent
          600: '#c65f1e',
          700: '#a5481b',
          800: '#843a1c',
          900: '#6b311b',
          950: '#3a170c',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
