<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-primary">Stock-In History</h2>
      <div class="flex gap-2">
        <button @click="exportData(rows, columns, 'StockIn_History', 'csv')" class="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-primary bg-surface hover:bg-primary/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> CSV
        </button>
        <button @click="exportData(rows, columns, 'StockIn_History', 'excel')" class="px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> Excel
        </button>
      </div>
    </div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="summary">
      <div class="card bg-card p-5 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-info"></span>
          <p class="text-sm font-medium text-text-secondary">Total Books Added</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">{{ summary.total_books_added }}</p>
      </div>
      <div class="card bg-card p-5 animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-warning"></span>
          <p class="text-sm font-medium text-text-secondary">Total Cost Invested</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">${{ summary.total_cost_invested.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card !p-0 overflow-hidden">
      <DataTable 
        :columns="columns" 
        :rows="rows" 
        :total="rows.length"
        :page="1"
        :perPage="Math.max(rows.length, 1)"
      >
        <template #date="{ row }">
          {{ new Date(row.date).toLocaleString() }}
        </template>
        <template #current_stock="{ row }">
          <span class="font-medium" :class="row.current_stock < 5 ? 'text-error' : 'text-success'">
            {{ row.current_stock }}
          </span>
        </template>
        <template #cost_price="{ row }">
          ${{ row.cost_price.toFixed(2) }}
        </template>
        <template #sale_price="{ row }">
          ${{ Number(row.sale_price).toFixed(2) }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'

const { get } = useApi()
const { exportData } = useExport()

const rows = ref([])
const summary = ref(null)

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'book_title', label: 'Book Title' },
  { key: 'quantity', label: 'Qty Added' },
  { key: 'current_stock', label: 'Current Stock' },
  { key: 'cost_price', label: 'Cost Price' },
  { key: 'sale_price', label: 'Sale Price' },
  { key: 'admin', label: 'Processed By' },
]

const fetchReport = async () => {
  try {
    const res = await get('/api/v1/admin/reports/stock-in')
    if (res && res.ok) {
      rows.value = res.data.rows || []
      summary.value = res.data.summary || null
    }
  } catch (error) {
    console.error("Failed to fetch report", error)
  }
}

onMounted(() => {
  fetchReport()
})
</script>
