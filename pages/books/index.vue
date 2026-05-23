<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="relative">
          <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search books..." class="pl-9 w-64 bg-white" />
        </div>
        
        <select class="bg-white min-w-[150px]">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        
        <select class="bg-white min-w-[120px]">
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
        :total="243"
        :page="1"
        :perPage="10"
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
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" :checked="row.status">
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
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
import { ref } from 'vue'
import { Search, Plus, Star, Edit2, Trash2 } from 'lucide-vue-next'

const { books, categories } = useMockData()

const columns = [
  { key: 'book', label: 'Book' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'rating', label: 'Rating' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const showDeleteModal = ref(false)
const bookToDelete = ref(null)

const confirmDelete = (book) => {
  bookToDelete.value = book
  showDeleteModal.value = true
}

const handleDelete = () => {
  // Mock delete
  showDeleteModal.value = false
  bookToDelete.value = null
}
</script>
