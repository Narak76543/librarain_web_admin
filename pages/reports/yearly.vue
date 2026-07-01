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
          <h1 class="text-2xl font-bold text-text-primary">Yearly Report</h1>
          <p class="text-sm text-text-secondary font-medium">Performance for Year {{ selectedYear }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Year picker dropdown -->
        <select v-model="selectedYear"
          @change="fetchReport"
          class="h-10 bg-card border border-border rounded-lg px-3 text-sm bg-card focus:border-primary focus:ring-1 focus:ring-primary outline-none">
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
        <!-- Export buttons -->
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
        label="Total Orders"
        :value="data.kpis.total_orders"
        sub="orders this year"
        :icon="ShoppingBag"
        icon-bg="bg-green-50 dark:bg-green-500/10"
        icon-color="text-primary"
      />
      <KpiCard
        label="Total Revenue"
        :value="`$${data.kpis.total_revenue}`"
        sub="gross revenue"
        :icon="DollarSign"
        icon-bg="bg-blue-50 dark:bg-blue-500/10"
        icon-color="text-blue-600"
        value-color="text-blue-600"
      />
      <KpiCard
        label="Books Sold"
        :value="data.kpis.total_books_sold"
        sub="copies sold"
        :icon="BookOpen"
        icon-bg="bg-amber-50 dark:bg-amber-500/10"
        icon-color="text-amber-600"
      />
      <KpiCard
        label="Net Profit"
        :value="`$${data.kpis.total_profit}`"
        sub="after cost"
        :icon="TrendingUp"
        icon-bg="bg-purple-50 dark:bg-purple-500/10"
        icon-color="text-purple-600"
        value-color="text-purple-600"
      />
    </div>

    <!-- Highlight KPI (Best Month & Average Monthly Revenue) -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded p-4 text-white flex items-center justify-between ">
        <div>
          <p class="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Best Month</p>
          <h4 class="text-2xl font-bold mt-1">{{ data.kpis.best_month }}</h4>
        </div>
        <div class="p-3 bg-card/20 rounded-lg">
          <Calendar :size="24"/>
        </div>
      </div>
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded p-4 text-white flex items-center justify-between ">
        <div>
          <p class="text-xs font-semibold text-blue-100 uppercase tracking-wider">Average Monthly Revenue</p>
          <h4 class="text-2xl font-bold mt-1">${{ data.kpis.avg_monthly_revenue }}</h4>
        </div>
        <div class="p-3 bg-card/20 rounded-lg">
          <TrendingUp :size="24"/>
        </div>
      </div>
    </div>

    <!-- Charts Row 1: Monthly Revenue Trend (Jan -> Dec) -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4  mb-4">
      <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Monthly Revenue Trend</h3>
      <div class="h-64">
        <Line v-if="data.monthly_revenue_chart?.length" :data="revenueChartData" :options="lineOptions"/>
        <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
          No monthly data available
        </div>
      </div>
    </div>

    <!-- Charts Row 2: Monthly Orders and Top Books -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <!-- Monthly Orders Bar Chart -->
      <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Monthly Orders</h3>
        <div class="h-64">
          <Bar v-if="data.monthly_orders_chart?.length" :data="ordersChartData" :options="barOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No orders trend data
          </div>
        </div>
      </div>

      <!-- Top 10 Books Chart -->
      <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Top 10 Books (by Qty Sold)</h3>
        <div class="h-64">
          <Bar v-if="data.top_books_chart?.length" :data="topBooksChartData" :options="barOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No top books data
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Summary Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 mb-4  overflow-hidden">
      <div class="p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Monthly Performance Summary</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Month</th>
              <th class="th text-center">Orders</th>
              <th class="th text-right">Revenue</th>
              <th class="th text-center">Books Sold</th>
              <th class="th text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.monthly_table?.length">
              <td colspan="5" class="text-center py-12 text-text-secondary text-sm">
                No data available
              </td>
            </tr>
            <tr v-for="(row, i) in data.monthly_table" :key="i"
              
              class="border-b border-border hover:bg-surface/50 transition">
              <td class="td font-medium text-text-primary">{{ row.month }}</td>
              <td class="td text-center font-semibold">{{ row.orders }}</td>
              <td class="td text-right font-bold text-text-primary">${{ row.revenue }}</td>
              <td class="td text-center font-medium text-text-secondary">{{ row.books_sold }}</td>
              <td class="td text-right font-bold text-primary">${{ row.profit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20  overflow-hidden">
      <div class="p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Stock Performance Summary (Yearly)</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Book Title</th>
              <th class="th text-center">Total Sold</th>
              <th class="th text-center">Remaining Stock</th>
              <th class="th text-right">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.stock_table?.length">
              <td colspan="4" class="text-center py-12 text-text-secondary text-sm">
                No stock movement this year
              </td>
            </tr>
            <tr v-for="(row, i) in data.stock_table" :key="i"
              
              class="border-b border-border hover:bg-surface/50 transition">
              <td class="td font-bold text-text-primary">{{ row.book_title }}</td>
              <td class="td text-center font-bold text-blue-600">{{ row.total_sold }}</td>
              <td class="td text-center">
                <span :class="row.remaining < 10
                  ? 'text-red-600 dark:text-red-400 font-bold'
                  : 'text-text-secondary font-semibold'">
                  {{ row.remaining }}
                </span>
              </td>
              <td class="td text-right text-primary font-bold">
                ${{ row.total_revenue }}
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
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Tooltip, Legend, Title
} from 'chart.js'
import {
  ArrowLeft, ShoppingBag, DollarSign,
  BookOpen, TrendingUp, Calendar
} from 'lucide-vue-next'
import { useReports } from '~/composables/useReports'
import { useClientExport } from '~/composables/useClientExport'

import KpiCard from '~/components/reports/KpiCard.vue'
import ExportButtons from '~/components/reports/ExportButtons.vue'

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement,
  Tooltip, Legend, Title
)

const { getYearlyReport, exportReport } = useReports()

const isLoading   = ref(true)
const isExporting = ref(false)
const selectedYear = ref(new Date().getFullYear())

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const yearsList = []
  for (let y = currentYear - 3; y <= currentYear + 2; y++) {
    yearsList.push(y)
  }
  return yearsList
})

