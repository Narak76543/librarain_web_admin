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
        primary: '#059669',
        'primary-hover': '#047857',
        'primary-light': '#ECFDF5',
        surface: '#F3F4F6',
        card: '#FFFFFF',
        border: '#E5E7EB',
        'text-primary': '#1C1C1E',
        'text-secondary': '#6B7280',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
    },
  },
  plugins: [],
}
