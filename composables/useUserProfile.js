// Wraps all user profile API calls
// Response shape: { ok, status, message, data }

export const useUserProfile = () => {
  const { get, put, postForm } = useApi()

  // GET /api/v1/users/me
  // returns: { user, profile }
  // profile fields: first_name, last_name, first_name_local,
  //                 last_name_local, phone, telegram, address, avatar_url
  const getProfile = async () => {
    return await get('/api/v1/users/me')
  }

  // PUT /api/v1/users/me
  // body: { first_name, last_name, first_name_local,
  //         last_name_local, phone, telegram, address }
  const updateProfile = async (payload) => {
    return await put('/api/v1/users/me', payload)
  }

  // POST /api/v1/users/me/avatar
  // body: multipart/form-data { file: imageFile }
  // returns: { profile: { avatar_url: "https://res.cloudinary.com/..." } }
  const uploadAvatar = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await postForm('/api/v1/users/me/avatar', formData)
  }

  return { getProfile, updateProfile, uploadAvatar }
}
