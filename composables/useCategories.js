export const useCategories = () => {
  const { get, post, put, del } = useApi()

  const getCategories = async () => {
    return await get('/api/v1/categories')
  }

  const createCategory = async (payload) => {
    return await post('/api/v1/categories', payload)
  }

  const updateCategory = async (categoryId, payload) => {
    return await put(`/api/v1/categories/${categoryId}`, payload)
  }

  const deleteCategory = async (categoryId) => {
    return await del(`/api/v1/categories/${categoryId}`)
  }

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
