<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-end gap-3">
          <h1 class="text-2xl font-bold text-text-primary">Orders</h1>
          <span class="text-text-secondary text-sm pb-0.5">{{ totalOrders }} orders total</span>
        </div>
      </div>
      <button @click="exportCSV" class="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-text-primary hover:bg-surface transition-colors font-medium text-sm shadow-sm">
        <Download class="w-4 h-4" />
        Export CSV
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div class="relative w-full xl:w-96">
        <Search class="w-4 h-4 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
        <input type="text" v-model="searchQuery" @keyup.enter="fetchOrders" placeholder="Search orders by ID or customer name..." class="pl-10 pr-4 py-2.5 w-full bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm" />
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <select v-model="statusFilter" @change="fetchOrders" class="appearance-none bg-card border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary cursor-pointer w-36 shadow-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown class="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        
        <div class="flex items-center gap-4 bg-card border border-border rounded-lg px-4 py-2.5 text-sm shadow-sm">
          <span class="text-text-secondary">From</span>
          <div class="relative flex items-center gap-2 cursor-pointer group">
            <input type="date" v-model="fromDate" @change="fetchOrders" class="w-28 focus:outline-none text-text-primary bg-transparent cursor-pointer group-hover:text-primary transition-colors text-sm" />
          </div>
          <span class="text-text-secondary">to</span>
          <div class="relative flex items-center gap-2 cursor-pointer group">
            <input type="date" v-model="toDate" @change="fetchOrders" class="w-28 focus:outline-none text-text-primary bg-transparent cursor-pointer group-hover:text-primary transition-colors text-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-card rounded-xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.04)] relative animate-fade-in">
      <div v-if="isLoading" class="absolute inset-0 bg-card/50 backdrop-blur-sm z-10 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <div class="w-full overflow-x-auto min-h-[300px]">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-card text-gray-400 text-[11px] font-medium uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 tracking-wider">Order ID</th>
              <th class="px-6 py-4 tracking-wider">Customer</th>
              <th class="px-6 py-4 tracking-wider">Date</th>
              <th class="px-6 py-4 text-center tracking-wider">Items</th>
              <th class="px-6 py-4 tracking-wider">Total</th>
              <th class="px-6 py-4 tracking-wider">Status</th>
              <th class="px-6 py-4 text-right tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="orders.length === 0 && !isLoading">
              <td colspan="7" class="px-6 py-8 text-center text-text-secondary">No orders found.</td>
            </tr>
            <template v-for="(row, idx) in orders" :key="row.id">
              <!-- Main Row -->
              <tr 
                class="hover:bg-gray-50/80 transition-all duration-300 cursor-pointer group"
                :class="{'bg-primary/5': expandedRow === row.id}"
                @click="toggleRow(row.id)"
              >
                <td class="px-6 py-4 font-bold text-primary">#{{ String(row.id).split('-')[0].toUpperCase() }}</td>
                <td class="px-6 py-4">
                  <p class="font-bold text-text-primary">{{ row.customer }}</p>
                  <p class="text-xs text-text-secondary mt-0.5">{{ row.email }}</p>
                </td>
                <td class="px-6 py-4 text-text-secondary">{{ row.date }}</td>
                <td class="px-6 py-4 text-center font-medium">{{ row.books }}</td>
                <td class="px-6 py-4 font-bold text-text-primary">${{ row.total.toFixed(2) }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col items-start gap-1">
                    <StatusBadge :status="row.status" />
                    <span 
                      v-if="row.deliveryWay === 'Delivery'" 
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-100 shadow-sm"
                    >
                      {{ row.deliveryPartner || 'Standard' }}
                    </span>
                    <span 
                      v-else 
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[11px] font-semibold border border-purple-100 shadow-sm"
                    >
                      Pick Up
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-border text-text-secondary transition-all" :class="{'rotate-180 bg-card shadow-sm border border-border text-primary': expandedRow === row.id}">
                    <ChevronDown class="w-4 h-4 transition-transform" />
                  </button>
                </td>
              </tr>
              
              <!-- Expanded Panel -->
              <tr v-if="expandedRow === row.id" class="bg-surface/20 border-b-2 border-border/50">
                <td colspan="7" class="p-8">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 whitespace-normal">
                    <!-- Order Items (Left side) -->
                    <div class="lg:col-span-2">
                      <h4 class="text-lg font-bold text-text-primary mb-5">Order Items</h4>
                      <div class="space-y-4">
                        <div v-if="!row.items || row.items.length === 0" class="text-text-secondary text-sm">No items found for this order.</div>
                        <div v-for="item in row.items" :key="item.id" class="flex items-center gap-5 border border-border rounded-xl p-4 bg-card shadow-sm hover:border-primary/30 transition-colors">
                          <img :src="item.cover" class="w-16 h-24 object-cover rounded-md shadow-sm border border-border/50 bg-surface" />
                          <div class="flex-1">
                            <p class="font-bold text-text-primary text-base mb-1">{{ item.title }}</p>
                            <p class="text-sm text-text-secondary">by {{ item.author }}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-sm text-text-primary mb-1">{{ item.quantity }} x ${{ item.price.toFixed(2) }}</p>
                            <p class="font-bold text-primary text-base">${{ (item.quantity * item.price).toFixed(2) }}</p>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Order Summary (Subtotal, etc.) under items -->
                      <div class="mt-8 pt-6 border-t border-border flex justify-end">
                        <div class="w-64 space-y-3">
                          <div class="flex justify-between text-sm">
                            <span class="text-text-secondary">Subtotal:</span>
                            <span class="font-medium text-text-primary">${{ (row.total).toFixed(2) }}</span>
                          </div>
                          <div class="flex justify-between text-sm">
                            <span class="text-text-secondary">Shipping:</span>
                            <span class="font-medium text-text-primary">$0.00</span>
                          </div>
                          <div class="flex justify-between text-base pt-3 border-t border-border">
                            <span class="font-bold text-text-primary">Total:</span>
                            <span class="font-bold text-text-primary">${{ row.total.toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Order Info Box (Right side) -->
                    <div>
                      <div class="bg-[#F9FAFB] border border-border rounded-xl p-6 h-full shadow-sm">
                        <h4 class="text-lg font-bold text-text-primary mb-6">Order Info</h4>
                        
                        <div class="space-y-6">
                          <div>
                            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Customer Details</p>
                            <p class="font-bold text-text-primary text-sm">{{ row.customer }}</p>
                            <p class="text-sm text-text-secondary mt-1">{{ row.address }}</p>
                          </div>
                          
                          <div>
                            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Placed On</p>
                            <p class="text-sm text-text-primary">{{ row.date }} at {{ row.time }}</p>
                          </div>

                          <div>
                            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Delivery Details</p>
                            <div class="flex flex-col gap-1 text-sm bg-card border border-border rounded-lg p-3 shadow-sm">
                              <div class="flex justify-between">
                                <span class="text-text-secondary text-xs">Way:</span>
                                <span class="font-bold text-text-primary text-xs">{{ row.deliveryWay }}</span>
                              </div>
                              <div v-if="row.deliveryWay === 'Delivery'" class="flex justify-between border-t border-border/50 pt-1.5 mt-1.5">
                                <span class="text-text-secondary text-xs">Partner:</span>
                                <span class="font-bold text-primary text-xs">Via {{ row.deliveryPartner }}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Payment Method</p>
                            <div class="flex justify-between items-center bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-sm">
                              <span class="text-text-secondary">Method:</span>
                              <span class="font-bold text-text-primary font-mono uppercase">{{ row.paymentMethod }}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Change Status</p>
                            <div class="relative mb-4">
                              <select class="w-full appearance-none bg-card border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary cursor-pointer shadow-sm" v-model="row.status">
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <ChevronDown class="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <button @click="handleUpdateStatus(row)" :disabled="isUpdating" class="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors text-sm shadow-sm active:scale-[0.98] disabled:opacity-50">
                              {{ isUpdating ? 'Updating...' : 'Update Status' }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-5 border-t border-border bg-[#F9FAFB] flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-text-secondary">Showing <span class="font-medium text-text-primary">{{ orders.length > 0 ? offset + 1 : 0 }} to {{ Math.min(offset + limit, totalOrders) }}</span> of <span class="font-medium text-text-primary">{{ totalOrders }}</span> results</p>
        <div class="flex items-center gap-1.5" v-if="totalPages > 1">
          <button @click="prevPage" :disabled="currentPage === 1" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface transition-colors bg-card shadow-sm disabled:opacity-50">
            <ChevronDown class="w-4 h-4 rotate-90" />
          </button>
          
          <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" 
                  class="w-9 h-9 rounded-lg text-sm shadow-sm transition-colors font-medium"
                  :class="page === currentPage ? 'bg-primary text-white font-bold' : 'text-text-secondary hover:bg-surface hover:text-text-primary bg-transparent'">
            {{ page }}
          </button>
          
          <button @click="nextPage" :disabled="currentPage === totalPages" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface transition-colors bg-card shadow-sm disabled:opacity-50">
            <ChevronDown class="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, ChevronDown, Download, Calendar } from 'lucide-vue-next'

const { getOrders, updateOrder } = useOrders()

const orders = ref([])
const totalOrders = ref(0)
const isLoading = ref(true)
const isUpdating = ref(false)

// Pagination state
const limit = ref(10)
const offset = ref(0)
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)
const totalPages = computed(() => Math.ceil(totalOrders.value / limit.value) || 1)

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')
const fromDate = ref('')
const toDate = ref('')

const expandedRow = ref(null)

const toggleRow = (id) => {
  if (expandedRow.value === id) {
    expandedRow.value = null
  } else {
    expandedRow.value = id
  }
}

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const res = await getOrders({
      search: searchQuery.value,
      status: statusFilter.value,
      fromDate: fromDate.value,
      toDate: toDate.value,
      limit: limit.value,
      offset: offset.value,
    })
    
    // Exact mapping for the provided backend structure
    let rawOrders = []
    if (res?.data?.orders) {
      rawOrders = res.data.orders
    } else if (Array.isArray(res)) {
      rawOrders = res
    } else {
      rawOrders = res?.data || res?.items || res?.orders || []
    }

    totalOrders.value = res?.data?.total || res?.total || rawOrders.length || 0

    orders.value = rawOrders.map(o => {
      const id = o.id || o._id || o.order_id || `ORD-${Math.floor(Math.random()*1000)}`
      return {
        id,
        customer: o.customer?.full_name || o.user?.name || o.customer_name || 'Unknown Customer',
        email: o.customer?.email || o.user?.email || o.email || '',
        address: o.delivery_address || o.shipping_address || o.address || (o.delivery_way === 'Pick Up' ? 'Store Pick Up (Main Shop)' : 'No address specified'),
        date: o.created_at ? new Date(o.created_at).toLocaleDateString() : (o.date || 'N/A'),
        time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '10:00 AM',
        books: o.items_count || o.items?.length || o.books || 0,
        total: parseFloat(o.total || o.total_amount || 0),
        status: o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1)) : 'Pending',
        deliveryWay: o.delivery_way || 'Pick Up',
        deliveryPartner: o.delivery_partner,
        paymentMethod: o.payment_method || 'COD',
        items: (o.order_items || o.items || []).map(item => ({
          id: item.id || item.book_id || item.book?.id || Math.random(),
          title: item.book_title || item.book?.title || item.title || 'Unknown Book',
          author: item.book?.author || item.author || 'Unknown Author',
          cover: item.book_cover || item.book?.cover_url || item.book?.cover || item.cover || 'https://via.placeholder.com/48x64',
          price: parseFloat(item.price || item.unit_price || 0),
          quantity: item.quantity || 1
        }))
      }
    })
    
    // In case there is no data and it's local dev, inject some fake items just to not break the UI if items are missing
    orders.value.forEach(o => {
       if(o.items.length === 0 && o.books > 0) {
           o.items = Array(o.books).fill().map((_, i) => ({
             id: Math.random(),
             title: 'Mocked Book from API Placeholder',
             author: 'API Author',
             cover: 'https://via.placeholder.com/48x64',
             price: o.total / o.books,
             quantity: 1
           }))
       }
    })

  } catch (err) {
    console.error("Failed to fetch orders:", err)
  } finally {
    isLoading.value = false
  }
}

