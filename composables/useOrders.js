export const useOrders = () => {
  const { get, post, put, patch, del } = useApi()

  const getOrders = async ({
    search     = '',
    status     = '',
    fromDate   = '',
    toDate     = '',
    limit      = 10,
    offset     = 0,
  } = {}) => {
    const params = new URLSearchParams()
    if (search)   params.append('search', search)
    if (status)   params.append('status', status)
    if (fromDate) params.append('date_from', fromDate)
    if (toDate)   params.append('date_to', toDate)
    params.append('limit', limit)
    params.append('offset', offset)

    return await get(`/api/v1/admin/orders?${params.toString()}`)
  }

  const getOrder = async (orderId) => {
    return await get(`/api/v1/admin/orders/${orderId}`)
  }

  // Assuming POST /api/v1/admin/orders is to place an order (if applicable for admin)
  const placeOrder = async (payload) => {
    return await post('/api/v1/admin/orders', payload)
  }

  const updateOrder = async (orderId, payload) => {
    // Make sure we pass the status in lower case as expected by the API
    const data = {
      ...payload,
      status: payload.status ? payload.status.toLowerCase() : payload.status
    }
    return await patch(`/api/v1/admin/orders/${orderId}/status`, data)
  }

  const deleteOrder = async (orderId) => {
    return await del(`/api/v1/admin/orders/${orderId}`)
  }

  return {
    getOrders,
    getOrder,
    placeOrder,
    updateOrder,
    deleteOrder,
  }
}
