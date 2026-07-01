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
          <h1 class="text-2xl font-bold text-text-primary">Daily Report</h1>
          <p class="text-sm text-text-secondary font-medium">{{ formattedDate }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Date picker -->
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
        sub="orders today"
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

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

      <!-- Hourly Sales Bar Chart -->
      <div class="lg:col-span-2 bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 ">
        <h3 class="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Hourly Sales</h3>
        <div class="h-64">
          <Bar v-if="data.hourly_chart?.length" :data="hourlyChartData" :options="barOptions"/>
          <div v-else class="h-full flex items-center justify-center text-text-secondary text-sm">
            No sales data available today
          </div>
        </div>
      </div>

      <!-- Delivery + Payment Pie -->
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

    <!-- Orders Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 mb-4  overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Orders Today</h3>
        <span class="text-xs bg-gray-200 text-text-secondary px-2 py-0.5 rounded-full font-medium">
          {{ data.orders_table?.length ?? 0 }} orders
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">ID</th>
              <th class="th">Customer</th>
              <th class="th">Books</th>
              <th class="th">Delivery</th>
              <th class="th">Partner</th>
              <th class="th">Payment</th>
              <th class="th text-right">Subtotal</th>
              <th class="th text-right">Profit</th>
              <th class="th text-right">Margin</th>
              <th class="th">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.orders_table?.length">
              <td colspan="8" class="text-center py-12 text-text-secondary text-sm">
                No orders today
              </td>
            </tr>
            <tr v-for="(row, i) in data.orders_table" :key="i"
              
              class="border-b border-border hover:bg-surface/50 transition">
              <td class="td font-medium text-primary">#{{ row.order_id }}</td>
              <td class="td font-medium text-text-primary">{{ row.customer }}</td>
              <td class="td">
                <div class="group relative inline-block cursor-help border-b border-dashed border-gray-400">
                  {{ row.books_count }} items
                  <div class="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 bg-gray-900 text-white text-xs rounded shadow-lg left-1/2 transform -translate-x-1/2">
                    <div v-for="(item, idx) in row.items" :key="idx" class="flex justify-between border-b border-gray-700 py-1 last:border-0">
                      <span class="truncate pr-2" :title="item.book_title">{{ item.book_title }} (x{{ item.quantity }} @ ${{ item.unit_price }})</span>
                      <span class="whitespace-nowrap">${{ item.subtotal }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="td text-text-secondary">{{ row.delivery_way }}</td>
              <td class="td">
                <span v-if="row.delivery_way === 'Pick Up'" class="text-gray-300">—</span>
                <span v-else-if="row.delivery_partner" class="text-gray-700">{{ row.delivery_partner }}</span>
                <span v-else class="text-amber-500 text-xs">⚠ No partner</span>
              </td>
              <td class="td font-medium text-text-secondary">{{ row.payment_method }}</td>
              <td class="td text-right font-medium text-text-primary">${{ row.subtotal }}</td>
              <td class="td text-right font-bold text-primary">${{ row.profit }}</td>
              <td class="td text-right">
                <span :class="parseFloat(row.profit_margin) >= 30
                  ? 'text-green-600 font-medium'
                  : parseFloat(row.profit_margin) >= 15
                    ? 'text-amber-600'
                    : 'text-red-500'">
                  {{ row.profit_margin }}
                </span>
              </td>
              <td class="td">
                <StatusBadge :status="row.status"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Table -->
    <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20  overflow-hidden">
      <div class="p-4 border-b border-border bg-surface">
        <h3 class="font-bold text-text-primary">Stock Movement Today</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="th">Book Title</th>
              <th class="th">Category</th>
              <th class="th text-right">Cost Price</th>
              <th class="th text-right">Sale Price</th>
              <th class="th text-center">Sold</th>
              <th class="th text-center">Remaining</th>
              <th class="th text-right">Revenue</th>
              <th class="th text-right">Profit</th>
              <th class="th text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data.stock_table?.length">
              <td colspan="5" class="text-center py-12 text-text-secondary text-sm">
                No stock movement today
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
              <td class="td text-center font-semibold text-text-secondary">{{ row.stock_out_today }}</td>
              <td class="td text-center">
                <span :class="row.remaining_stock < 10
                  ? 'text-red-600 dark:text-red-400 font-bold'
                  : 'text-text-secondary font-medium'">
                  {{ row.remaining_stock }}
                </span>
              </td>
              <td class="td text-right text-primary font-bold">
                ${{ row.revenue_today }}
              </td>
              <td class="td text-right text-primary font-bold">${{ row.profit_today }}</td>
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
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend, Title
} from 'chart.js'
import {
  ArrowLeft, ShoppingBag, DollarSign,
  BookOpen, TrendingUp
} from 'lucide-vue-next'

import KpiCard from '~/components/reports/KpiCard.vue'
import ExportButtons from '~/components/reports/ExportButtons.vue'
import StatusBadge from '~/components/StatusBadge.vue'
import { useClientExport } from '~/composables/useClientExport'

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, ArcElement,
  Tooltip, Legend, Title
)

const { getDailyReport, exportReport } = useReports()

const isLoading   = ref(true)
const isExporting = ref(false)
const selectedDate= ref(new Date().toISOString().slice(0, 10))
const data        = ref({ kpis: {}, orders_table: [], stock_table: [] })

const formattedDate = computed(() => {
  return new Date(selectedDate.value).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric',
    month: 'long', day: 'numeric'
  })
})

const hourlyChartData = computed(() => ({
  labels:   (data.value.hourly_chart ?? []).map(h => h.hour),
  datasets: [{
    label:           'Revenue ($)',
    data:            (data.value.hourly_chart ?? []).map(h => parseFloat(h.revenue)),
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
    const res = await getDailyReport(selectedDate.value)
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
        { key: 'order_id', label: 'Order ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'books_count', label: 'Books' },
        { key: 'delivery_way', label: 'Delivery' },
        { key: 'payment_method', label: 'Payment' },
        { key: 'total', label: 'Total' },
        { key: 'profit', label: 'Profit' },
        { key: 'status', label: 'Status' }
      ]
      exportData('csv', 'daily_report', columns, data.value.orders_table || [], 'Daily Report')
    } else {
      await exportReport('daily', format, { date: selectedDate.value })
    }
  } catch (err) {
    console.error('Export failed', err)
  } finally {
    isExporting.value = false
  }
}

onMounted(fetchReport)
</script>
