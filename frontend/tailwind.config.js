/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f1f8f3',
          100: '#deece2',
          200: '#bdd9c7',
          300: '#94bfa5',
          400: '#649e7b',
          500: '#43805f',
          600: '#34664c',
          700: '#2b523e',
          800: '#254233',
          900: '#1f362a',
          950: '#101e18',
        },
        earth: {
          50: '#faf8f6',
          100: '#f2ece4',
          200: '#e5d9c9',
          300: '#d1bca5',
          400: '#b4967d',
          500: '#9a785d',
          600: '#89644d',
          700: '#725141',
          800: '#5f4337',
          900: '#4e382f',
          950: '#291b17',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
