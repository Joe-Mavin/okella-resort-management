/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Water-inspired sky blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        scorpion: {
          50: '#fef8ee',
          100: '#fdefd4',
          200: '#fbdda8',
          300: '#f8c571',
          400: '#f5a738',
          500: '#f28e1c', // Scorpion gold
          600: '#d97012',
          700: '#b45411',
          800: '#924316',
          900: '#783815',
        },
        sand: {
          50: '#fefcf9',
          100: '#fdf9f3',
          200: '#fbf3e7',
          300: '#f9eddb',
          400: '#f7e7cf',
          500: '#F7E9D7', // Desert sand
          600: '#e5d7c5',
          700: '#d3c5b3',
          800: '#c1b3a1',
          900: '#afa18f',
        },
        desert: {
          50: '#fef6ee',
          100: '#fde9d4',
          200: '#fad0a8',
          300: '#f6b071',
          400: '#f28638',
          500: '#ee6b1c',
          600: '#df5012',
          700: '#b93b11',
          800: '#933116',
          900: '#762a15',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
