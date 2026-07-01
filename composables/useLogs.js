export const useLogs = () => {
  const { get, del } = useApi()

  const getSystemLogs = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const url = `/api/v1/admin/logs${queryParams ? '?' + queryParams : ''}`
      const response = await get(url)
      
      return response
    } catch (error) {
      console.error('getSystemLogs Error:', error)
      throw error
    }
  }

  const getLogStats = async (period = '30d') => {
    try {
      const response = await get(`/api/v1/admin/logs/stats?period=${period}`)
      return response
    } catch (error) {
      console.error('getLogStats Error:', error)
      throw error
    }
  }

  const cleanupLogs = async (days = 90) => {
    try {
      const response = await del(`/api/v1/admin/logs/cleanup?days=${days}`)
      return response
    } catch (error) {
      console.error('cleanupLogs Error:', error)
      throw error
    }
  }

  return {
    getSystemLogs,
    getLogStats,
    cleanupLogs
  }
}
