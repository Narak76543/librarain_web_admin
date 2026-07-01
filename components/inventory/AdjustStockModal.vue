<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-border">
        <h3 class="text-lg font-bold text-text-primary">Adjust Stock</h3>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-secondary transition">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-4 space-y-4">
        <div>
          <p class="text-sm text-text-secondary mb-1">Book</p>
          <p class="font-bold text-text-primary">{{ book.title }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-text-secondary mb-1">Current Stock</p>
            <p class="font-bold text-lg text-text-primary">{{ book.stock }}</p>
          </div>
          <div>
            <p class="text-sm text-text-secondary mb-1">New Stock</p>
            <p class="font-bold text-lg" :class="newStock < 0 ? 'text-red-600' : 'text-primary'">{{ newStock }}</p>
          </div>
        </div>

        <div class="space-y-3 pt-4 border-t border-border">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Adjustment Quantity</label>
            <input 
              type="number" 
              v-model.number="quantity"
              class="w-full input border border-border rounded-lg p-2 bg-card"
              placeholder="e.g. -2 for lost, +5 for found"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Reason</label>
            <select v-model="reason" class="w-full input border border-border rounded-lg p-2 bg-card">
              <option value="Damaged">Damaged</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found (Inventory Audit)</option>
              <option value="Audit Correction">Audit Correction</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Notes (Optional)</label>
            <textarea 
              v-model="notes"
              class="w-full input border border-border rounded-lg p-2 resize-none h-20 bg-card"
              placeholder="Provide details about the adjustment..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-border bg-gray-50 dark:bg-gray-500/10 flex justify-end gap-3">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-text-secondary bg-card border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500/10 transition">
          Cancel
        </button>
        <button 
          @click="submit" 
          :disabled="loading || newStock < 0 || quantity === 0"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
          Confirm Adjustment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import { useInventory } from '~/composables/useInventory'

const props = defineProps({
  book: { type: Object, required: true }
})
const emit = defineEmits(['close', 'success'])

const quantity = ref(0)
const reason = ref('Damaged')
const notes = ref('')
const loading = ref(false)

const newStock = computed(() => (props.book.stock || 0) + (quantity.value || 0))

const { adjustStock } = useInventory()

const submit = async () => {
  if (newStock.value < 0 || quantity.value === 0) return
  
  loading.value = true
  try {
    const res = await adjustStock({
      book_id: props.book.id,
      quantity_adjusted: quantity.value,
      reason: reason.value,
      notes: notes.value
    })
    
    if (res?.ok) {
      emit('success', res.data)
    } else {
      alert("Failed to adjust stock")
    }
  } catch (error) {
    alert("Error adjusting stock: " + error.message)
  } finally {
    loading.value = false
  }
}
</script>
