/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          background: '#1a1a1a',
        },
        fontFamily: {
          'pokemon': 'Pokemon Classic Regular',
          'retro': 'Retro Gaming',
        }
      },
    },
    plugins: [],
  }