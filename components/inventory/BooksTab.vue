<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="relative">
          <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" v-model="searchQuery" placeholder="Search books..." class="pl-9 w-64 bg-card" />
        </div>
        
        <select v-model="selectedCategory" class="bg-card min-w-[150px]">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
        </select>
        
        <select v-model="selectedStatus" class="bg-card min-w-[120px]">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <NuxtLink to="/books/new" class="btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Add Book
      </NuxtLink>
    </div>

    <div class="card !p-0 overflow-hidden">
      <DataTable 
        :columns="columns" 
        :rows="books" 
        :total="totalBooks"
        :page="currentPage"
        :perPage="perPage"
        @page-change="onPageChange"
      >
        <template #book="{ row }">
          <div class="flex items-center gap-4">
            <img :src="row.cover" class="w-12 h-16 object-cover rounded border border-border" />
            <div>
              <p class="font-semibold text-text-primary">{{ row.title }}</p>
              <p class="text-sm text-text-secondary">{{ row.author }}</p>
            </div>
          </div>
        </template>
        
        <template #category="{ row }">
          <span class="px-2 py-1 bg-surface text-text-secondary rounded text-xs">{{ row.category }}</span>
        </template>
        
        <template #price="{ row }">
          ${{ row.price.toFixed(2) }}
        </template>
        
        <template #rating="{ row }">
          <div class="flex items-center gap-1">
            <Star class="w-4 h-4 text-warning fill-warning" />
            <span class="text-sm">{{ row.rating }}</span>
          </div>
        </template>
        
        <template #status="{ row }">
          <button 
            @click="toggleStatus(row)"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-full transition-colors border shadow-sm"
            :class="row.status ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'"
          >
            {{ row.status ? 'Active' : 'Inactive' }}
          </button>
        </template>

        <template #featured="{ row }">
          <button 
            @click="toggleFeatured(row)"
            class="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-surface active:scale-95"
            :title="row.featured ? 'Unfeature Book' : 'Feature Book'"
          >
            <Star 
              class="w-5 h-5 transition-colors" 
              :class="row.featured ? 'text-warning fill-warning drop-shadow-sm' : 'text-gray-300 hover:text-warning/40'" 
            />
          </button>
        </template>
        
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/books/${row.id}`" class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-info transition-colors">
              <Edit2 class="w-4 h-4" />
            </NuxtLink>
            <button @click="confirmDelete(row)" class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-error transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>
    
    <ConfirmModal 
      v-if="showDeleteModal"
      title="Delete Book"
      :message="`Are you sure you want to delete '${bookToDelete?.title}'? This action cannot be undone.`"
      confirmLabel="Delete"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Plus, Star, Edit2, Trash2 } from 'lucide-vue-next'

const { getBooks, updateBook, deleteBook } = useBooks()
const { getCategories } = useCategories()

const books = ref([])
const categories = ref([])
const totalBooks = ref(0)
const currentPage = ref(1)
const perPage = ref(10)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const fetchCategories = async () => {
  const res = await getCategories()
  if (res && res.ok) {
    categories.value = res.data
  }
}

const fetchBooks = async () => {
  const offset = (currentPage.value - 1) * perPage.value
  const res = await getBooks({
    search: searchQuery.value,
    category: selectedCategory.value,
    limit: perPage.value,
    offset: offset,
  })
  if (res && res.ok) {
    books.value = res.data.books.map(b => ({
      ...b,
      cover: b.cover_url || 'https://via.placeholder.com/48x64',
      category: b.category?.name || 'Uncategorized',
      price: Number(b.price) || 0,
      stock: Number(b.stock) || 0,
      rating: Number(b.rating_average) || 0,
      status: b.is_active,
      featured: b.featured
    }))
    totalBooks.value = res.data.total
  }
}

onMounted(() => {
  fetchCategories()
  fetchBooks()
})

watch([searchQuery, selectedCategory, selectedStatus], () => {
  currentPage.value = 1
  fetchBooks()
})

const onPageChange = (page) => {
  currentPage.value = page
  fetchBooks()
}

const toggleStatus = async (row) => {
  const newStatus = !row.status
  const res = await updateBook(row.id, { is_active: newStatus })
  if (res && res.ok) {
    row.status = newStatus
  } else {
    fetchBooks()
  }
}

const toggleFeatured = async (row) => {
  const newFeatured = !row.featured
  const res = await updateBook(row.id, { featured: newFeatured })
  if (res && res.ok) {
    row.featured = newFeatured
  } else {
    fetchBooks()
  }
}

const columns = [
  { key: 'book', label: 'Book' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'rating', label: 'Rating' },
  { key: 'status', label: 'Status' },
  { key: 'featured', label: 'Featured' },
  { key: 'actions', label: 'Actions' }
]

const showDeleteModal = ref(false)
const bookToDelete = ref(null)

const confirmDelete = (book) => {
  bookToDelete.value = book
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (bookToDelete.value) {
    await deleteBook(bookToDelete.value.id)
    fetchBooks()
  }
  showDeleteModal.value = false
  bookToDelete.value = null
}
</script>
