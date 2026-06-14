export const useReports = () => {
  const { get, getFile } = useApi()

  const getStockReport = async ({
    period = '',
    date_from = '',
    date_to = '',
    exportFormat = ''
  } = {}) => {
    const params = new URLSearchParams()
    if (period) params.append('period', period)
    if (date_from) params.append('date_from', date_from)
    if (date_to) params.append('date_to', date_to)
    if (exportFormat) params.append('export', exportFormat)

    const query = params.toString() ? `?${params.toString()}` : ''
    const url = `/api/v1/admin/reports/stock${query}`

    if (exportFormat) {
      return await getFile(url)
    }

    return await get(url)
  }

  return {
    getStockReport,
  }
}
