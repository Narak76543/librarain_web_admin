<template>
  <div class="space-y-6 max-w-6xl">
    <div class="flex items-center gap-4">
      <NuxtLink to="/inventory" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors">
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
            <label class="block text-sm font-medium text-text-secondary mb-1">Cost Price ($)</label>
            <input type="number" step="0.01" v-model="book.cost_price" class="w-full" placeholder="0.00" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Sale Price ($)</label>
            <input type="number" step="0.01" v-model="book.price" class="w-full" placeholder="0.00" />
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
            <button 
              type="button"
              @click="book.status = !book.status"
              class="px-2.5 py-1 text-[11px] font-semibold rounded-full transition-colors border shadow-sm"
              :class="book.status ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'"
            >
              {{ book.status ? 'Active' : 'Inactive' }}
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-text-primary">Featured Book</span>
            <button 
              type="button"
              @click="book.featured = !book.featured"
              class="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-surface active:scale-95"
            >
              <Star 
                class="w-5 h-5 transition-colors" 
                :class="book.featured ? 'text-warning fill-warning drop-shadow-sm' : 'text-gray-300 hover:text-warning/40'" 
              />
            </button>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <NuxtLink to="/inventory" class="flex-1 h-10 flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-text-primary hover:bg-surface transition-colors">
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
  cost_price: '',
  price: '',
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
    const updateRes = await updateBook(bookId, payload)
    if (!updateRes || !updateRes.ok) {
      alert('Failed to update book. Please check your inputs.')
      return
    }
  } else {
    payload.stock = 0 // Initialize stock to 0 for new books
    const res = await createBook(payload)
    if (res && res.ok) {
      bookId = res.data.id
    } else {
      alert('Failed to create book. Please check your inputs.')
      return
    }
  }

  if (selectedCover.value && bookId !== 'new') {
    await uploadCover(bookId, selectedCover.value)
  }
  
  router.push('/inventory')
}
</script>
