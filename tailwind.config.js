/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1A2A44',
        green: '#00FF7F',
      },
      backgroundColor: {
        'navy': '#1A2A44',
        'accent-green': '#00FF7F',
      },
      textColor: {
        'accent-green': '#00FF7F',
      },
    },
  },
  plugins: [],
};
