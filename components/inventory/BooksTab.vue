<template>
  <div class="space-y-4">
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
        
        <template #stock="{ row }">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ row.stock }}</span>
            <button v-if="row.stock > 0" @click="viewBatches(row)" class="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors font-semibold uppercase tracking-wider">
              Batches
            </button>
          </div>
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
          <div class="flex items-center">
            <span v-if="row.stock <= 0" class="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium inline-flex items-center border bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20">OUT OF STOCK</span>
            <span v-else-if="row.stock <= (row.min_stock_level || 5)" class="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium inline-flex items-center border bg-yellow-50/50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20">LOW STOCK</span>
            <span v-else class="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium inline-flex items-center border bg-green-50/50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20">IN STOCK</span>
          </div>
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
            <button 
              @click="openAdjustModal(row)" 
              class="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
              title="Adjust Stock"
            >
              <Settings2 class="w-4 h-4" />
            </button>
            <NuxtLink :to="`/books/${row.id}`" class="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-surface text-text-secondary hover:text-info transition-colors">
              <Edit2 class="w-4 h-4" />
            </NuxtLink>
            <button @click="confirmDelete(row)" class="w-8 h-8 flex items-center justify-center rounded border border-border hover:bg-surface text-text-secondary hover:text-error transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>
    
    <AdjustStockModal 
      v-if="selectedBookToAdjust" 
      :book="selectedBookToAdjust"
      @close="selectedBookToAdjust = null"
      @success="onStockAdjusted"
    />
    
    <ConfirmModal 
      v-if="showDeleteModal"
      title="Delete Book"
      :message="`Are you sure you want to delete '${bookToDelete?.title}'? This action cannot be undone.`"
      confirmLabel="Delete"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>

  <!-- Batches Modal -->
  <div v-if="showBatchesModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden">
      <div class="p-6 border-b border-border flex items-center justify-between bg-surface">
        <div>
          <h3 class="text-lg font-bold text-text-primary">Stock Batches</h3>
          <p class="text-sm text-text-secondary mt-1">Active inventory for "{{ selectedBookForBatches?.title }}"</p>
        </div>
        <button @click="showBatchesModal = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <div v-if="loadingBatches" class="flex justify-center py-8">
          <div class="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
        <div v-else-if="batches.length === 0" class="text-center py-8 text-text-secondary">
          No active stock batches found.
        </div>
        <div v-else class="space-y-3">
          <div v-for="(batch, i) in batches" :key="batch.id" class="flex items-center justify-between p-4 rounded-lg border border-border bg-surface">
            <div>
              <div class="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Batch {{ i + 1 }}</div>
              <div class="text-sm text-text-primary">Remaining: <span class="font-bold">{{ batch.remaining_quantity }}</span> / {{ batch.initial_quantity }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Cost Price</div>
              <div class="font-bold text-text-primary">${{ Number(batch.unit_cost_price).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Plus, Star, Edit2, Trash2, Settings2, X, Filter } from 'lucide-vue-next'
import { useInventory } from '~/composables/useInventory'
import DataTable from '~/components/DataTable.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import AdjustStockModal from '~/components/inventory/AdjustStockModal.vue'

const emit = defineEmits(['stock-adjusted'])

const { getBooks, updateBook, deleteBook } = useBooks()
const { getCategories } = useCategories()
const { getBookBatches } = useInventory()

const books = ref([])
const categories = ref([])
const totalBooks = ref(0)
const currentPage = ref(1)
const perPage = ref(10)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const selectedBookToAdjust = ref(null)
const showBatchesModal = ref(false)
const selectedBookForBatches = ref(null)
const batches = ref([])
const loadingBatches = ref(false)

const openAdjustModal = (book) => {
  selectedBookToAdjust.value = book
}

const onStockAdjusted = (data) => {
  selectedBookToAdjust.value = null
  fetchBooks()
  emit('stock-adjusted')
}

const fetchCategories = async () => {
  const res = await getCategories()
  if (res && res.ok) {
    categories.value = res.data
  }
}

const viewBatches = async (book) => {
  selectedBookForBatches.value = book
  showBatchesModal.value = true
  loadingBatches.value = true
  batches.value = []
  
  const res = await getBookBatches(book.id)
  if (res && res.ok) {
    batches.value = res.data
  }
  loadingBatches.value = false
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
      min_stock_level: Number(b.min_stock_level) || 5,
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
  { key: 'status', label: 'Stock Status' },
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
