<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary">Purchase Orders</h1>
      <NuxtLink to="/purchase-orders/create" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <Plus class="w-4 h-4" />
        Create PO
      </NuxtLink>
    </div>

    <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-text-secondary">
        <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
        Loading purchase orders...
      </div>
      
      <table v-else-if="purchaseOrders.length > 0" class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface border-b border-border text-text-secondary text-sm">
            <th class="px-4 py-2.5 font-semibold">PO Number</th>
            <th class="px-4 py-2.5 font-semibold">Supplier</th>
            <th class="px-4 py-2.5 font-semibold">Ordered At</th>
            <th class="px-4 py-2.5 font-semibold">Total Cost</th>
            <th class="px-4 py-2.5 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="po in purchaseOrders" :key="po.id" class="hover:bg-surface/50 transition-colors cursor-pointer text-sm" @click="navigateTo(`/purchase-orders/${po.id}`)">
            <td class="px-4 py-2">
              <span class="font-medium text-text-primary">{{ po.po_number }}</span>
            </td>
            <td class="px-4 py-2 text-text-secondary">{{ po.supplier_name }}</td>
            <td class="px-4 py-2 text-text-secondary">{{ formatDate(po.ordered_at) }}</td>
            <td class="px-4 py-2 font-medium text-text-primary">${{ po.total_cost.toFixed(2) }}</td>
            <td class="px-4 py-2 text-right">
              <span :class="getStatusClass(po.status)" class="px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide">
                {{ po.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="p-12 text-center text-text-secondary">
        <ShoppingCart class="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p class="text-lg font-medium text-text-primary mb-1">No purchase orders found</p>
        <p>Create a new purchase order to stock up on books.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, ShoppingCart, Loader2 } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { navigateTo } from 'nuxt/app'

const { get } = useApi()
const purchaseOrders = ref([])
const pending = ref(true)

const fetchPurchaseOrders = async () => {
  pending.value = true
  try {
    const res = await get('/api/v1/purchase-orders')
    if (res?.data?.purchase_orders) {
      purchaseOrders.value = res.data.purchase_orders
    }
  } catch (error) {
    console.error("Error fetching purchase orders:", error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchPurchaseOrders()
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    case 'received': return 'border border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
    case 'cancelled': return 'border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
    default: return 'border border-gray-200 dark:border-gray-500/20 bg-gray-50/50 dark:bg-gray-500/10 text-gray-600 dark:text-text-secondary'
  }
}
</script>
