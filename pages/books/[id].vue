<template>
  <div class="space-y-6 max-w-6xl">
    <div class="flex items-center gap-4">
      <NuxtLink to="/books" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors">
        <ArrowLeft class="w-5 h-5 text-text-secondary" />
      </NuxtLink>
      <h2 class="text-xl font-semibold text-text-primary">{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h2>
    </div>
    
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Form Fields Left 2/3 -->
      <div class="lg:w-2/3 card">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-text-secondary mb-1">Book Title</label>
            <input type="text" v-model="book.title" class="w-full" placeholder="Enter book title" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Author</label>
            <input type="text" v-model="book.author" class="w-full" placeholder="Enter author name" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <select v-model="book.category_id" class="w-full">
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">ISBN</label>
            <input type="text" v-model="book.isbn" class="w-full" placeholder="ISBN-13" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Publisher</label>
            <input type="text" v-model="book.publisher" class="w-full" placeholder="Publisher name" />
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea v-model="book.description" class="w-full h-32 py-2" placeholder="Write a short summary..."></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Price ($)</label>
            <input type="number" step="0.01" v-model="book.price" class="w-full" placeholder="0.00" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Stock</label>
            <input type="number" v-model="book.stock" class="w-full" placeholder="0" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Pages</label>
            <input type="number" v-model="book.pages" class="w-full" placeholder="Number of pages" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Language</label>
            <select v-model="book.language" class="w-full">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Published Date</label>
            <input type="date" v-model="book.published_date" class="w-full" />
          </div>
        </div>
      </div>
      
      <!-- Sidebar Right 1/3 -->
      <div class="lg:w-1/3 flex flex-col gap-6">
        <div class="card">
          <h3 class="text-sm font-medium text-text-secondary mb-4">Cover Image</h3>
          <ImageUpload :initialUrl="book.cover_url" @file-selected="f => selectedCover = f" />
        </div>
        
        <div class="card">
          <h3 class="text-sm font-medium text-text-secondary mb-4">Publishing Status</h3>
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-text-primary">Active Status</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="book.status" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-text-primary">Featured Book</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="book.featured" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-info"></div>
            </label>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <NuxtLink to="/books" class="flex-1 h-10 flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-text-primary hover:bg-surface transition-colors">
            Cancel
          </NuxtLink>
          <button @click="handleSave" class="flex-1 btn-primary">
            {{ isEditing ? 'Save Changes' : 'Create Book' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { getBook, createBook, updateBook, uploadCover } = useBooks()
const { getCategories } = useCategories()

const isEditing = computed(() => route.params.id !== 'new')
const categories = ref([])
const selectedCover = ref(null)

const book = ref({
  title: '',
  author: '',
  category_id: '',
  price: '',
  stock: '',
  status: true,
  featured: false,
  description: '',
  isbn: '',
  publisher: '',
  pages: '',
  language: 'English',
  published_date: '',
  cover_url: null
})

onMounted(async () => {
  const catRes = await getCategories()
  if (catRes && catRes.ok) {
    categories.value = catRes.data
  }

  if (isEditing.value) {
    const bookRes = await getBook(route.params.id)
    if (bookRes && bookRes.ok) {
      const b = bookRes.data
      book.value = {
        ...b,
        category_id: b.category ? b.category.id : '',
        status: b.is_active !== undefined ? b.is_active : true
      }
    }
  }
})

const handleSave = async () => {
  const payload = { ...book.value, is_active: book.value.status }
  delete payload.status
  delete payload.category 
  delete payload.cover_url
  
  if (!payload.published_date) delete payload.published_date
  
  let bookId = route.params.id
  
  if (isEditing.value) {
    await updateBook(bookId, payload)
  } else {
    const res = await createBook(payload)
    if (res && res.ok) {
      bookId = res.data.id
    }
  }

  if (selectedCover.value && bookId !== 'new') {
    await uploadCover(bookId, selectedCover.value)
  }
  
  router.push('/books')
}
</script>
