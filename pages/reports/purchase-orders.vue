<template>
  <div class="p-4">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/reports"
          class="p-2 rounded-lg hover:bg-gray-100 transition">
          <ArrowLeft :size="18"/>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-text-primary">Purchase Orders Report</h1>
          <p class="text-sm text-text-secondary font-medium">Overview of supplier spending and PO statuses</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="statusFilter" @change="fetchReport" class="bg-card border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 transition-colors">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select v-model="periodFilter" @change="fetchReport" class="bg-card border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 transition-colors">
          <option value="all">All Time</option>
          <option value="24h">Today</option>
          <option value="7d">This Week</option>
          <option value="30d">This Month</option>
        </select>
        <ExportButtons @export="handleExport" :loading="isExporting"/>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div v-for="i in 4" :key="i"
        class="h-28 bg-gray-100 rounded animate-pulse"/>
    </div>

    <!-- KPI Cards -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <KpiCard
        label="Total POs"
        :value="stats.totalCount"
        sub="All time"
        :icon="FileText"
        icon-bg="bg-blue-50 dark:bg-blue-500/10"
        icon-color="text-blue-600"
      />
      <KpiCard
        label="Total Spent"
        :value="`$${stats.totalSpent.toFixed(2)}`"
        sub="Gross expenses"
        :icon="DollarSign"
        icon-bg="bg-red-50 dark:bg-red-500/10"
        icon-color="text-red-600"
        value-color="text-red-600"
      />
      <KpiCard
        label="Pending Amount"
        :value="`$${stats.pendingAmount.toFixed(2)}`"
        :sub="`${stats.pendingCount} pending POs`"
        :icon="Clock"
        icon-bg="bg-amber-50 dark:bg-amber-500/10"
        icon-color="text-amber-600"
        value-color="text-amber-600"
      />
      <KpiCard
        label="Received POs"
        :value="stats.receivedCount"
        sub="Stock delivered"
        :icon="CheckCircle"
        icon-bg="bg-green-50 dark:bg-green-500/10"
        icon-color="text-green-600"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

      <!-- Spending by Supplier -->
      <div class="lg:col-span-2 bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Spending By Supplier</h3>
        <div class="h-64">
          <Bar v-if="supplierChartData.labels.length" :data="supplierChartData" :options="barOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No supplier data available
          </div>
        </div>
      </div>

      <!-- PO Status Pie -->
      <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 flex flex-col justify-between">
        <div>
          <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">PO Status Breakdown</h3>
          <div class="h-64">
            <Doughnut v-if="statusChartData.labels.length" :data="statusChartData" :options="pieOptions"/>
            <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
              No status data
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Data Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 mb-4 overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Purchase Orders History</h3>
        <span class="text-xs bg-gray-200 text-text-secondary px-2 py-0.5 rounded-full font-medium">
          {{ purchaseOrders.length }} records
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr>
              <th class="th">PO Number</th>
              <th class="th">Supplier</th>
              <th class="th">Ordered At</th>
              <th class="th text-right">Total Cost</th>
              <th class="th">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!purchaseOrders.length">
              <td colspan="5" class="text-center py-12 text-text-secondary text-sm">
                No purchase orders found
              </td>
            </tr>
            <tr v-for="(po, i) in purchaseOrders" :key="po.id"
              class="border-b border-border hover:bg-surface/50 transition cursor-pointer"
              @click="navigateTo(`/purchase-orders/${po.id}`)">
              <td class="td font-medium text-primary">{{ po.po_number }}</td>
              <td class="td font-medium text-text-primary">{{ po.supplier_name }}</td>
              <td class="td text-text-secondary">{{ formatDate(po.ordered_at) }}</td>
              <td class="td text-right font-bold text-text-primary">${{ po.total_cost.toFixed(2) }}</td>
              <td class="td">
                <span :class="getStatusClass(po.status)" class="px-2 py-1 rounded text-[11px] font-medium uppercase tracking-wider border">
                  {{ po.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend, Title
} from 'chart.js'
import {
  ArrowLeft, FileText, DollarSign,
  CheckCircle, Clock
} from 'lucide-vue-next'
import { navigateTo } from 'nuxt/app'
import { useApi } from '~/composables/useApi'
import { useClientExport } from '~/composables/useClientExport'

import KpiCard from '~/components/reports/KpiCard.vue'
import ExportButtons from '~/components/reports/ExportButtons.vue'

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, ArcElement,
  Tooltip, Legend, Title
)

