<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-primary">Daily Report ({{ formatDate(selectedDate) }})</h2>
      <div class="flex items-center gap-2">
        <label for="reportDate" class="text-sm font-medium text-text-secondary">Select Date:</label>
        <input 
          type="date" 
          id="reportDate" 
          v-model="selectedDate" 
          @change="fetchReport"
          class="bg-surface border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
        />
        <button 
          @click="exportToCSV"
          :disabled="isExporting"
          class="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-primary bg-surface hover:bg-primary/10 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <Download class="w-4 h-4" /> CSV
        </button>
        <button 
          @click="exportToExcel"
          :disabled="isExporting"
          class="px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <Download class="w-4 h-4" /> Excel
        </button>
      </div>
    </div>

    <div v-if="reportData" class="space-y-8">
      
      <!-- Section 3: Owner Snapshot (Moved to top for visibility) -->
      <div>
        <h3 class="text-md font-semibold text-text-primary mb-4">Daily Summary Snapshot</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card bg-card p-5 border border-border">
            <p class="text-sm font-medium text-text-secondary">Revenue Today</p>
            <p class="text-2xl font-bold text-text-primary mt-2">${{ reportData.daily_summary.revenue_today.toFixed(2) }}</p>
          </div>
          <div class="card bg-card p-5 border border-border">
            <p class="text-sm font-medium text-text-secondary">Cost Today</p>
            <p class="text-2xl font-bold text-text-primary mt-2">${{ reportData.daily_summary.cost_today.toFixed(2) }}</p>
          </div>
          <div class="card bg-card p-5 border border-border">
            <p class="text-sm font-medium text-text-secondary">Net Profit</p>
            <p class="text-2xl font-bold text-success mt-2">
              ${{ reportData.daily_summary.net_profit.toFixed(2) }}
              <span class="text-sm text-text-secondary font-normal ml-1" v-if="reportData.daily_summary.revenue_today > 0">
                ({{ ((reportData.daily_summary.net_profit / reportData.daily_summary.revenue_today) * 100).toFixed(0) }}%)
              </span>
            </p>
          </div>
          <div class="card bg-card p-5 border border-border flex flex-col justify-center space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Delivery:</span><span class="font-medium text-text-primary">{{ reportData.daily_summary.by_delivery }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Pick Up:</span><span class="font-medium text-text-primary">{{ reportData.daily_summary.by_pick_up }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">COD / KHQR:</span><span class="font-medium text-text-primary">{{ reportData.daily_summary.paid_by_cod }} / {{ reportData.daily_summary.paid_by_khqr }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 1: Stock In -->
      <div>
        <div class="flex items-end justify-between mb-4">
          <div>
            <h3 class="text-md font-semibold text-text-primary">Stock In (Purchases)</h3>
            <p class="text-sm text-text-secondary">What we bought or added today.</p>
          </div>
          <div class="text-right text-sm">
            <span class="text-text-secondary mr-4">Total Books: <span class="font-medium text-text-primary">{{ reportData.stock_in.summary.total_books_added }}</span></span>
            <span class="text-text-secondary mr-4">Total Qty: <span class="font-medium text-text-primary">{{ reportData.stock_in.summary.total_qty }}</span></span>
            <span class="text-text-secondary">Total Spent: <span class="font-medium text-text-primary">${{ reportData.stock_in.summary.total_spent.toFixed(2) }}</span></span>
          </div>
        </div>
        
        <div class="card !p-0 overflow-hidden border border-border">
          <DataTable 
            :columns="columnsStockIn" 
            :rows="reportData.stock_in.items" 
            :total="reportData.stock_in.items.length"
            :page="1"
            :perPage="Math.max(reportData.stock_in.items.length, 1)"
          >
            <template #cost_price="{ row }">
              ${{ row.cost_price.toFixed(2) }}
            </template>
            <template #total_cost="{ row }">
              ${{ row.total_cost.toFixed(2) }}
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Section 2: Stock Out -->
      <div>
        <div class="flex items-end justify-between mb-4">
          <div>
            <h3 class="text-md font-semibold text-text-primary">Stock Out (Sales)</h3>
            <p class="text-sm text-text-secondary">What we sold today.</p>
          </div>
          <div class="text-right text-sm">
            <span class="text-text-secondary mr-4">Total Orders: <span class="font-medium text-text-primary">{{ reportData.stock_out.summary.total_orders }}</span></span>
            <span class="text-text-secondary mr-4">Total Qty Sold: <span class="font-medium text-text-primary">{{ reportData.stock_out.summary.total_qty_sold }}</span></span>
            <span class="text-text-secondary mr-4">Total Revenue: <span class="font-medium text-text-primary">${{ reportData.stock_out.summary.total_revenue.toFixed(2) }}</span></span>
            <span class="text-text-secondary">Total Profit: <span class="font-medium text-success">${{ reportData.stock_out.summary.total_profit.toFixed(2) }}</span></span>
          </div>
        </div>
        
        <div class="card !p-0 overflow-hidden border border-border">
          <DataTable 
            :columns="columnsStockOut" 
            :rows="reportData.stock_out.items" 
            :total="reportData.stock_out.items.length"
            :page="1"
            :perPage="Math.max(reportData.stock_out.items.length, 1)"
          >
            <template #sale_price="{ row }">
              ${{ row.sale_price.toFixed(2) }}
            </template>
            <template #revenue="{ row }">
              ${{ row.revenue.toFixed(2) }}
            </template>
            <template #profit="{ row }">
              <span class="text-success font-medium">${{ row.profit.toFixed(2) }}</span>
            </template>
          </DataTable>
        </div>
      </div>

    </div>
    
    <!-- Loading State -->
    <div v-else-if="loading" class="flex justify-center items-center h-64 bg-card rounded-xl border border-border">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download } from 'lucide-vue-next'

