export const useApi = () => {
  // const baseUrl = 'http://192.168.0.198:8000'
  const baseUrl = 'http://172.16.57.108:8000'

  const getToken = () => {
    if (process.client) return localStorage.getItem('access_token')
    return null
  }

  const getRefreshToken = () => {
    if (process.client) return localStorage.getItem('refresh_token')
    return null
  }

  const clearAuth = () => {
    if (!process.client) return
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    try {
      const res = await $fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { refreshToken },
      })

      if (!res?.ok || !res?.data?.accessToken) return false

      localStorage.setItem('access_token', res.data.accessToken)
      if (res.data.refreshToken) {
        localStorage.setItem('refresh_token', res.data.refreshToken)
      }
      return true
    } catch (error) {
      return false
    }
  }

  const authHeaders = () => {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/json',
    }

    // Only add authorization if a valid token actually exists
    if (token && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const request = async (path, options, canRetry = true) => {
    try {
      return await $fetch(`${baseUrl}${path}`, options)
    } catch (error) {
      const status = error?.status || error?.statusCode || error?.response?.status
      if (status !== 401 || !canRetry) throw error

      const didRefresh = await refreshAccessToken()
      if (!didRefresh) {
        clearAuth()
        throw error
      }

    
      const token = getToken()
      const retryHeaders = { ...options.headers }
      if (token && token !== 'null') {
        retryHeaders['Authorization'] = `Bearer ${token}`
      }

      return await request(
        path,
        {
          ...options,
          headers: retryHeaders,
        },
        false,
        )
    }
  }

  const get = async (path) => {
    return await request(path, {
      method: 'GET',
      headers: authHeaders(),
    })
  }

  const getFile = async (path) => {
    return await request(path, {
      method: 'GET',
      headers: authHeaders(),
      responseType: 'blob',
    })
  }

  const post = async (path, body) => {
    return await request(path, {
      method: 'POST',
      headers: authHeaders(),
      body,
    })
  }

  const put = async (path, body) => {
    return await request(path, {
      method: 'PUT',
      headers: authHeaders(),
      body,
    })
  }

  const postForm = async (path, formData) => {
    const token = getToken()
    const headers = {}
    
    if (token && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`
    }

    return await request(path, {
      method: 'POST',
      headers: headers,
      body: formData,
    })
  }

  const del = async (path) => {
    return await request(path, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  }

  const patch = async (path, body) => {
    return await request(path, {
      method: 'PATCH',
      headers: authHeaders(),
      body,
    })
  }

  return { get, getFile, post, put, patch, postForm, del }
}