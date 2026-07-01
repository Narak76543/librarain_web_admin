<template>
  <div class="space-y-4 max-w-4xl mx-auto">
    <div class="flex items-center gap-4">
      <button @click="navigateTo('/purchase-orders')" class="p-2 hover:bg-surface rounded-lg transition-colors text-text-secondary">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-2xl font-bold text-text-primary">Create Purchase Order</h1>
    </div>

    <div class="bg-card rounded-xl border border-border shadow-sm p-4 space-y-4">
      
      <!-- Supplier Selection -->
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-2">Select Supplier <span class="text-error">*</span></label>
        <div v-if="loadingSuppliers" class="text-sm text-text-secondary flex items-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin" /> Loading suppliers...
        </div>
        <select v-else v-model="selectedSupplier" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary">
          <option value="" disabled>-- Select a supplier --</option>
          <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
            {{ sup.name }} ({{ sup.contact_person || 'No contact' }})
          </option>
        </select>
      </div>

      <!-- Add Books Section -->
      <div class="border-t border-border pt-6">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Line Items</h3>
        
        <div class="flex gap-4 mb-4">
          <div class="flex-1 flex gap-2">
            <select v-model="selectedBookToAdd" class="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary">
              <option value="" disabled>-- Select a book to add --</option>
              <option v-for="book in availableBooks" :key="book.id" :value="book">
                {{ book.title }} (Current Stock: {{ book.stock }}){{ !book.is_active ? ' [DRAFT]' : '' }}
              </option>
            </select>
            <button @click="showQuickAddModal = true" class="bg-surface hover:bg-border text-text-primary px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-border" title="Quick Add New Book">
              <Plus class="w-4 h-4" /> Quick Add
            </button>
          </div>
          <button @click="addBookToPO" :disabled="!selectedBookToAdd" class="bg-surface hover:bg-border text-text-primary px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 border border-border">
            <Plus class="w-4 h-4" /> Add to PO
          </button>
        </div>

        <!-- Quick Add Book Modal -->
        <div v-if="showQuickAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-card w-full max-w-md rounded-xl border border-border shadow-lg p-4 space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-bold text-text-primary">Quick Add New Book (Draft)</h3>
              <button @click="closeQuickAddModal" class="text-text-secondary hover:text-text-primary">
                <X class="w-5 h-5" />
              </button>
            </div>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Book Title <span class="text-error">*</span></label>
                <input type="text" v-model="quickAddForm.title" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" placeholder="e.g. Python 1" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Author <span class="text-error">*</span></label>
                <input type="text" v-model="quickAddForm.author" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" placeholder="e.g. Guido van Rossum" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">ISBN (Optional)</label>
                <input type="text" v-model="quickAddForm.isbn" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" placeholder="e.g. 978-3-16-148410-0" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Default Cost Price ($)</label>
                <input type="number" step="0.01" min="0" v-model.number="quickAddForm.cost_price" class="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button @click="closeQuickAddModal" class="px-4 py-2 rounded-lg text-text-secondary hover:bg-surface border border-border font-medium">
                Cancel
              </button>
              <button @click="handleQuickAddBook" :disabled="quickAddSaving || !quickAddForm.title || !quickAddForm.author" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                <Loader2 v-if="quickAddSaving" class="w-4 h-4 animate-spin" />
                {{ quickAddSaving ? 'Saving...' : 'Add Book' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Line Items Table -->
        <table v-if="poItems.length > 0" class="w-full text-left border-collapse border border-border rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-surface border-b border-border text-text-secondary text-sm">
              <th class="p-3 font-semibold">Book Title</th>
              <th class="p-3 font-semibold w-32">Quantity</th>
              <th class="p-3 font-semibold w-40">Cost Price ($)</th>
              <th class="p-3 font-semibold w-32 text-right">Total ($)</th>
              <th class="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="(item, index) in poItems" :key="item.book.id" class="hover:bg-surface/30">
              <td class="p-3 font-medium text-text-primary">
                {{ item.book.title }}
                <span v-if="!item.book.is_active" class="ml-2 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium">DRAFT</span>
              </td>
              <td class="p-3">
                <input type="number" v-model.number="item.quantity" min="1" class="w-full bg-surface border border-border rounded-md px-2 py-1 text-text-primary focus:outline-none focus:border-primary" />
              </td>
              <td class="p-3">
                <input type="number" v-model.number="item.cost_price" min="0" step="0.01" class="w-full bg-surface border border-border rounded-md px-2 py-1 text-text-primary focus:outline-none focus:border-primary" />
              </td>
              <td class="p-3 text-right font-medium text-text-primary">
                {{ (item.quantity * item.cost_price).toFixed(2) }}
              </td>
              <td class="p-3 text-center">
                <button @click="removeItem(index)" class="text-error hover:text-error/80 p-1">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-surface border-t border-border">
            <tr>
              <td colspan="3" class="p-3 text-right font-semibold text-text-secondary">Grand Total:</td>
              <td class="p-3 text-right font-bold text-primary text-lg">${{ grandTotal.toFixed(2) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <div v-else class="text-center p-4 border border-dashed border-border rounded-lg text-text-secondary">
          No books added to this purchase order yet.
        </div>
      </div>

      <!-- Notes -->
      <div class="border-t border-border pt-6">
        <label class="block text-sm font-medium text-text-secondary mb-2">Notes (Optional)</label>
        <textarea v-model="notes" rows="3" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary" placeholder="Enter any additional details about this PO..."></textarea>
      </div>

      <!-- Actions -->
      <div class="border-t border-border pt-6 flex justify-end gap-3">
        <button @click="navigateTo('/purchase-orders')" class="px-6 py-2 rounded-lg font-medium text-text-secondary hover:bg-surface transition-colors border border-border">
          Cancel
        </button>
        <button @click="submitPO" :disabled="saving || !selectedSupplier || poItems.length === 0" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Submitting...' : 'Create Purchase Order' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { ArrowLeft, Plus, Trash2, Loader2, X } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { navigateTo } from 'nuxt/app'

const { get, post } = useApi()
const suppliers = ref([])
const availableBooks = ref([])
const loadingSuppliers = ref(true)

const selectedSupplier = ref("")
const selectedBookToAdd = ref("")
const notes = ref("")
const poItems = ref([])
const saving = ref(false)

const showQuickAddModal = ref(false)
const quickAddSaving = ref(false)
const quickAddForm = reactive({
  title: '',
  author: '',
  isbn: '',
  cost_price: 0
})

const grandTotal = computed(() => {
  return poItems.value.reduce((total, item) => total + (item.quantity * item.cost_price), 0)
})

const fetchBooks = async () => {
  try {
    const res = await get('/api/v1/books?status=all&limit=200')
    if (res?.data?.books) {
      availableBooks.value = res.data.books
    }
  } catch (error) {
    console.error("Error fetching books:", error)
  }
}

onMounted(async () => {
  // Fetch Suppliers
  try {
    const res = await get('/api/v1/suppliers')
    if (res?.data?.suppliers) {
      suppliers.value = res.data.suppliers.filter(s => s.is_active)
    }
  } catch (error) {
    console.error("Error fetching suppliers:", error)
  } finally {
    loadingSuppliers.value = false
  }

  // Fetch Books
  await fetchBooks()
})

const addBookToPO = () => {
  if (!selectedBookToAdd.value) return
  
  // Check if already in list
  const exists = poItems.value.find(i => i.book.id === selectedBookToAdd.value.id)
  if (exists) {
    exists.quantity += 1
  } else {
    poItems.value.push({
      book: selectedBookToAdd.value,
      quantity: 1,
      // Default to 60% of sale price if cost_price is 0, or use existing cost_price
      cost_price: selectedBookToAdd.value.cost_price > 0 ? selectedBookToAdd.value.cost_price : parseFloat((selectedBookToAdd.value.price * 0.6).toFixed(2))
    })
  }
  
  selectedBookToAdd.value = ""
}

const removeItem = (index) => {
  poItems.value.splice(index, 1)
}

const closeQuickAddModal = () => {
  showQuickAddModal.value = false
  quickAddForm.title = ''
  quickAddForm.author = ''
  quickAddForm.isbn = ''
  quickAddForm.cost_price = 0
}

const handleQuickAddBook = async () => {
  if (!quickAddForm.title || !quickAddForm.author) return
  quickAddSaving.value = true
  try {
    const payload = {
      title: quickAddForm.title,
      author: quickAddForm.author,
      isbn: quickAddForm.isbn || null,
      cost_price: quickAddForm.cost_price || 0,
      price: 0, // 0 initially for drafts
      is_active: false // Explicitly draft
    }
    const res = await post('/api/v1/books', payload)
    if (res?.ok && res?.data) {
      const newBook = res.data
      availableBooks.value.unshift(newBook)
      // Automatically add it to the PO
      poItems.value.push({
        book: newBook,
        quantity: 1,
        cost_price: payload.cost_price
      })
      closeQuickAddModal()
    } else {
      alert("Failed to quick add book: " + (res?.message || "unknown error"))
    }
  } catch (e) {
    console.error(e)
    alert("Error creating book.")
  } finally {
    quickAddSaving.value = false
  }
}

const submitPO = async () => {
  if (!selectedSupplier.value || poItems.value.length === 0) return
  
  saving.value = true
  
  const payload = {
    supplier_id: selectedSupplier.value,
    note: notes.value,
    items: poItems.value.map(i => ({
      book_id: i.book.id,
      quantity: i.quantity,
      cost_price: i.cost_price
    }))
  }
  
  try {
    const res = await post('/api/v1/purchase-orders', payload)
    
    if (res?.ok) {
      navigateTo('/purchase-orders')
    }
  } catch (error) {
    console.error("Error creating PO:", error)
  } finally {
    saving.value = false
  }
}
</script>
