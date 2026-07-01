<template>
  <div class="space-y-8 pb-10">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Analytics Overview</h1>
        <p class="text-sm text-text-secondary mt-1">Welcome back, Admin. Here is your bookstore's performance.</p>
      </div>
      <!-- Time filter -->
      <div class="flex gap-2">
        <div class="relative">
          <select 
            v-model="period" 
            @change="fetchDashboardData"
            class="appearance-none bg-card border border-border text-text-secondary pl-9 pr-8 py-2 rounded-lg text-sm font-medium hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20  cursor-pointer"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <CalendarIcon class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Skeletons while loading -->
    <div v-if="isLoading" class="space-y-8 animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="h-32 bg-card rounded-xl border border-border "></div>
      </div>
      <div class="h-96 bg-card rounded-xl border border-border "></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="h-64 bg-card rounded-xl border border-border "></div>
        <div class="h-64 bg-card rounded-xl border border-border "></div>
      </div>
    </div>

    <div v-else class="space-y-8">
      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKpiCard title="Revenue Today" :value="formatCurrency(data.kpis.revenue_today)" :trend="data.kpis.revenue_trend" icon="DollarSign" color="green" />
        <DashboardKpiCard title="Net Profit" :value="formatCurrency(data.kpis.net_profit)" :trend="data.kpis.profit_trend" icon="Briefcase" color="blue" />
        <DashboardKpiCard title="Books Sold" :value="data.kpis.books_sold.toString()" :trend="data.kpis.books_sold_trend" icon="BookOpen" color="purple" />
        <DashboardKpiCard title="Inventory Value" :value="formatCurrency(data.kpis.inventory_value)" trend="" icon="Archive" color="indigo" />
      </div>

      <!-- Sales Overview (Area Chart) -->
      <div class="bg-card p-4 rounded-xl border border-border ">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-sm font-semibold text-text-primary mb-1">Sales Overview</h3>
            <p class="text-xs text-text-secondary mb-0">Financial performance comparison for the selected period</p>
          </div>
          <div class="flex bg-surface p-1 rounded-lg">
            <button @click="graphPeriod = 'this_month'; fetchGraphData()" :class="graphPeriod === 'this_month' ? 'bg-card  text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'" class="px-3 py-1.5 text-xs font-medium rounded-md transition-all">This Month</button>
            <button @click="graphPeriod = 'prev_month'; fetchGraphData()" :class="graphPeriod === 'prev_month' ? 'bg-card  text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'" class="px-3 py-1.5 text-xs font-medium rounded-md transition-all">Previous Month</button>
          </div>
        </div>
        <div class="h-72 w-full">
          <ClientOnly>
            <apexchart :key="chartKey" type="area" height="100%" :options="salesChartOptions" :series="salesSeries"></apexchart>
          </ClientOnly>
        </div>
      </div>

      <!-- Stock In / Out -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-card p-4 rounded-xl border border-border ">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-semibold text-text-primary">Stock In Today</h3>
            <span class="text-[10px] font-bold text-text-secondary border border-border bg-surface px-2 py-1 rounded">ARRIVALS</span>
          </div>
          <div class="h-56 w-full">
            <ClientOnly>
              <apexchart type="bar" height="100%" :options="stockInOptions" :series="stockInSeries"></apexchart>
            </ClientOnly>
          </div>
        </div>
        <div class="bg-card p-4 rounded-xl border border-border ">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-semibold text-text-primary">Stock Out Today</h3>
            <span class="text-[10px] font-bold text-text-secondary border border-border bg-surface px-2 py-1 rounded">SALES</span>
          </div>
          <div class="h-56 w-full">
            <ClientOnly>
              <apexchart type="bar" height="100%" :options="stockOutOptions" :series="stockOutSeries"></apexchart>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Analytics Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Delivery -->
        <div class="bg-card p-4 rounded-xl border border-border  flex flex-col">
          <h3 class="text-sm font-semibold text-text-primary mb-6">Delivery Analytics</h3>
          <div class="flex-1 flex items-center justify-center">
            <ClientOnly>
              <apexchart type="donut" width="220" :options="deliveryOptions" :series="deliverySeries"></apexchart>
            </ClientOnly>
          </div>
        </div>

        <!-- Payment -->
        <div class="bg-card p-4 rounded-xl border border-border  flex flex-col">
          <h3 class="text-sm font-semibold text-text-primary mb-6">Payment Analytics</h3>
          <div class="flex-1 flex items-center justify-center">
            <ClientOnly>
              <apexchart type="donut" width="220" :options="paymentOptions" :series="paymentSeries"></apexchart>
            </ClientOnly>
          </div>
        </div>

        <!-- Profit Breakdown -->
        <div class="bg-card p-4 rounded-xl border border-border  flex flex-col">
          <h3 class="text-sm font-semibold text-text-primary mb-6">Profit Breakdown Today</h3>
          <div class="flex-1 w-full">
             <ClientOnly>
              <apexchart type="bar" height="200" :options="waterfallOptions" :series="waterfallSeries"></apexchart>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Best Selling Books -->
      <div class="bg-card rounded-xl border border-border  overflow-hidden">
        <div class="p-4 border-b border-gray-50 flex justify-between items-center">
          <h3 class="text-sm font-semibold text-text-primary">Best Selling Books</h3>
          <NuxtLink to="/books" class="text-xs font-semibold text-[#059669] hover:underline">View All Books</NuxtLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="book in data.best_sellers" :key="book.title" class="p-4 flex items-center gap-4 hover:bg-surface transition-colors">
            <img :src="book.cover_url || '/placeholder.png'" class="w-12 h-16 object-cover rounded  border border-border" />
            <div class="flex-1">
              <h4 class="text-sm font-bold text-text-primary">{{ book.title }}</h4>
              <p class="text-xs text-text-secondary">{{ book.author }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold text-text-primary">{{ book.sold }} Sold</div>
              <div class="text-xs font-medium" :class="book.trend && book.trend.includes('-') ? 'text-rose-600' : 'text-[#059669]'">
                {{ formatCurrency(book.revenue) }} ({{ book.trend || '0%' }})
              </div>
            </div>
          </div>
          <div v-if="!data.best_sellers?.length" class="p-8 text-center text-sm text-text-secondary">
            No sales data available yet.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { CalendarIcon, DownloadIcon, DollarSign, TrendingDown, Briefcase, BookOpen, Archive } from 'lucide-vue-next'

const api = useApi()
const isLoading = ref(true)
const period = ref('30d')
const graphPeriod = ref('this_month')
const data = ref({})
const chartKey = ref(0)

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
}

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/v1/admin/dashboard?period=${period.value}`)
    if (res && res.ok) {
      data.value = res.data
      chartKey.value++
      graphPeriod.value = period.value === '24h' || period.value === '7d' || period.value === '30d' ? 'this_month' : period.value
      // We still need to call fetchGraphData() because data.value.sales_overview returned by the main API call 
      // will be based on the global period (e.g. 30d, 7d), not the calendar month!
      if (graphPeriod.value === 'this_month' && period.value !== 'this_month') {
        fetchGraphData()
      }
    }
  } catch (e) {
    console.error('Failed to fetch dashboard data', e)
  } finally {
    isLoading.value = false
  }
}

const fetchGraphData = async () => {
  try {
    const res = await api.get(`/api/v1/admin/dashboard?period=${graphPeriod.value}`)
    if (res && res.ok) {
      data.value.sales_overview = res.data.sales_overview
      chartKey.value++
    }
  } catch (e) {
    console.error('Failed to fetch graph data', e)
  }
}

onMounted(() => {
  fetchDashboardData()
})

// === ApexCharts Configurations ===

// 1. Sales Overview
const salesSeries = computed(() => {
  if (!data.value.sales_overview) return []
  return [
    { name: 'Revenue', data: data.value.sales_overview.map(d => d.revenue) },
    { name: 'Cost', data: data.value.sales_overview.map(d => d.cost) },
    { name: 'Profit', data: data.value.sales_overview.map(d => d.profit) }
  ]
})
const salesChartOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit', zoom: { enabled: false } },
  colors: ['#059669', '#E11D48', '#3B82F6'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.0, stops: [0, 90, 100] } },
  xaxis: {
    categories: data.value.sales_overview?.map(d => d.date) || [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#9CA3AF' } }
  },
  yaxis: { labels: { style: { colors: '#9CA3AF' }, formatter: (val) => `$${val}` } },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
  legend: { position: 'top', horizontalAlign: 'right' }
}))

// 2. Stock In
const stockInSeries = computed(() => [{ name: 'Quantity', data: data.value.stock_in?.map(d => d.quantity) || [] }])
const stockInOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '50%' } },
  colors: ['#059669'],
  dataLabels: { enabled: false },
  xaxis: { categories: data.value.stock_in?.map(d => d.title) || [], labels: { style: { colors: '#9CA3AF' } } },
  yaxis: { labels: { style: { colors: '#4B5563', fontSize: '11px' }, maxWidth: 120 } },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } }
}))

// 3. Stock Out
const stockOutSeries = computed(() => [{ name: 'Quantity', data: data.value.stock_out?.map(d => d.quantity) || [] }])
const stockOutOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '50%' } },
  colors: ['#E11D48'],
  dataLabels: { enabled: false },
  xaxis: { categories: data.value.stock_out?.map(d => d.title) || [], labels: { style: { colors: '#9CA3AF' } } },
  yaxis: { labels: { style: { colors: '#4B5563', fontSize: '11px' }, maxWidth: 120 } },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } }
}))

// 4. Delivery
const deliverySeries = computed(() => data.value.delivery_breakdown?.map(d => d.value) || [])
const deliveryOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: data.value.delivery_breakdown?.map(d => d.label) || [],
  colors: ['#059669', '#3B82F6', '#F59E0B'],
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: '75%' } } },
  stroke: { width: 0 },
  legend: { position: 'bottom', markers: { radius: 12 } }
}))

// 5. Payment
const paymentSeries = computed(() => data.value.payment_breakdown?.map(d => d.value) || [])
const paymentOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: data.value.payment_breakdown?.map(d => d.label) || [],
  colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'],
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: '75%' } } },
  stroke: { width: 0 },
  legend: { position: 'bottom', markers: { radius: 12 } }
}))

// 6. Waterfall
const waterfallSeries = computed(() => {
  if (!data.value.profit_breakdown) return []
  const { revenue, cost, net_profit } = data.value.profit_breakdown
  return [{
    name: 'Amount',
    data: [
      { x: 'Revenue', y: revenue, fillColor: '#059669' },
      { x: 'Cost', y: -cost, fillColor: '#E11D48' },
      { x: 'Net Profit', y: net_profit, fillColor: '#3B82F6' }
    ]
  }]
})
const waterfallOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { columnWidth: '40%', borderRadius: 4, colors: { ranges: [{ from: -1000000, to: -1, color: '#E11D48' }] } } },
  dataLabels: { enabled: false },
  yaxis: { labels: { formatter: (val) => `$${val}`, style: { colors: '#9CA3AF' } } },
  xaxis: { labels: { style: { colors: '#4B5563', fontWeight: 500 } } },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4 }
}))

</script>