const data        = ref({ kpis: {}, monthly_revenue_chart: [], monthly_orders_chart: [], top_books_chart: [], monthly_table: [], stock_table: [] })

const revenueChartData = computed(() => ({
  labels:   (data.value.monthly_revenue_chart ?? []).map(m => m.month),
  datasets: [
    {
      label:           'Revenue ($)',
      data:            (data.value.monthly_revenue_chart ?? []).map(m => parseFloat(m.revenue)),
      borderColor:     '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.05)',
      tension:         0.3,
      fill:            true,
    },
    {
      label:           'Profit ($)',
      data:            (data.value.monthly_revenue_chart ?? []).map(m => parseFloat(m.profit)),
      borderColor:     '#7C3AED',
      backgroundColor: 'rgba(124, 58, 237, 0.05)',
      tension:         0.3,
      fill:            true,
    }
  ]
}))

const ordersChartData = computed(() => ({
  labels:   (data.value.monthly_orders_chart ?? []).map(m => m.month),
  datasets: [{
    label:           'Orders',
    data:            (data.value.monthly_orders_chart ?? []).map(m => m.orders),
    backgroundColor: '#3B82F6',
    borderRadius:    4,
  }]
}))

const topBooksChartData = computed(() => ({
  labels:   (data.value.top_books_chart ?? []).map(b => b.title),
  datasets: [{
    label:           'Copies Sold',
    data:            (data.value.top_books_chart ?? []).map(b => b.qty_sold),
    backgroundColor: '#F59E0B',
    borderRadius:    4,
  }]
}))

const lineOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true } },
  scales:  {
    y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
    x: { grid: { display: false } }
  }
}

const barOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales:  {
    y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
    x: { grid: { display: false } }
  }
}

const fetchReport = async () => {
  isLoading.value = true
  try {
    const res = await getYearlyReport(selectedYear.value)
    if (res.ok) data.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleExport = async (format) => {
  isExporting.value = true
  try {
    if (format === 'csv') {
      const { exportData } = useClientExport()
      const columns = [
        { key: 'month', label: 'Month' },
        { key: 'orders', label: 'Total Orders' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'books_sold', label: 'Books Sold' },
        { key: 'profit', label: 'Profit' }
      ]
      exportData('csv', 'yearly_report', columns, data.value.monthly_table || [], 'Yearly Report')
    } else {
      await exportReport('yearly', format, { year: selectedYear.value })
    }
  } catch (err) {
    console.error('Export failed', err)
  } finally {
    isExporting.value = false
  }
}

onMounted(fetchReport)
</script>
