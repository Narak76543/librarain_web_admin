<template>
  <div class="space-y-4 pb-12 animate-fade-in max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <h1 class="text-2xl font-semibold text-text-primary mb-1">Orders</h1>
        <p class="text-text-secondary text-sm">{{ totalOrders }} total orders</p>
      </div>
      <button @click="exportCSV" class="flex items-center gap-2 px-4 py-2 bg-card hover:bg-gray-50 border border-border rounded-lg text-text-primary transition-colors text-sm font-medium">
        <Download class="w-4 h-4" />
        Export CSV
      </button>
    </div>

    <!-- Filters Section -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="relative w-full lg:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="w-4 h-4 text-text-secondary" />
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          @keyup.enter="fetchOrders" 
          placeholder="Search orders..." 
          class="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors text-sm" 
        />
      </div>
      
      <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div class="relative">
          <select v-model="statusFilter" @change="fetchOrders" class="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-text-primary cursor-pointer transition-colors w-[140px]">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown class="w-4 h-4 text-text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        
        <div class="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Calendar class="w-4 h-4 text-text-secondary" />
          <input type="date" v-model="fromDate" @change="fetchOrders" class="w-[110px] focus:outline-none text-text-primary bg-transparent text-sm" />
          <span class="text-border mx-1">|</span>
          <input type="date" v-model="toDate" @change="fetchOrders" class="w-[110px] focus:outline-none text-text-primary bg-transparent text-sm" />
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="relative min-h-[400px]">
      <div v-if="isLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
        <Loader2 class="w-6 h-6 animate-spin text-text-secondary" />
      </div>

      <div v-if="orders.length === 0 && !isLoading" class="py-16 text-center border border-border border-dashed rounded-xl bg-gray-50/50 dark:bg-gray-500/10">
        <p class="text-text-primary font-medium mb-1">No orders found</p>
        <p class="text-text-secondary text-sm mb-4">Adjust your filters to see more results.</p>
        <button @click="searchQuery=''; statusFilter=''; fromDate=''; toDate=''; fetchOrders()" class="text-sm text-gray-600 dark:text-text-secondary hover:text-text-primary underline">
          Clear filters
        </button>
      </div>

      <div class="space-y-3">
        <template v-for="row in orders" :key="row.id">
          <div class="bg-card border border-border rounded-lg overflow-hidden transition-colors"
               :class="{'border-gray-400': expandedRow === row.id}">
            
            <div 
              class="px-4 py-2.5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface/50 transition-colors"
              @click="toggleRow(row.id)"
            >
              <div class="flex items-center gap-4 min-w-0 flex-1">
                <div class="w-24 shrink-0">
                  <span class="text-sm font-medium text-text-primary">#{{ String(row.id).split('-')[0].substring(0, 6).toUpperCase() }}</span>
                </div>
                
                <div class="w-48 shrink-0 truncate">
                  <p class="text-sm font-medium text-text-primary truncate">{{ row.customer }}</p>
                  <p class="text-xs text-text-secondary truncate mt-0.5">{{ row.email }}</p>
                </div>

                <div class="w-32 shrink-0">
                  <p class="text-sm text-text-primary">{{ row.date }}</p>
                </div>

                <div class="w-20 shrink-0 text-right md:text-left">
                  <p class="text-sm text-text-primary">{{ row.books }} {{ row.books === 1 ? 'item' : 'items' }}</p>
                </div>

                <div class="w-24 shrink-0 text-sm">
                  ${{ row.total.toFixed(2) }}
                </div>
              </div>

              <div class="flex items-center gap-4 shrink-0 justify-between md:justify-end w-full md:w-auto">
                <div class="flex items-center gap-2">
                  <!-- Minimal Outline Badges -->
                  <span 
                    class="px-2 py-0.5 text-[11px] font-medium border rounded uppercase tracking-wide"
                    :class="{
                      'border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 bg-green-50/30 dark:bg-green-500/10': row.status.toLowerCase() === 'completed' || row.status.toLowerCase() === 'delivered',
                      'border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400 bg-yellow-50/30 dark:bg-yellow-500/10': row.status.toLowerCase() === 'processing',
                      'border-gray-200 dark:border-gray-500/20 text-gray-600 dark:text-text-secondary bg-gray-50/50 dark:bg-gray-500/10': row.status.toLowerCase() === 'pending',
                      'border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 bg-red-50/30 dark:bg-red-500/10': row.status.toLowerCase() === 'cancelled',
                    }"
                  >
                    {{ row.status }}
                  </span>
                  
                  <span class="px-2 py-0.5 text-[11px] font-medium border border-gray-200 dark:border-gray-500/20 text-gray-600 dark:text-text-secondary rounded bg-gray-50/50 dark:bg-gray-500/10 uppercase tracking-wide">
                    {{ row.deliveryWay === 'Delivery' ? 'DEL' : 'PU' }}
                  </span>
                </div>

                <ChevronDown class="w-4 h-4 text-text-secondary transition-transform duration-200" :class="{'rotate-180 text-text-primary': expandedRow === row.id}" />
              </div>
            </div>

            <!-- Expanded Details -->
            <div v-if="expandedRow === row.id" class="border-t border-border bg-surface p-4 md:p-4 text-[13px]">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                
                <!-- Left: Items -->
                <div class="lg:col-span-2">
                  <h4 class="font-medium text-text-primary border-b border-border pb-2 mb-4">Order Summary</h4>
                  <div class="space-y-2">
                    <div v-for="item in row.items" :key="item.id" class="flex justify-between items-start gap-4">
                      <div class="flex gap-4">
                        <div class="w-8 h-12 bg-gray-100 dark:bg-white/10 border border-border shrink-0 overflow-hidden rounded">
                          <img :src="item.cover" class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div>
                          <p class="font-medium text-text-primary line-clamp-1">{{ item.title }}</p>
                          <p class="text-xs text-text-secondary mt-0.5">{{ item.author }}</p>
                          <p class="text-xs text-text-secondary mt-1">Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}</p>
                        </div>
                      </div>
                      <div class="text-text-primary shrink-0">
                        ${{ (item.quantity * item.price).toFixed(2) }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 pt-4 border-t border-border w-full max-w-sm ml-auto space-y-2">
                    <div class="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span>${{ (row.total).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-text-secondary">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div class="flex justify-between font-medium text-text-primary pt-2 border-t border-border mt-2">
                      <span>Total</span>
                      <span>${{ row.total.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Details & Actions -->
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-text-primary border-b border-border pb-2 mb-3">Details</h4>
                    <dl class="space-y-2 text-sm">
                      <div class="grid grid-cols-3 gap-2">
                        <dt class="text-text-secondary">Method</dt>
                        <dd class="col-span-2 text-text-primary">{{ row.deliveryWay }} <span v-if="row.deliveryWay === 'Delivery' && row.deliveryPartner">({{ row.deliveryPartner }})</span></dd>
                      </div>
                      <div class="grid grid-cols-3 gap-2">
                        <dt class="text-text-secondary">Payment</dt>
                        <dd class="col-span-2 text-text-primary">{{ row.paymentMethod }}</dd>
                      </div>
                      <div class="grid grid-cols-3 gap-2">
                        <dt class="text-text-secondary">Placed</dt>
                        <dd class="col-span-2 text-text-primary">{{ row.date }}, {{ row.time }}</dd>
                      </div>
                      <div class="grid grid-cols-3 gap-2">
                        <dt class="text-text-secondary">Address</dt>
                        <dd class="col-span-2 text-text-primary line-clamp-2" :title="row.address">{{ row.address }}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 class="font-medium text-text-primary border-b border-border pb-2 mb-3">Actions</h4>
                    <div class="space-y-3">
                      <div class="flex items-center gap-2">
                        <div class="relative flex-1">
                          <select class="w-full appearance-none bg-card border border-border rounded pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-text-primary cursor-pointer" v-model="row.status" @change="handleUpdateStatus(row)">
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown class="w-3.5 h-3.5 text-text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <Loader2 v-if="isUpdating === row.id" class="w-4 h-4 animate-spin text-text-secondary shrink-0" />
                      </div>

                      <button 
                        v-if="row.status.toLowerCase() === 'delivered' || row.status.toLowerCase() === 'completed'"
                        @click="handleDownloadInvoice(row)" 
                        class="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-card hover:bg-gray-50 border border-border text-text-primary rounded text-sm transition-colors"
                      >
                        <FileText class="w-3.5 h-3.5" /> 
                        Invoice PDF
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div v-if="totalOrders > 0" class="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <p class="text-sm text-text-secondary">
          {{ offset + 1 }} - {{ Math.min(offset + limit, totalOrders) }} of {{ totalOrders }}
        </p>
        
        <div class="flex gap-1">
          <button @click="prevPage" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent text-sm transition-colors">
            &larr;
          </button>
          
          <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" 
                  class="w-8 h-8 flex items-center justify-center border rounded text-sm transition-colors"
                  :class="page === currentPage ? 'border-gray-800 bg-gray-800 text-white' : 'border-border hover:bg-gray-50'">
            {{ page }}
          </button>
          
          <button @click="nextPage" :disabled="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent text-sm transition-colors">
            &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, ChevronDown, Download, Calendar, FileText, Loader2 } from 'lucide-vue-next'
import { useOrders } from '~/composables/useOrders'
import { useInvoices } from '~/composables/useInvoices'

const { getOrders, updateOrder } = useOrders()
const { getAdminInvoices, downloadPdf } = useInvoices()

const orders = ref([])
const totalOrders = ref(0)
const isLoading = ref(true)
const isUpdating = ref(null)

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

const handleDownloadInvoice = async (row) => {
  try {
    const res = await getAdminInvoices({ order_id: row.id })
    if (res && res.ok && res.data && res.data.invoices && res.data.invoices.length > 0) {
      const inv = res.data.invoices[0]
      await downloadPdf(inv.id, inv.invoice_number, true)
    } else {
      alert('Invoice not found or not generated yet.')
    }
  } catch (err) {
    console.error('Failed to download invoice:', err)
    alert('An error occurred while downloading the invoice PDF.')
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
        date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (o.date || 'N/A'),
        time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '10:00 AM',
        books: (o.order_items || o.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0) || o.items_count || 0,
        total: parseFloat(o.total || o.total_amount || 0),
        status: o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1)) : 'Pending',
        deliveryWay: o.delivery_way || 'Pick Up',
        deliveryPartner: o.delivery_partner,
        paymentMethod: o.payment_method || 'Credit Card',
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
  isUpdating.value = row.id
  try {
    await updateOrder(row.id, { status: row.status })
  } catch (err) {
    console.error("Failed to update status:", err)
    alert(`Failed to update order ${row.id}.`)
  } finally {
    setTimeout(() => {
      isUpdating.value = null
    }, 500)
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
