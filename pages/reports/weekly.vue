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
          <h1 class="text-2xl font-bold text-text-primary">Weekly Report</h1>
          <p class="text-sm text-text-secondary font-medium">{{ data.week_label || 'Loading...' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Date picker to select week -->
        <input type="date" v-model="selectedDate"
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
        sub="orders this week"
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

    <!-- Average daily highlight card -->
    <div v-if="!isLoading" class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded p-4 text-white flex items-center justify-between  mb-4">
      <div>
        <p class="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Average Daily Revenue</p>
        <h4 class="text-2xl font-bold mt-1">${{ data.kpis.avg_daily_revenue }}</h4>
      </div>
      <div class="p-3 bg-card/20 rounded-lg">
        <TrendingUp :size="24"/>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

      <!-- Daily Sales Trend Bar Chart (Mon -> Sun) -->
      <div class="lg:col-span-2 bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Daily Sales Trend (Mon-Sun)</h3>
        <div class="h-64">
          <Bar v-if="data.daily_chart?.length" :data="dailyChartData" :options="barOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No trend data available for this week
          </div>
        </div>
      </div>

      <!-- Delivery & Payment Breakdown Donuts -->
      <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4  flex flex-col justify-between">
        <div>
          <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Delivery Method</h3>
          <div class="h-36">
            <Doughnut v-if="data.delivery_chart?.length" :data="deliveryChartData" :options="pieOptions"/>
            <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
              No delivery data
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-4 mt-4">
          <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Payment Method</h3>
          <div class="h-36">
            <Doughnut v-if="data.payment_chart?.length" :data="paymentChartData" :options="pieOptions"/>
            <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
              No payment data
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Revenue Trend Chart -->
    <div class="bg-card rounded-xl border border-gray-200 dark:border-gray-500/20 p-5 mb-4">
      <h3 class="font-semibold text-text-primary mb-4 uppercase tracking-wider text-sm">Revenue Trend</h3>
      <div class="h-64">
        <Line :data="trendChartData" :options="lineOptions" />
      </div>
    </div>

    <!-- Daily Summary Table -->
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
                No daily data available for this week
              </td>
            </tr>
            <tr v-for="(row, i) in data.daily_table" :key="i"
              
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
        <h3 class="font-bold text-text-primary">Stock Movement (Weekly)</h3>
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
                No stock movement this week
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
import { Bar, Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Title
} from 'chart.js'
import { ArrowLeft, CalendarDays, ShoppingCart, DollarSign, Package, TrendingUp, ChevronLeft, ChevronRight, Truck, CreditCard, BookOpen, ShoppingBag } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { useReports } from '~/composables/useReports'
import { useClientExport } from '~/composables/useClientExport'

import KpiCard from '~/components/reports/KpiCard.vue'
import ExportButtons from '~/components/reports/ExportButtons.vue'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement,
  Tooltip, Legend, Title
)

const { getWeeklyReport, exportReport } = useReports()

const isLoading   = ref(true)
const isExporting = ref(false)
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const data        = ref({ kpis: {}, daily_chart: [], delivery_chart: [], payment_chart: [], daily_table: [], stock_table: [] })

const dailyChartData = computed(() => ({
  labels:   (data.value.daily_chart ?? []).map(d => d.day),
  datasets: [{
    label:           'Revenue ($)',
    data:            (data.value.daily_chart ?? []).map(d => parseFloat(d.revenue)),
    backgroundColor: '#059669',
    borderRadius:    6,
  }]
}))

const deliveryChartData = computed(() => ({
  labels:   (data.value.delivery_chart ?? []).map(d => d.method),
  datasets: [{
    data:            (data.value.delivery_chart ?? []).map(d => d.count),
    backgroundColor: ['#059669', '#1D4ED8', '#F59E0B', '#EF4444'],
    borderWidth:     0,
  }]
}))

const paymentChartData = computed(() => ({
  labels:   (data.value.payment_chart ?? []).map(p => p.method),
  datasets: [{
    data:            (data.value.payment_chart ?? []).map(p => p.count),
    backgroundColor: ['#059669', '#7C3AED'],
    borderWidth:     0,
  }]
}))

const trendChartData = computed(() => ({
  labels:   (data.value.daily_table ?? []).map(d => d.date),
  datasets: [{
    label:           'Revenue ($)',
    data:            (data.value.daily_table ?? []).map(d => parseFloat(d.revenue)),
    borderColor:     '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    fill:            true,
    tension:         0.3,
    pointBackgroundColor: '#059669',
    pointRadius:     4,
  }]
}))

const lineOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
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

const pieOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
  }
}

const fetchReport = async () => {
  isLoading.value = true
  try {
    const res = await getWeeklyReport(selectedDate.value)
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
      exportData('csv', 'weekly_report', columns, data.value.daily_table || [], 'Weekly Report')
    } else {
      await exportReport('weekly', format, { date: selectedDate.value })
    }
  } catch (err) {
    console.error('Export failed', err)
  } finally {
    isExporting.value = false
  }
}

onMounted(fetchReport)
</script>
