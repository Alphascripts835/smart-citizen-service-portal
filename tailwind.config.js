/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#eef2f8', 100: '#d6dfee', 600: '#2a4a7f', 700: '#1f3a66', 800: '#172c4d', 900: '#0f1d34' },
        saffron: { 400: '#f6a623', 500: '#e8920c' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['ui-monospace', 'Menlo', 'monospace'] },
    },
  },
  plugins: [],
};
