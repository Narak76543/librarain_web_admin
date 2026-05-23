export const useAdminUsers = () => {
  const { get, post, put, del } = useApi()

  // GET /api/v1/admin/users?search=x&role=x&status=x&limit=10&offset=0
  const getUsers = async ({ search = '', role = '', status = '', limit = 10, offset = 0 } = {}) => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (role)   params.append('role',   role)
    if (status) params.append('status', status)
    params.append('limit',  limit)
    params.append('offset', offset)
    return await get(`/api/v1/admin/users?${params.toString()}`)
  }

  // GET /api/v1/admin/users/{id}
  const getUserDetail = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}`)
  }

  // PUT /api/v1/admin/users/{id}/status
  const updateUserStatus = async (userId, isActive) => {
    return await put(`/api/v1/admin/users/${userId}/status`, { is_active: isActive })
  }

  // POST /api/v1/admin/users/{id}/reset-attempt
  const resetLoginAttempt = async (userId) => {
    return await post(`/api/v1/admin/users/${userId}/reset-attempt`, {})
  }

  // DELETE /api/v1/admin/users/{id}/sessions
  const forceLogout = async (userId) => {
    return await del(`/api/v1/admin/users/${userId}/sessions`)
  }

  // GET /api/v1/admin/users/{id}/login-logs?limit=10
  const getLoginLogs = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}/login-logs?limit=10`)
  }

  return {
    getUsers,
    getUserDetail,
    updateUserStatus,
    resetLoginAttempt,
    forceLogout,
    getLoginLogs,
  }
}
