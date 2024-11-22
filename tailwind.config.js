/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'card': 'white',  // ou la couleur que vous préférez
        'card-foreground': 'black',  // ou la couleur que vous préférez
      },
    },
  },
  plugins: [],
}