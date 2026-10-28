/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174A2A',
          dark: '#10371E',
          light: '#1F5E36',
        },
        farm: {
          DEFAULT: '#287A3E',
          dark: '#206332',
          light: '#318F49',
        },
        leaf: {
          DEFAULT: '#56A94F',
          dark: '#458B3F',
          light: '#6CC065',
        },
        sage: {
          DEFAULT: '#A5D6A0',
          light: '#C2E5BD',
          dark: '#85BE7F',
        },
        sprout: {
          DEFAULT: '#E1F0DF',
          light: '#EAF5E9',
          dark: '#D0E6CD',
        },
        pale: {
          DEFAULT: '#F1F8EE',
          tint: '#F7FCF5',
        },
        olive: {
          DEFAULT: '#A5AD45',
          light: '#C1C85A',
          dark: '#858C32',
        },
        charcoal: {
          DEFAULT: '#183522',
          muted: '#526659',
          border: '#DCE6DA',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
