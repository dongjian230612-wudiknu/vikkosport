/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vikko: {
          // Light retail surfaces (Oakley / SportRx / Rudy / 100% pattern)
          black: '#111111',
          ink: '#1a1a1a',
          white: '#ffffff',
          canvas: '#f5f5f5',
          surface: '#ffffff',
          border: '#e6e6e6',
          muted: '#6b6b6b',
          // Sport accent — used sparingly on light UI
          accent: '#0284c7',
          'accent-dark': '#0369a1',
          // Legacy aliases remapped for light theme
          dark: '#111111',
          gray: '#e6e6e6',
        }
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        display: ['Rubik', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
