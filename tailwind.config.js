/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        '0g-blue': '#0066ff',
        '0g-cyan': '#00f5ff',
        '0g-dark': '#0a0a0a',
        '0g-light': '#f8f9ff',
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        pulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}