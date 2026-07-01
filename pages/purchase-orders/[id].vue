<template>
  <div class="space-y-4 max-w-4xl mx-auto">
    <div class="flex items-center gap-4">
      <button @click="navigateTo('/purchase-orders')" class="p-2 hover:bg-surface rounded-lg transition-colors text-text-secondary">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-2xl font-bold text-text-primary">
        Purchase Order: <span v-if="po" class="text-primary">{{ po.po_number }}</span>
      </h1>
      
      <div v-if="po" class="ml-auto flex items-center gap-3">
        <ExportButtons @export="handleExport" :loading="isExporting" />
        <span :class="getStatusClass(po.status)" class="px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
          {{ po.status }}
        </span>
        <button 
          v-if="po.status === 'pending'" 
          @click="markReceived" 
          :disabled="updating"
          class="bg-success hover:bg-success/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <CheckCircle class="w-4 h-4" />
          {{ updating ? 'Processing...' : 'Mark as Received' }}
        </button>
      </div>
    </div>

    <div v-if="pending" class="p-12 text-center text-text-secondary bg-card rounded-xl border border-border">
      <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
      Loading PO details...
    </div>

    <div v-else-if="po" class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      
      <!-- PO Meta Info -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2.5 bg-surface/50 border-b border-border">
        <div>
          <p class="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Supplier</p>
          <p class="font-semibold text-text-primary">{{ po.supplier_name }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Ordered Date</p>
          <p class="font-medium text-text-primary">{{ formatDate(po.ordered_at) }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Received Date</p>
          <p class="font-medium text-text-primary">{{ po.received_at ? formatDate(po.received_at) : 'Not yet received' }}</p>
        </div>
        <div>
          <p class="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Total Cost</p>
          <p class="font-bold text-primary text-lg">${{ po.total_cost.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Line Items -->
      <div class="px-4 py-2.5">
        <h3 class="text-base font-semibold text-text-primary mb-3">Line Items</h3>
        
        <table class="w-full text-left border-collapse border border-border rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-surface border-b border-border text-text-secondary text-sm">
              <th class="px-4 py-2 font-semibold">Book Title</th>
              <th class="px-4 py-2 font-semibold text-right">Quantity</th>
              <th class="px-4 py-2 font-semibold text-right">Cost Price</th>
              <th class="px-4 py-2 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="item in po.items" :key="item.id" class="hover:bg-surface/30 text-sm">
              <td class="px-4 py-2 font-medium text-text-primary">{{ item.book_title }}</td>
              <td class="px-4 py-2 text-right font-medium text-text-secondary">{{ item.quantity }}</td>
              <td class="px-4 py-2 text-right font-medium text-text-secondary">${{ item.cost_price.toFixed(2) }}</td>
              <td class="px-4 py-2 text-right font-bold text-text-primary">
                ${{ item.total_cost.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      <div v-if="po.note" class="px-4 py-2.5 border-t border-border bg-surface/30">
        <h4 class="text-sm font-semibold text-text-primary mb-2">Notes</h4>
        <p class="text-text-secondary text-sm whitespace-pre-wrap">{{ po.note }}</p>
      </div>

    </div>

    <!-- Alert explaining stock updates -->
    <div v-if="po && po.status === 'pending'" class="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
      <Info class="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div>
        <h4 class="font-semibold text-primary">Ready to receive stock?</h4>
        <p class="text-sm text-text-secondary mt-1">
          Clicking <strong>Mark as Received</strong> will automatically add these quantities to your inventory and update the cost price for each book to match this PO. This action cannot be undone.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, CheckCircle, Info, Loader2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { navigateTo } from 'nuxt/app'
import ExportButtons from '~/components/reports/ExportButtons.vue'
import { useClientExport } from '~/composables/useClientExport'

const { get, put } = useApi()

const route = useRoute()
const poId = route.params.id

const po = ref(null)
const pending = ref(true)
const updating = ref(false)

const { exportData } = useClientExport()
const isExporting = ref(false)

const handleExport = (format) => {
  if (!po.value) return
  isExporting.value = true
  try {
    const filename = `PO_${po.value.po_number}`
    const columns = [
      { key: 'book_title', label: 'Book Title' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'cost_price', label: 'Cost Price' },
      { key: 'total_cost', label: 'Total' }
    ]
    exportData(format, filename, columns, po.value.items, `Purchase Order: ${po.value.po_number} - ${po.value.supplier_name}`)
  } catch (error) {
    console.error("Export failed:", error)
  } finally {
    isExporting.value = false
  }
}

const fetchPO = async () => {
  pending.value = true
  try {
    const res = await get(`/api/v1/purchase-orders/${poId}`)
    if (res?.data) {
      po.value = res.data
    }
  } catch (error) {
    console.error("Error fetching PO:", error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  if (poId) {
    fetchPO()
  }
})

const markReceived = async () => {
  if (!confirm("Are you sure you want to mark this PO as received? This will instantly update your stock counts and book cost prices.")) return;

  updating.value = true
  try {
    const res = await put(`/api/v1/purchase-orders/${poId}/status`, { status: 'received' })
    
    if (res?.ok) {
      // Refresh the PO to show updated status and received_at
      await fetchPO()
    }
  } catch (error) {
    console.error("Error updating PO status:", error)
  } finally {
    updating.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-warning text-white'
    case 'received': return 'bg-success text-white'
    case 'cancelled': return 'bg-error text-white'
    default: return 'bg-surface text-text-secondary'
  }
}
</script>
