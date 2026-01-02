/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#315EFF', // Ogeko Bright Blue
        secondary: '#181E47', // Ogeko Deep Navy
        accent: '#FFD33C', // Yellow accent
        dark: '#181E47', // Using Deep Navy for dark text/headings
        body: '#525252', // Exact body gray
        light: '#F5F5F5',
        'light-blue': '#E6F0F9',
        border: '#E0E0E0',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.1)',
        'button': '0 10px 20px rgba(49, 94, 255, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
