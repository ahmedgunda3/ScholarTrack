/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        subject: {
          blue: '#BFDBFE',
          cyan: '#A5F3FC',
          yellow: '#FEF08A',
          pink: '#FBCFE8',
          green: '#BBEF63',
          orange: '#FDBA74',
          purple: '#E9D5FF',
        },
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}