const exportCSV = async () => {
  try {
    const res = await getOrders({
      search: searchQuery.value,
      status: statusFilter.value,
      fromDate: fromDate.value,
      toDate: toDate.value,
      limit: 10000,
      offset: 0,
    })
    
    let rawOrders = res?.data?.orders || []
    
    const headers = ['Order ID', 'Customer Name', 'Email', 'Date', 'Items Count', 'Total', 'Status']
    const rows = rawOrders.map(o => {
      const customerName = o.customer?.full_name || o.user?.name || o.customer_name || 'Unknown'
      const email = o.customer?.email || o.user?.email || o.email || ''
      const date = o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'
      const itemsCount = o.items_count || o.items?.length || o.books || 0
      const total = o.total || o.total_amount || 0
      const status = o.status || 'Pending'
      
      return [
        o.id,
        customerName.replace(/"/g, '""'),
        email.replace(/"/g, '""'),
        date,
        itemsCount,
        total,
        status
      ]
    })
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(field => `"${field}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Export failed", error)
    alert("Failed to export CSV")
  }
}

const handleUpdateStatus = async (row) => {
  isUpdating.value = true
  try {
    await updateOrder(row.id, { status: row.status })
    alert(`Order ${row.id} updated successfully!`)
  } catch (err) {
    console.error("Failed to update status:", err)
    alert(`Failed to update order ${row.id}.`)
  } finally {
    isUpdating.value = false
  }
}

// Simple pagination logic
const displayedPages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - 1 && i <= currentPage.value + 1)) {
      pages.push(i)
    }
  }
  return [...new Set(pages)].sort((a,b) => a-b)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    offset.value -= limit.value
    fetchOrders()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    offset.value += limit.value
    fetchOrders()
  }
}

const goToPage = (page) => {
  offset.value = (page - 1) * limit.value
  fetchOrders()
}

onMounted(() => {
  fetchOrders()
})
</script>
