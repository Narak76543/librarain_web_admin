<template>
  <div class="card !p-0 overflow-hidden">
    <div v-if="loading" class="p-8 text-center text-text-secondary">
      Loading adjustments ledger...
    </div>
    <table v-else class="w-full">
      <thead>
        <tr>
          <th class="th text-left">Date</th>
          <th class="th text-left">Book</th>
          <th class="th text-left">Reason</th>
          <th class="th text-center">Qty</th>
          <th class="th text-left">Notes</th>
          <th class="th text-left">Adjusted By</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="adjustments.length === 0">
          <td colspan="6" class="p-8 text-center text-text-secondary">No stock adjustments recorded.</td>
        </tr>
        <tr v-for="adj in adjustments" :key="adj.id" class="border-b border-border hover:bg-surface/50 transition">
          <td class="td whitespace-nowrap">{{ new Date(adj.created_at).toLocaleString() }}</td>
          <td class="td font-medium">{{ adj.book_title }}</td>
          <td class="td">
            <span class="px-2 py-1 bg-surface text-text-secondary rounded text-xs font-medium border border-gray-200 dark:border-gray-500/20">
              {{ adj.reason }}
            </span>
          </td>
          <td class="td text-center font-bold" :class="adj.quantity_adjusted > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ adj.quantity_adjusted > 0 ? '+' : '' }}{{ adj.quantity_adjusted }}
          </td>
          <td class="td text-sm text-text-secondary">{{ adj.notes || '-' }}</td>
          <td class="td text-sm text-text-secondary">{{ adj.created_by_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventory } from '~/composables/useInventory'

const adjustments = ref([])
const loading = ref(true)
const { getAdjustments } = useInventory()

onMounted(async () => {
  try {
    const res = await getAdjustments()
    if (res?.data?.adjustments) {
      adjustments.value = res.data.adjustments
    }
  } catch (error) {
    console.error("Failed to load adjustments", error)
  } finally {
    loading.value = false
  }
})
</script>
