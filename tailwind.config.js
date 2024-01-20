/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  important: '#root',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5FFFE',
          100: '#D1FCEA',
          400: '#51DCC7',
          500: '#1FC6BC'
        }
      }
    },
  },
  plugins: [],
};
