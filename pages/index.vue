<template>
  <div class="space-y-6">
    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Total Books" :value="stats.totalBooks" type="books" />
      <StatsCard title="Total Orders" :value="stats.totalOrders" type="orders" />
      <StatsCard title="Total Users" :value="stats.totalUsers" type="users" />
      <StatsCard title="Total Revenue" :value="`$${stats.totalRevenue.toLocaleString()}`" type="revenue" />
    </div>
    
    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Orders Line Chart -->
      <div class="card flex flex-col">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Orders Overview</h3>
        <div class="flex-1 relative min-h-[250px] w-full">
          <svg viewBox="0 0 700 250" class="w-full h-full" preserveAspectRatio="none">
            <!-- Grid lines -->
            <line v-for="i in 5" :key="`h-${i}`" x1="0" :y1="(i-1)*50 + 10" x2="700" :y2="(i-1)*50 + 10" stroke="#E5E7EB" stroke-width="1" />
            
            <!-- Line -->
            <polyline 
              fill="none" 
              stroke="#059669" 
              stroke-width="3" 
              :points="linePoints" 
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            
            <!-- Points -->
            <circle 
              v-for="(point, idx) in points" 
              :key="`p-${idx}`"
              :cx="point.x" 
              :cy="point.y" 
              r="4" 
              fill="#059669" 
              stroke="#FFFFFF" 
              stroke-width="2" 
            />
            
            <!-- X-Axis Labels -->
            <text 
              v-for="(label, idx) in chartData.labels" 
              :key="`l-${idx}`"
              :x="idx * 110 + 20" 
              y="240" 
              fill="#6B7280" 
              font-size="12"
              font-family="sans-serif"
            >
              {{ label }}
            </text>
          </svg>
        </div>
      </div>
      
      <!-- Categories Donut Chart -->
      <div class="card flex flex-col">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Books by Category</h3>
        <div class="flex-1 flex items-center justify-center gap-8">
          <svg viewBox="0 0 200 200" class="w-48 h-48">
            <g transform="translate(100, 100)">
              <path 
                v-for="(slice, idx) in donutSlices" 
                :key="`slice-${idx}`"
                :d="slice.path"
                :fill="slice.color"
              />
              <!-- Inner hole for donut -->
              <circle cx="0" cy="0" r="60" fill="#FFFFFF" />
              <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="600" fill="#1C1C1E">
                {{ stats.totalBooks }}
              </text>
              <text x="0" y="20" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#6B7280">
                Books
              </text>
            </g>
          </svg>
          
          <div class="space-y-2">
            <div v-for="(slice, idx) in donutSlices" :key="`leg-${idx}`" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: slice.color }"></div>
              <span class="text-sm text-text-secondary">{{ slice.label }}</span>
              <span class="text-sm font-semibold text-text-primary ml-auto">{{ slice.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Orders -->
    <div class="card !p-0 overflow-hidden">
      <div class="p-6 border-b border-border flex justify-between items-center">
        <h3 class="text-lg font-semibold text-text-primary">Recent Orders</h3>
        <NuxtLink to="/orders" class="text-sm text-primary hover:underline">View All</NuxtLink>
      </div>
      <DataTable 
        :columns="orderColumns" 
        :rows="recentOrders" 
      >
        <template #status="{ row }">
          <StatusBadge :status="row.status" />
        </template>
        <template #total="{ row }">
          ${{ row.total.toFixed(2) }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { stats, chartData, orders, categories } = useMockData()

const recentOrders = computed(() => orders.slice(0, 5))

const orderColumns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' }
]

// Line chart points calculation
const maxOrder = Math.max(...chartData.orders)
const points = computed(() => {
  return chartData.orders.map((val, idx) => {
    return {
      x: idx * 110 + 20,
      y: 200 - (val / maxOrder) * 180 + 10
    }
  })
})

const linePoints = computed(() => {
  return points.value.map(p => `${p.x},${p.y}`).join(' ')
})

// Donut chart calculation
const categoryColors = ['#059669', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280']
const donutSlices = computed(() => {
  let total = categories.reduce((sum, cat) => sum + cat.books, 0)
  let currentAngle = 0
  
  return categories.map((cat, idx) => {
    const angle = (cat.books / total) * Math.PI * 2
    const startX = Math.sin(currentAngle) * 100
    const startY = -Math.cos(currentAngle) * 100
    currentAngle += angle
    const endX = Math.sin(currentAngle) * 100
    const endY = -Math.cos(currentAngle) * 100
    
    const largeArcFlag = angle > Math.PI ? 1 : 0
    
    return {
      label: cat.name,
      value: cat.books,
      color: categoryColors[idx % categoryColors.length],
      path: `M 0 0 L ${startX} ${startY} A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
    }
  })
})
</script>
