<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-primary">Overview</h2>
      <div class="flex gap-2">
        <button @click="downloadReport('csv')" class="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-primary bg-surface hover:bg-primary/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> CSV
        </button>
        <button @click="downloadReport('excel')" class="px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10 rounded transition-colors flex items-center gap-1">
          <Download class="w-4 h-4" /> Excel
        </button>
      </div>
    </div>


    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4" v-if="summary">
      <div class="card bg-card p-4 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary"></span>
          <p class="text-sm font-medium text-text-secondary">Total Books</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">{{ summary.total_books }}</p>
      </div>
      <div class="card bg-card p-4 animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-info"></span>
          <p class="text-sm font-medium text-text-secondary">Total Stock</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">{{ summary.total_stock }}</p>
      </div>
      <div class="card bg-card p-4 animate-fade-in-up" style="animation-delay: 0.3s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-error"></span>
          <p class="text-sm font-medium text-text-secondary">Total Cost</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">${{ summary.total_cost.toFixed(2) }}</p>
      </div>
      <div class="card bg-card p-4 animate-fade-in-up" style="animation-delay: 0.4s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-success"></span>
          <p class="text-sm font-medium text-text-secondary">Total Revenue</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">${{ summary.total_revenue.toFixed(2) }}</p>
      </div>
      <div class="card bg-card p-4 animate-fade-in-up" style="animation-delay: 0.5s">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-warning"></span>
          <p class="text-sm font-medium text-text-secondary">Profit Margin</p>
        </div>
        <p class="text-3xl font-semibold text-text-primary mt-3">${{ summary.profit_margin.toFixed(2) }}</p>
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
        <template #total_invested="{ row }">
          ${{ Number(row.total_invested).toFixed(2) }}
        </template>
        <template #cost_price="{ row }">
          ${{ Number(row.cost_price).toFixed(2) }}
        </template>
        <template #sale_price="{ row }">
          ${{ Number(row.sale_price).toFixed(2) }}
        </template>
        <template #stock_value="{ row }">
          ${{ Number(row.stock_value).toFixed(2) }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'

const { getStockReport } = useReports()

const period = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const rows = ref([])
const summary = ref(null)

const columns = [
  { key: 'book_title', label: 'Book Title' },
  { key: 'category', label: 'Category' },
  { key: 'total_stock_in', label: 'Total Qty Bought' },
  { key: 'total_invested', label: 'Total Invested' },
  { key: 'stock', label: 'Current Stock' },
  { key: 'cost_price', label: 'Cost Price' },
  { key: 'sale_price', label: 'Sale Price' },
  { key: 'stock_value', label: 'Stock Value' },
  { key: 'created_at', label: 'Date Added' },
]

const fetchReport = async () => {
  try {
    const res = await getStockReport({
      period: period.value === 'custom' ? '' : period.value,
      date_from: period.value === 'custom' ? dateFrom.value : '',
      date_to: period.value === 'custom' ? dateTo.value : '',
    })

    if (res && res.ok) {
      rows.value = res.data.rows || []
      summary.value = res.data.summary || null
    }
  } catch (error) {
    console.error("Failed to fetch report", error)
  }
}

const downloadReport = async (format) => {
  try {
    const res = await getStockReport({
      period: period.value === 'custom' ? '' : period.value,
      date_from: period.value === 'custom' ? dateFrom.value : '',
      date_to: period.value === 'custom' ? dateTo.value : '',
      exportFormat: format
    })

    if (res) {
      // Create an object URL from the Blob response
      const url = window.URL.createObjectURL(res)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `stock_report_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'csv'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error(`Failed to download ${format}`, error)
  }
}

onMounted(() => {
  fetchReport()
})
</script>
