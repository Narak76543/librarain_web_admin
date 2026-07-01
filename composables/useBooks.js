export const useBooks = () => {
  const { get, post, put, del, postForm } = useApi()

  const getBooks = async ({
    search     = '',
    category   = '',
    minPrice   = '',
    maxPrice   = '',
    limit      = 10,
    offset     = 0,
    status     = '',
  } = {}) => {
    const params = new URLSearchParams()
    if (search)   params.append('search',    search)
    if (category) params.append('category',  category)
    if (minPrice) params.append('min_price', minPrice)
    if (maxPrice) params.append('max_price', maxPrice)
    if (status)   params.append('status',    status)
    params.append('limit',  limit)
    params.append('offset', offset)

    return await get(`/api/v1/books?${params.toString()}`)  
  }

  const getBook = async (bookId) => {
    return await get(`/api/v1/books/${bookId}`)             
  }

  const createBook = async (payload) => {
    return await post('/api/v1/books', payload)            
  }

  const updateBook = async (bookId, payload) => {
    return await put(`/api/v1/books/${bookId}`, payload)   
  }

  const deleteBook = async (bookId) => {
    return await del(`/api/v1/books/${bookId}`)            
  }

  const uploadCover = async (bookId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await postForm(`/api/v1/books/${bookId}/cover`, formData) 
  }

  return {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    uploadCover,
  }
}