/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        weld: {
          green: '#00FF41',
          pass: '#16a34a',
          fail: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
