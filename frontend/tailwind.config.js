/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paw-primary': '#FFB7B2',    // 柔和粉色
        'paw-secondary': '#FFDAC1',  // 温暖杏色
        'paw-bg': '#FFF9F0',         // 奶白背景
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cute: ['Fredoka', 'sans-serif'],
      }
    },
  },
  plugins: [],
}