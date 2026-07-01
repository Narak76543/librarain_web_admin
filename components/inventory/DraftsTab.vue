<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-text-primary">Drafts & Pricing</h2>
        <p class="text-sm text-text-secondary">Set pricing and details for received books before publishing them to the store.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-lg w-full"></div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-card rounded border border-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface border-b border-border text-text-secondary text-sm">
              <th class="p-3 font-semibold">Book Info</th>
              <th class="p-3 font-semibold">ISBN</th>
              <th class="p-3 font-semibold text-right">Cost Price ($)</th>
              <th class="p-3 font-semibold text-right">Warehouse Stock</th>
              <th class="p-3 font-semibold text-center">Status</th>
              <th class="p-3 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="draftBooks.length === 0">
              <td colspan="6" class="text-center py-12 text-text-secondary text-sm">
                No draft books requiring pricing.
              </td>
            </tr>
            <tr v-for="book in draftBooks" :key="book.id" class="border-b border-border hover:bg-surface/50 transition">
              <td class="p-3">
                <div>
                  <p class="font-semibold text-text-primary">{{ book.title }}</p>
                  <p class="text-xs text-text-secondary">By {{ book.author }}</p>
                </div>
              </td>
              <td class="p-3 text-text-secondary text-sm">
                {{ book.isbn || '-' }}
              </td>
              <td class="p-3 text-right font-medium text-text-primary">
                ${{ Number(book.cost_price).toFixed(2) }}
              </td>
              <td class="p-3 text-right">
                <span class="font-bold" :class="book.stock > 0 ? 'text-text-primary' : 'text-text-secondary'">
                  {{ book.stock }}
                </span>
              </td>
              <td class="p-3 text-center">
                <span class="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-wider">
                  Draft (Unpriced)
                </span>
              </td>
              <td class="p-3 text-center">
                <button @click="openPublishModal(book)" class="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                  Publish to Store
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Publish Modal -->
    <div v-if="showPublishModal" class="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
      <div class="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg p-4 space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-border">
          <div>
            <h3 class="text-lg font-bold text-text-primary">Set Pricing & Publish</h3>
            <p class="text-xs text-text-secondary">Configure details for: <span class="font-semibold text-text-primary">{{ selectedBook?.title }}</span></p>
          </div>
          <button @click="closePublishModal" class="text-text-secondary hover:text-text-primary">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text-secondary mb-1">Cost Price (Supplier)</label>
              <input type="text" disabled :value="`$${Number(selectedBook?.cost_price).toFixed(2)}`" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-secondary cursor-not-allowed outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text-secondary mb-1">Selling Price <span class="text-error">*</span></label>
              <input type="number" step="0.01" min="0" v-model.number="publishForm.price" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary font-bold" placeholder="e.g. 15.99" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-text-secondary mb-1">Category <span class="text-error">*</span></label>
            <select v-model="publishForm.category_id" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary">
              <option value="" disabled>-- Select a category --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-text-secondary mb-1">Description</label>
            <textarea v-model="publishForm.description" rows="4" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" placeholder="Write a summary description for the store app..."></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-border">
          <button @click="closePublishModal" class="px-4 py-2 rounded-lg text-text-secondary hover:bg-surface border border-border font-medium text-sm">
            Cancel
          </button>
          <button @click="handlePublish" :disabled="publishing || !publishForm.price || !publishForm.category_id" class="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
            <Loader2 v-if="publishing" class="w-4 h-4 animate-spin" />
            {{ publishing ? 'Publishing...' : 'Publish to Store' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import { useBooks } from '~/composables/useBooks'
import { useCategories } from '~/composables/useCategories'

const emit = defineEmits(['published'])

const { getBooks, updateBook } = useBooks()
const { getCategories } = useCategories()

const draftBooks = ref([])
const categories = ref([])
const loading = ref(true)

const showPublishModal = ref(false)
const publishing = ref(false)
const selectedBook = ref(null)

const publishForm = reactive({
  price: '',
  category_id: '',
  description: ''
})

const fetchDrafts = async () => {
  loading.value = true
  try {
    const res = await getBooks({ status: 'draft', limit: 100 })
    if (res?.data?.books) {
      draftBooks.value = res.data.books
    }
  } catch (e) {
    console.error('Failed to fetch drafts:', e)
  } finally {
    loading.value = false
  }
}

const fetchCategoriesList = async () => {
  try {
    const res = await getCategories()
    if (res?.data) {
      categories.value = res.data
    }
  } catch (e) {
    console.error('Failed to fetch categories:', e)
  }
}

onMounted(() => {
  fetchDrafts()
  fetchCategoriesList()
})

const openPublishModal = (book) => {
  selectedBook.value = book
  publishForm.price = book.price > 0 ? book.price : ''
  publishForm.category_id = book.category_id || ''
  publishForm.description = book.description || ''
  showPublishModal.value = true
}

const closePublishModal = () => {
  showPublishModal.value = false
  selectedBook.value = null
  publishForm.price = ''
  publishForm.category_id = ''
  publishForm.description = ''
}

const handlePublish = async () => {
  if (!selectedBook.value || !publishForm.price || !publishForm.category_id) return
  publishing.value = true
  try {
    const payload = {
      price: publishForm.price,
      category_id: publishForm.category_id,
      description: publishForm.description,
      is_active: true // Switch to active
    }
    const res = await updateBook(selectedBook.value.id, payload)
    if (res?.ok) {
      closePublishModal()
      await fetchDrafts()
      emit('published')
    } else {
      alert("Failed to publish book.")
    }
  } catch (e) {
    console.error(e)
    alert("Error publishing book.")
  } finally {
    publishing.value = false
  }
}
</script>
