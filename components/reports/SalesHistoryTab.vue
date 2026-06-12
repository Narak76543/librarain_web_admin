<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-primary">Sales History</h2>
      <div class="flex gap-2">
        <button @click="exportData(rows, columns, 'Sales_History', 'csv')" class="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-primary bg-surface hover:bg-primary/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> CSV
        </button>
        <button @click="exportData(rows, columns, 'Sales_History', 'excel')" class="px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> Excel
        </button>
      </div>
    </div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="summary">
      <div class="card bg-card p-5 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-success"></span>
          <p class="text-sm font-medium text-text-secondary">Total Sales Revenue</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">${{ summary.total_sales.toFixed(2) }}</p>
      </div>
      <div class="card bg-card p-5 animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary"></span>
          <p class="text-sm font-medium text-text-secondary">Total Profit</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">${{ summary.total_profit.toFixed(2) }}</p>
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
        <template #sale_price="{ row }">
          ${{ Number(row.sale_price).toFixed(2) }}
        </template>
        <template #cost_price="{ row }">
          ${{ Number(row.cost_price).toFixed(2) }}
        </template>
        <template #profit="{ row }">
          <span :class="row.profit >= 0 ? 'text-success font-medium' : 'text-error font-medium'">
            ${{ Number(row.profit).toFixed(2) }}
          </span>
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
  { key: 'order_id', label: 'Order ID' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'book_title', label: 'Book Title' },
  { key: 'quantity', label: 'Qty' },
  { key: 'sale_price', label: 'Sale Price' },
  { key: 'cost_price', label: 'Cost Price' },
  { key: 'profit', label: 'Profit' },
]

const fetchReport = async () => {
  try {
    const res = await get('/api/v1/admin/reports/sales')
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
