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
            <input type="text" class="w-full" placeholder="Enter book title" :value="isEditing ? book.title : ''" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Author</label>
            <input type="text" class="w-full" placeholder="Enter author name" :value="isEditing ? book.author : ''" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <select class="w-full">
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name" :selected="isEditing && book.category === cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">ISBN</label>
            <input type="text" class="w-full" placeholder="ISBN-13" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Publisher</label>
            <input type="text" class="w-full" placeholder="Publisher name" />
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea class="w-full h-32 py-2" placeholder="Write a short summary..."></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Price ($)</label>
            <input type="number" step="0.01" class="w-full" placeholder="0.00" :value="isEditing ? book.price : ''" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Stock</label>
            <input type="number" class="w-full" placeholder="0" :value="isEditing ? book.stock : ''" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Pages</label>
            <input type="number" class="w-full" placeholder="Number of pages" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Language</label>
            <select class="w-full">
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Published Date</label>
            <input type="date" class="w-full" />
          </div>
        </div>
      </div>
      
      <!-- Sidebar Right 1/3 -->
      <div class="lg:w-1/3 flex flex-col gap-6">
        <div class="card">
          <h3 class="text-sm font-medium text-text-secondary mb-4">Cover Image</h3>
          <ImageUpload />
        </div>
        
        <div class="card">
          <h3 class="text-sm font-medium text-text-secondary mb-4">Publishing Status</h3>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-text-primary">Active Status</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" :checked="isEditing ? book.status : true">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <NuxtLink to="/books" class="flex-1 h-10 flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-text-primary hover:bg-surface transition-colors">
            Cancel
          </NuxtLink>
          <button class="flex-1 btn-primary">
            {{ isEditing ? 'Save Changes' : 'Create Book' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const { books, categories } = useMockData()

const isEditing = computed(() => route.params.id !== 'new')
const book = computed(() => {
  if (!isEditing.value) return {}
  return books.find(b => b.id === route.params.id) || books[0]
})
</script>
