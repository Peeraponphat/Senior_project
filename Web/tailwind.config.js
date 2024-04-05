/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  theme: {
    extend: {backgroundColor: {
      'Medimturquoise': '#48D1CC',
      'LIGHTBLUE': '#ADD8E6',
      'DEEPSKYBLUE': '#00BFFF',
    },
    },
  },
  plugins: [require('flowbite/plugin')],
}
