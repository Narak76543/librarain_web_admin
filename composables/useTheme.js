import { ref, onMounted } from 'vue'

const isDark = ref(false)

export const useTheme = () => {
  const applyTheme = (dark) => {
    isDark.value = dark
    if (process.client) {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  }

  const toggleTheme = () => {
    applyTheme(!isDark.value)
  }

  const initTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        applyTheme(true)
      } else {
        applyTheme(false)
      }
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
