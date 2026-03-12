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
          50: '#f2f8f5',
          100: '#e1efe6',
          200: '#c5e0d0',
          300: '#9bcaa9',
          400: '#6bae7f',
          500: '#489360',
          600: '#35754a',
          700: '#2c5d3d',
          800: '#254a32',
          900: '#1f3d2a',
          950: '#102218',
        },
        earth: {
          50: '#f8f6f4',
          100: '#ede8e1',
          200: '#dad0c3',
          300: '#c1ae9b',
          400: '#a88972',
          500: '#957157',
          600: '#8c604b',
          700: '#754d3e',
          800: '#644136',
          900: '#51372e',
          950: '#2b1b17',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