const { get, getFile } = useApi()
const loading = ref(false)
const isExporting = ref(false)
const reportData = ref(null)

const columnsStockIn = [
  { key: 'title', label: 'Book Title' },
  { key: 'category', label: 'Category' },
  { key: 'qty_added', label: 'Qty Added' },
  { key: 'cost_price', label: 'Cost Price' },
  { key: 'total_cost', label: 'Total Cost' }
]

const columnsStockOut = [
  { key: 'title', label: 'Book Title' },
  { key: 'qty_sold', label: 'Qty Sold' },
  { key: 'sale_price', label: 'Sale Price' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' },
  { key: 'profit', label: 'Profit' }
]

const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDate = ref(getTodayDate())

const fetchReport = async () => {
  loading.value = true
  try {
    const res = await get(`/api/v1/admin/reports/daily?report_date=${selectedDate.value}`)
    if (res && res.ok) {
      reportData.value = res.data
    }
  } catch (error) {
    console.error("Failed to fetch daily report", error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const exportToCSV = () => {
  if (!reportData.value) return;
  
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Daily Summary Snapshot
  csvContent += "Daily Summary Snapshot\n";
  csvContent += `Revenue Today,Cost Today,Net Profit,By Delivery,By Pick Up,COD,KHQR\n`;
  csvContent += `${reportData.value.daily_summary.revenue_today},${reportData.value.daily_summary.cost_today},${reportData.value.daily_summary.net_profit},${reportData.value.daily_summary.by_delivery},${reportData.value.daily_summary.by_pick_up},${reportData.value.daily_summary.paid_by_cod},${reportData.value.daily_summary.paid_by_khqr}\n\n`;
  
  // Stock In
  csvContent += "Stock In (Purchases)\n";
  csvContent += "Book Title,Category,Qty Added,Cost Price,Total Cost\n";
  reportData.value.stock_in.items.forEach(item => {
    // Escape quotes in titles
    const title = item.title.replace(/"/g, '""');
    csvContent += `"${title}","${item.category}",${item.qty_added},${item.cost_price},${item.total_cost}\n`;
  });
  csvContent += `Summary, Total Books:,${reportData.value.stock_in.summary.total_books_added},Total Qty:,${reportData.value.stock_in.summary.total_qty},Total Spent:,${reportData.value.stock_in.summary.total_spent}\n\n`;
  
  // Stock Out
  csvContent += "Stock Out (Sales)\n";
  csvContent += "Book Title,Qty Sold,Sale Price,Revenue,Delivery,Payment,Profit\n";
  reportData.value.stock_out.items.forEach(item => {
    const title = item.title.replace(/"/g, '""');
    csvContent += `"${title}",${item.qty_sold},${item.sale_price},${item.revenue},"${item.delivery}","${item.payment}",${item.profit}\n`;
  });
  csvContent += `Summary, Total Orders:,${reportData.value.stock_out.summary.total_orders},Total Qty:,${reportData.value.stock_out.summary.total_qty_sold},Total Revenue:,${reportData.value.stock_out.summary.total_revenue},Total Profit:,${reportData.value.stock_out.summary.total_profit}\n`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Daily_Report_${selectedDate.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const exportToExcel = async () => {
  isExporting.value = true
  try {
    const blob = await getFile(`/api/v1/admin/reports/daily/export?report_date=${selectedDate.value}`)
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Daily_Report_${selectedDate.value}.xlsx`)
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Failed to export Excel file", error)
  } finally {
    isExporting.value = false
  }
}

onMounted(() => {
  fetchReport()
})
</script>
