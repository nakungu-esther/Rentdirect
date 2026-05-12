/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: '#1B4332',
        navy: '#0B1B3A',
        cyan: '#00D1FF',
      },
    },
  },
  plugins: [],
};

