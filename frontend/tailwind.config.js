/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DEBC65',
        'light-pink': '#FFF8E7',
        'dark-accent': '#1A1A2E',
        gold: '#C9A84C',
        'text-dark': '#2D2D2D',
        'text-muted': '#888888',
        border: '#F0D0D8',
        'placeholder-pink': '#FFE7B4',
        'placeholder-dark': '#FFD6E0',
        'card-dark': '#2A2A3E',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      height: {
        nav: '70px',
        hero: '520px',
        'bridal-banner': '400px',
      },
    },
  },
  plugins: [],
}
