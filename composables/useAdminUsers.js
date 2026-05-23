
// ======== Wraps all administrative user-management API calls =================
export const useAdminUsers = () => {
  const { get, put, del } = useApi()

  /**
   * GET /api/v1/admin/users
   * Retrieves an array of all registered system users
   * Accepts query parameters for pagination and filtering
   */
  const getAllUsers = async (params = {}) => {
    // Converts your params object to a clean query string
    const query = new URLSearchParams(params).toString()
    return await get(`/api/v1/admin/users?${query}`)
  }

  /**
   * GET /api/v1/admin/users/:id
   */
  const getUserById = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}`)
  }

  /**
   * PUT /api/v1/admin/users/:id
   */
  const updateUserById = async (userId, payload) => {
    return await put(`/api/v1/admin/users/${userId}`, payload)
  }

  /**
   * DELETE /api/v1/admin/users/:id
   */
  const deleteUserById = async (userId) => {
    return await del(`/api/v1/admin/users/${userId}`)
  }

  // --- Mappings specifically matching your old page actions ---
  
  const getUserDetail = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}`)
  }

  const updateUserStatus = async (userId, isActive) => {
    return await put(`/api/v1/admin/users/${userId}`, { is_active: isActive })
  }

  const resetLoginAttempt = async (userId) => {
    return await put(`/api/v1/admin/users/${userId}/reset-attempts`, {})
  }

  const forceLogout = async (userId) => {
    return await del(`/api/v1/admin/users/${userId}/sessions`, {})
  }

  return { 
    getAllUsers,
    getUsers: getAllUsers, // Fixes the error from image_b20407.png
    getUserById, 
    updateUserById, 
    deleteUserById,
    getUserDetail,
    updateUserStatus,
    resetLoginAttempt,
    forceLogout
  }
}