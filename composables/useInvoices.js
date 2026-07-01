export const useInvoices = () => {
  const { get, put, post, baseUrl } = useApi()

  // ── Admin Endpoints ─────────────────────────────────────
  const getAdminInvoices = async (params = {}) => {
    const query = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key])
      }
    })
    const queryString = query.toString() ? `?${query.toString()}` : ''
    return await get(`/api/v1/admin/invoices${queryString}`)
  }

  const getAdminInvoiceDetail = async (id) => {
    return await get(`/api/v1/admin/invoices/${id}`)
  }

  const regenerateInvoice = async (id) => {
    return await post(`/api/v1/admin/invoices/${id}/regenerate`, {})
  }

  const markInvoicePaid = async (id) => {
    return await put(`/api/v1/admin/invoices/${id}/mark-paid`, {})
  }

  const cancelInvoice = async (id) => {
    return await put(`/api/v1/admin/invoices/${id}/cancel`, {})
  }

  // ── Customer Endpoints ──────────────────────────────────
  const getCustomerInvoices = async (page = 1, limit = 10) => {
    return await get(`/api/v1/customer/invoices?page=${page}&limit=${limit}`)
  }

  const getCustomerInvoiceDetail = async (id) => {
    return await get(`/api/v1/customer/invoices/${id}`)
  }

  // ── PDF Downloads ───────────────────────────────────────
  const downloadPdf = async (id, invoiceNumber, isAdmin = true) => {
    const token = localStorage.getItem('access_token')
    const path = isAdmin 
      ? `/api/v1/admin/invoices/${id}/pdf` 
      : `/api/v1/customer/invoices/${id}/download`

    const res = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Download failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice_${invoiceNumber}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    getAdminInvoices,
    getAdminInvoiceDetail,
    regenerateInvoice,
    markInvoicePaid,
    cancelInvoice,
    getCustomerInvoices,
    getCustomerInvoiceDetail,
    downloadPdf
  }
}
