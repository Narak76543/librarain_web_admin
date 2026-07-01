export const useReports = () => {
  const { get, getFile, baseUrl } = useApi()

  // ── Fetch JSON ──────────────────────────────────────────
  const getDailyReport = async (date = null) => {
    const params = date ? `?date=${date}` : ''
    return await get(`/api/v1/admin/reports/daily${params}`)
  }

  const getWeeklyReport = async (date = null) => {
    const params = date ? `?date=${date}` : ''
    return await get(`/api/v1/admin/reports/weekly${params}`)
  }

  const getMonthlyReport = async (month = null, year = null) => {
    const params = new URLSearchParams()
    if (month) params.append('month', month)
    if (year)  params.append('year',  year)
    const query = params.toString() ? `?${params.toString()}` : ''
    return await get(`/api/v1/admin/reports/monthly${query}`)
  }

  const getYearlyReport = async (year = null) => {
    const params = year ? `?year=${year}` : ''
    return await get(`/api/v1/admin/reports/yearly${params}`)
  }

  // ── Export ──────────────────────────────────────────────
  const exportReport = async (type, format, params = {}) => {
    const query = new URLSearchParams({ ...params, format })
    const file  = await getFile(`/api/v1/admin/reports/${type}/export?${query}`)
    if (!file) throw new Error('Export failed')

    const url = URL.createObjectURL(file)
    const a   = document.createElement('a')
    const ext = format === 'pdf' ? 'pdf' : 'xlsx'

    a.href     = url
    a.download = `${type}_report_${new Date().toISOString().slice(0, 10)}.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return { getDailyReport, getWeeklyReport, getMonthlyReport, getYearlyReport, exportReport }
}
