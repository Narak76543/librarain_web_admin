<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-2">
      <div>
        <h2 class="text-lg font-semibold text-text-primary">Stock Movements Log</h2>
        <p class="text-sm text-text-secondary">A complete audit trail of all inventory transactions.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-lg w-full"></div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-card rounded border border-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="th">Date</th>
              <th class="th">Book Title</th>
              <th class="th text-center">Type</th>
              <th class="th text-right">Quantity</th>
              <th class="th text-right">Remaining Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="movements.length === 0">
              <td colspan="5" class="text-center py-12 text-text-secondary text-sm">
                No stock movements found.
              </td>
            </tr>
            <tr v-for="m in movements" :key="m.id" class="border-b border-border hover:bg-surface/50 transition">
              <td class="td text-text-secondary whitespace-nowrap">
                {{ formatDate(m.created_at) }}
              </td>
              <td class="td font-medium text-text-primary">
                {{ m.book_title }}
              </td>
              <td class="td text-center">
                <span :class="getTypeClass(m.transaction_type)" class="px-2 py-1 rounded text-[11px] font-medium uppercase tracking-wider border">
                  {{ m.transaction_type }}
                </span>
              </td>
              <td class="td text-right font-medium" :class="m.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ m.quantity > 0 ? '+' : '' }}{{ m.quantity }}
              </td>
              <td class="td text-right font-semibold text-text-primary">
                {{ m.current_stock }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventory } from '~/composables/useInventory'

const { getMovements } = useInventory()
const movements = ref([])
const loading = ref(true)

const fetchLog = async () => {
  loading.value = true
  try {
    const res = await getMovements()
    if (res?.data?.movements) {
      movements.value = res.data.movements
    }
  } catch (e) {
    console.error('Failed to fetch stock movements:', e)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const getTypeClass = (type) => {
  switch (type.toLowerCase()) {
    case 'purchase': return 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'sale': return 'border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'
    case 'adjustment': return 'border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
    case 'damaged': return 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
    default: return 'border-gray-200 dark:border-gray-500/20 bg-gray-50 dark:bg-gray-500/10 text-text-secondary'
  }
}

const truncate = (str, len) => {
  if (!str) return ''
  return str.substring(0, len) + '...'
}

onMounted(() => {
  fetchLog()
})
</script>
