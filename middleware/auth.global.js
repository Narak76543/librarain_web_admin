export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') return

  if (process.client) {
    const token = localStorage.getItem('access_token')
    if (!token) return navigateTo('/login')
  }
})
