// Wraps all auth API calls
// Reads response shape: { ok, status, message, data }

export const useAuth = () => {
  const { post, get } = useApi()

  // POST /api/v1/auth/login
  // body: { email, password }
  // response data: { accessToken, refreshToken, user, roles }
  const login = async (email, password) => {
    const res = await post('/api/v1/auth/login', { email, password })
    if (res.ok) {
      localStorage.setItem('access_token',  res.data.accessToken)
      localStorage.setItem('refresh_token', res.data.refreshToken)
      localStorage.setItem('user',          JSON.stringify(res.data.user))
    }
    return res
  }

  // POST /api/v1/auth/logout
  // body: { refresh_token }
  const logout = async () => {
    if (process.client) {
      const refreshToken = localStorage.getItem('refresh_token')
      try {
        await post('/api/v1/auth/logout', { refresh_token: refreshToken })
      } catch (e) {
        // Ignore logout errors
      } finally {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
  }

  // GET /api/v1/auth/me
  // returns: { user, roles }
  const getMe = async () => {
    const res = await get('/api/v1/auth/me')
    return res
  }

  const isLoggedIn = () => {
    if (process.client) return !!localStorage.getItem('access_token')
    return false
  }

  const getCurrentUser = () => {
    if (process.client) {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  }

  return { login, logout, getMe, isLoggedIn, getCurrentUser }
}
