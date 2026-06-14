/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#3ECF8E',
        'primary-hover': '#24B47E',
        'primary-light': 'rgba(62, 207, 142, 0.1)',
        surface: '#F8F9FA',
        card: '#FFFFFF',
        border: '#EBEBEB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        success: '#3ECF8E',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
