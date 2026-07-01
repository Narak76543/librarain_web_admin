<template>
  <div class="card !p-0 overflow-hidden">
    <div v-if="loading" class="p-8 text-center text-text-secondary">
      Loading low stock alerts...
    </div>
    <table v-else class="w-full">
      <thead>
        <tr>
          <th class="th text-left">Book</th>
          <th class="th text-center">Current Stock</th>
          <th class="th text-center">Threshold</th>
          <th class="th text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="books.length === 0">
          <td colspan="4" class="p-8 text-center text-green-600 font-medium">All books are sufficiently stocked!</td>
        </tr>
        <tr v-for="book in books" :key="book.id" class="border-b border-border hover:bg-surface/50 transition">
          <td class="td">
            <div class="flex items-center gap-3">
              <img v-if="book.cover_url" :src="book.cover_url" class="w-10 h-14 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-500/20" />
              <div v-else class="w-10 h-14 bg-gray-100 rounded border border-gray-200 dark:border-gray-500/20 flex items-center justify-center">
                <span class="text-xs text-text-secondary">No Image</span>
              </div>
              <span class="font-bold text-text-primary">{{ book.title }}</span>
            </div>
          </td>
          <td class="td text-center font-bold" :class="book.stock <= 0 ? 'text-red-600' : 'text-amber-600'">
            {{ book.stock }}
          </td>
          <td class="td text-center text-text-secondary">{{ book.min_stock_level }}</td>
          <td class="td text-center">
            <span v-if="book.stock <= 0" class="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium inline-flex items-center border bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20">
              OUT OF STOCK
            </span>
            <span v-else class="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium inline-flex items-center border bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20">
              LOW STOCK
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventory } from '~/composables/useInventory'

const books = ref([])
const loading = ref(true)
const { getLowStock } = useInventory()

onMounted(async () => {
  try {
    const res = await getLowStock()
    if (res?.data?.books) {
      books.value = res.data.books
    }
  } catch (error) {
    console.error("Failed to load low stock", error)
  } finally {
    loading.value = false
  }
})
</script>
