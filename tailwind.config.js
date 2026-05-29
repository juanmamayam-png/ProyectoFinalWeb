/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-down': 'slide-down 0.2s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
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
