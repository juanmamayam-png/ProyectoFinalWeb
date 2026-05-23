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
          50:  '#f2faf1',
          100: '#e2f5de',
          200: '#bde8b5',
          300: '#8dd380',
          400: '#57ba4a',
          500: '#46af39',
          600: '#3ea832',
          700: '#39a12e',
          800: '#2d8024',
          900: '#1e5518',
        }
      }
    },
  },
  plugins: [],
}
