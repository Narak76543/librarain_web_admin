export const useInventory = () => {
  const { get, post } = useApi()

  const getDashboard = async () => {
    return await get('/api/v1/inventory/dashboard')
  }

  const getLowStock = async () => {
    return await get('/api/v1/inventory/low-stock')
  }

  const getAdjustments = async () => {
    return await get('/api/v1/inventory/adjustments')
  }

  const adjustStock = async (payload) => {
    return await post('/api/v1/inventory/adjust', payload)
  }

  const getMovements = async (bookId = '') => {
    const query = bookId ? `?book_id=${bookId}` : ''
    return await get(`/api/v1/inventory/movements${query}`)
  }

  const getBookBatches = async (bookId) => {
    return await get(`/api/v1/inventory/${bookId}/batches`)
  }

  return {
    getDashboard,
    getBookBatches,
    getLowStock,
    getAdjustments,
    adjustStock,
    getMovements
  }
}