const { get } = useApi()
const { exportData } = useClientExport()

const isLoading = ref(true)
const isExporting = ref(false)
const purchaseOrders = ref([])

const stats = ref({
  totalCount: 0,
  totalSpent: 0,
  pendingCount: 0,
  pendingAmount: 0,
  receivedCount: 0
})

const supplierData = ref({})
const statusData = ref({})

const periodFilter = ref('all')
const statusFilter = ref('all')

const fetchReport = async () => {
  isLoading.value = true
  try {
    const res = await get(`/api/v1/purchase-orders?period=${periodFilter.value}&status_filter=${statusFilter.value}`)
    if (res?.data?.purchase_orders) {
      const pos = res.data.purchase_orders
      purchaseOrders.value = pos
      
      let totalSpent = 0
      let pendingCount = 0
      let pendingAmount = 0
      let receivedCount = 0
      
      const supplierMap = {}
      const statusMap = {}

      pos.forEach(po => {
        totalSpent += po.total_cost
        
        if (po.status === 'pending') {
          pendingCount++
          pendingAmount += po.total_cost
        } else if (po.status === 'received') {
          receivedCount++
        }
        
        // Group by supplier
        if (!supplierMap[po.supplier_name]) supplierMap[po.supplier_name] = 0
        supplierMap[po.supplier_name] += po.total_cost
        
        // Group by status
        if (!statusMap[po.status]) statusMap[po.status] = 0
        statusMap[po.status]++
      })

      stats.value = {
        totalCount: pos.length,
        totalSpent,
        pendingCount,
        pendingAmount,
        receivedCount
      }
      
      supplierData.value = supplierMap
      statusData.value = statusMap
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const supplierChartData = computed(() => {
  const sortedSuppliers = Object.entries(supplierData.value)
    .sort((a, b) => b[1] - a[1]) // Sort by highest spending
    
  return {
    labels: sortedSuppliers.map(s => s[0]),
    datasets: [{
      label: 'Total Spent ($)',
      data: sortedSuppliers.map(s => s[1]),
      backgroundColor: '#EF4444', // Red for expenses
      borderRadius: 6,
    }]
  }
})

const statusChartData = computed(() => {
  return {
    labels: Object.keys(statusData.value).map(s => s.toUpperCase()),
    datasets: [{
      data: Object.values(statusData.value),
      backgroundColor: ['#F59E0B', '#10B981', '#EF4444'], // Pending, Received, Cancelled
      borderWidth: 0,
    }]
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
    x: { grid: { display: false } }
  }
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
  }
}

const handleExport = (format) => {
  isExporting.value = true
  try {
    const columns = [
      { key: 'po_number', label: 'PO Number' },
      { key: 'supplier_name', label: 'Supplier' },
      { key: 'ordered_at', label: 'Ordered At' },
      { key: 'total_cost', label: 'Total Cost' },
      { key: 'status', label: 'Status' }
    ]
    
    const formattedData = purchaseOrders.value.map(po => ({
      ...po,
      ordered_at: formatDate(po.ordered_at),
      status: po.status.toUpperCase()
    }))

    exportData(format, 'purchase_orders_report', columns, formattedData, 'Purchase Orders Report')
  } catch (err) {
    console.error('Export failed', err)
    alert('Failed to export report.')
  } finally {
    isExporting.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'border-yellow-200 dark:border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    case 'received': return 'border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
    case 'cancelled': return 'border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
    default: return 'border-gray-200 dark:border-gray-500/20 bg-gray-50/50 dark:bg-gray-500/10 text-text-secondary'
  }
}

onMounted(fetchReport)
</script>
