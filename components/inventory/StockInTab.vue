<template>
  <div class="space-y-6">
    <div class="card max-w-2xl">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Stock In</h2>
        <p class="text-sm text-text-secondary">Add new stock for an existing book in the inventory.</p>
      </div>

      <form @submit.prevent="handleStockIn" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">Select Book</label>
          <select v-model="form.book_id" class="w-full bg-card border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required>
            <option value="" disabled>-- Choose a Book --</option>
            <option v-for="book in books" :key="book.id" :value="book.id">
              {{ book.title }} (Current Stock: {{ book.stock }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">Quantity to Add</label>
          <input type="number" v-model.number="form.quantity" min="1" class="w-full bg-card border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required placeholder="e.g. 50" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Cost Price (Supplier Price)</label>
            <input type="number" step="0.01" v-model.number="form.cost_price" class="w-full bg-card border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required placeholder="0.00" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Sale Price</label>
            <input type="number" step="0.01" v-model.number="form.sale_price" class="w-full bg-card border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required placeholder="0.00" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">Notes / Reason (Optional)</label>
          <textarea v-model="form.notes" class="w-full bg-card border border-border rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Restock from supplier ABC"></textarea>
        </div>

        <div class="pt-4 border-t border-border flex justify-end">
          <button type="submit" class="btn-primary flex items-center gap-2" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Add Stock
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

const { getBooks, updateBook } = useBooks()
const { post } = useApi()

const books = ref([])
const isSubmitting = ref(false)

const form = reactive({
  book_id: '',
  quantity: '',
  cost_price: '',
  sale_price: '',
  notes: ''
})

onMounted(async () => {
  const res = await getBooks({ limit: 100 })
  if (res && res.ok) {
    books.value = res.data.books || []
  }
})

watch(() => form.book_id, (newId) => {
  if (newId) {
    const selectedBook = books.value.find(b => b.id === newId)
    if (selectedBook) {
      form.sale_price = selectedBook.price || 0
    }
  }
})

const handleStockIn = async () => {
  if (!form.book_id || !form.quantity || form.quantity <= 0) return

  isSubmitting.value = true
  try {
    const res = await post(`/api/v1/books/${form.book_id}/stock-in`, form)
    if (res && res.ok) {
      alert('Stock added successfully!')
      resetForm()
      return
    }
  } catch (error) {
    console.error('Failed to add stock:', error)
    alert('Failed to add stock. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = async () => {
  form.book_id = ''
  form.quantity = ''
  form.cost_price = ''
  form.sale_price = ''
  form.notes = ''
  
  const res = await getBooks({ limit: 100 })
  if (res && res.ok) {
    books.value = res.data.books || []
  }
}
</script>
