/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-green': '#033220',
        'light-green': '#257F00',
        cream: '#FFEFE6',
      },
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
        'dm-serif': ['"DM Serif Display"', 'serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(3, 50, 32, 0.08)',
        'card-hover': '0 4px 24px rgba(3, 50, 32, 0.14)',
      },
    },
  },
  plugins: [],
}
