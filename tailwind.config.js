/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        merit: '#22c55e',
        demerit: '#ef4444'
      }
    }
  },
  plugins: []
};


