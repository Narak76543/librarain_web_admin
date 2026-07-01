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
          <h1 class="text-2xl font-bold text-text-primary">Monthly Report</h1>
          <p class="text-sm text-text-secondary font-medium">{{ data.month_name || 'Loading...' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Month picker -->
        <input type="month" v-model="selectedMonth"
          @change="fetchReport"
          class="h-10 bg-card border border-border rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"/>
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
        sub="orders this month"
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
        label="Best Seller"
        :value="data.kpis.best_selling_book"
        sub="top book"
        :icon="BookOpen"
        icon-bg="bg-amber-50 dark:bg-amber-500/10"
        icon-color="text-amber-600"
        value-color="text-amber-700 text-lg"
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

    <!-- Charts Row 1: Daily Revenue Trend Line Chart -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4  mb-4">
      <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Daily Revenue Trend</h3>
      <div class="h-64">
        <Line v-if="data.daily_revenue_chart?.length" :data="lineChartData" :options="lineOptions"/>
        <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
          No daily trend data available
        </div>
      </div>
    </div>

    <!-- Charts Row 2: Category and Top Books -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <!-- Category Donut Chart -->
      <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Books by Category</h3>
        <div class="h-64">
          <Doughnut v-if="data.category_chart?.length" :data="categoryChartData" :options="pieOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No category data available
          </div>
        </div>
      </div>

      <!-- Top 5 Books Bar Chart -->
      <div class="lg:col-span-2 bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Top 5 Books (by Qty Sold)</h3>
        <div class="h-64">
          <Bar v-if="data.top_books_chart?.length" :data="topBooksChartData" :options="topBooksOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No book sales data available
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 mb-4  overflow-hidden">
      <div class="p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Daily Sales Summary</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Date</th>
              <th class="th text-center">Orders</th>
              <th class="th text-right">Revenue</th>
              <th class="th text-center">Books Sold</th>
              <th class="th text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.daily_table?.length">
              <td colspan="5" class="text-center py-12 text-text-secondary text-sm">
                No daily data available
              </td>
            </tr>
            <tr v-for="(row, i) in data.daily_table" :key="i"
              :class="i % 2 === 0 ? 'bg-card' : 'bg-gray-50/50 dark:bg-gray-500/10'"
              class="border-b border-border hover:bg-surface/50 transition">
              <td class="td font-medium text-text-primary">{{ row.date }}</td>
              <td class="td text-center font-semibold">
                <span v-if="row.orders === 0" class="text-gray-300 text-xs">No sales</span>
                <span v-else>{{ row.orders }}</span>
              </td>
              <td class="td text-right font-bold text-text-primary">
                <span v-if="row.revenue === '0.00'" class="text-gray-300">—</span>
                <span v-else>${{ row.revenue }}</span>
              </td>
              <td class="td text-center font-medium text-text-secondary">
                <span v-if="row.books_sold === 0" class="text-gray-300">—</span>
                <span v-else>{{ row.books_sold }}</span>
              </td>
              <td class="td text-right font-bold text-primary">
                <span v-if="row.profit === '0.00'" class="text-gray-300">—</span>
                <span v-else>${{ row.profit }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20  overflow-hidden">
      <div class="p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Stock Movement (Monthly)</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Book Title</th>
              <th class="th">Category</th>
              <th class="th text-right">Cost Price</th>
              <th class="th text-right">Sale Price</th>
              <th class="th text-center">Opening Stock</th>
              <th class="th text-center">Stock In</th>
              <th class="th text-center">Stock Out</th>
              <th class="th text-center">Closing Stock</th>
              <th class="th text-right">Revenue</th>
              <th class="th text-right">Profit</th>
              <th class="th text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.stock_table?.length">
              <td colspan="7" class="text-center py-12 text-text-secondary text-sm">
                No stock movement this month
              </td>
            </tr>
            <tr v-for="(row, i) in data.stock_table" :key="i"
              class="border-b border-border hover:bg-surface/50 transition">
              <td class="td font-bold text-text-primary">
                {{ row.book_title }}
                <span v-if="!row.has_real_cost" class="text-xs text-amber-500" title="Estimated cost price">
                  ~estimated
                </span>
              </td>
              <td class="td">
                <span class="px-2 py-0.5 bg-surface text-text-secondary text-xs font-semibold rounded-md border border-border">
                  {{ row.category }}
                </span>
              </td>
              <td class="td text-right text-text-secondary">${{ row.cost_price }}</td>
              <td class="td text-right text-text-secondary">${{ row.sale_price }}</td>
              <td class="td text-center font-medium text-text-secondary">{{ row.opening_stock }}</td>
              <td class="td text-center font-semibold text-blue-600">{{ row.stock_in }}</td>
              <td class="td text-center font-semibold text-amber-600">{{ row.stock_out }}</td>
              <td class="td text-center">
                <span :class="row.closing_stock < 10
                  ? 'text-red-600 dark:text-red-400 font-bold'
                  : 'text-text-secondary font-semibold'">
                  {{ row.closing_stock }}
                </span>
              </td>
              <td class="td text-right text-primary font-bold">${{ row.total_revenue }}</td>
              <td class="td text-right text-primary font-bold">${{ row.profit }}</td>
              <td class="td text-right">
                <span :class="parseFloat(row.profit_margin) >= 30
                  ? 'text-green-600 font-medium'
                  : parseFloat(row.profit_margin) >= 15
                    ? 'text-amber-600'
                    : 'text-red-500'">
                  {{ row.profit_margin }}
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
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Tooltip, Legend, Title
} from 'chart.js'
import {
  ArrowLeft, ShoppingBag, DollarSign,
  BookOpen, TrendingUp
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

const { getMonthlyReport, exportReport } = useReports()

const isLoading   = ref(true)
const isExporting = ref(false)
// default to current month in YYYY-MM
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const data        = ref({ kpis: {}, daily_revenue_chart: [], category_chart: [], top_books_chart: [], daily_table: [], stock_table: [] })

const lineChartData = computed(() => ({
  labels:   (data.value.daily_revenue_chart ?? []).map(d => d.day),
  datasets: [{
    label:           'Revenue ($)',
    data:            (data.value.daily_revenue_chart ?? []).map(d => parseFloat(d.revenue)),
    borderColor:     '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    tension:         0.3,
    fill:            true,
  }]
}))

const categoryChartData = computed(() => ({
  labels:   (data.value.category_chart ?? []).map(c => c.category),
  datasets: [{
    data:            (data.value.category_chart ?? []).map(c => c.count),
    backgroundColor: ['#059669', '#1D4ED8', '#F59E0B', '#EF4444', '#7C3AED', '#EC4899'],
    borderWidth:     0,
  }]
}))

const topBooksChartData = computed(() => ({
  labels:   (data.value.top_books_chart ?? []).map(b => b.title),
  datasets: [{
    label:           'Copies Sold',
    data:            (data.value.top_books_chart ?? []).map(b => b.qty_sold),
    backgroundColor: '#3B82F6',
    borderRadius:    6,
  }]
}))

const lineOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales:  {
    y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
    x: { grid: { display: false } }
  }
}

const topBooksOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales:  {
    y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
    x: { grid: { display: false } }
  }
}

const pieOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
  }
}

const fetchReport = async () => {
  isLoading.value = true
  try {
    const [year, month] = selectedMonth.value.split('-')
    const res = await getMonthlyReport(parseInt(month), parseInt(year))
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
        { key: 'date', label: 'Date' },
        { key: 'orders', label: 'Total Orders' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'books_sold', label: 'Books Sold' },
        { key: 'profit', label: 'Profit' }
      ]
      exportData('csv', 'monthly_report', columns, data.value.daily_table || [], 'Monthly Report')
    } else {
      const [year, month] = selectedMonth.value.split('-')
      await exportReport('monthly', format, { month: parseInt(month), year: parseInt(year) })
    }
  } catch (err) {
    console.error('Export failed', err)
  } finally {
    isExporting.value = false
  }
}

onMounted(fetchReport)
</script>
