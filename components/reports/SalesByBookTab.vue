<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-primary">Sales by Book</h2>
      <div class="flex gap-2">
        <button @click="exportData(rows, columns, 'Sales_By_Book', 'csv')" class="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-primary bg-surface hover:bg-primary/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> CSV
        </button>
        <button @click="exportData(rows, columns, 'Sales_By_Book', 'excel')" class="px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> Excel
        </button>
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
        <template #current_stock="{ row }">
          <span class="font-medium" :class="row.current_stock < 5 ? 'text-error' : 'text-success'">
            {{ row.current_stock }}
          </span>
        </template>
        <template #total_revenue="{ row }">
          ${{ Number(row.total_revenue).toFixed(2) }}
        </template>
        <template #total_profit="{ row }">
          <span :class="row.total_profit >= 0 ? 'text-success font-medium' : 'text-error font-medium'">
            ${{ Number(row.total_profit).toFixed(2) }}
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

const columns = [
  { key: 'book_title', label: 'Book Title' },
  { key: 'quantity_sold', label: 'Quantity Sold' },
  { key: 'current_stock', label: 'Current Stock' },
  { key: 'total_revenue', label: 'Total Revenue' },
  { key: 'total_profit', label: 'Total Profit' },
]

const fetchReport = async () => {
  try {
    const res = await get('/api/v1/admin/reports/sales-by-book')
    if (res && res.ok) {
      rows.value = res.data.rows || []
    }
  } catch (error) {
    console.error("Failed to fetch report", error)
  }
}

onMounted(() => {
  fetchReport()
})
</script>
