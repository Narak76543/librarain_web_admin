<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary">Inventory Management</h1>
    </div>

    <!-- KPIs -->
    <div v-if="!loadingDashboard" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <KpiCard
        label="Total Items"
        :value="dashboard.total_items"
        sub="books in stock"
        :icon="Package"
        icon-bg="bg-blue-50 dark:bg-blue-500/10"
        icon-color="text-blue-600 dark:text-blue-400"
      />
      <KpiCard
        label="Total Value"
        :value="`$${dashboard.total_value.toFixed(2)}`"
        sub="inventory cost"
        :icon="DollarSign"
        icon-bg="bg-green-50 dark:bg-green-500/10"
        icon-color="text-green-600 dark:text-green-400"
      />
      <KpiCard
        label="Low Stock Alerts"
        :value="dashboard.low_stock_count"
        sub="items need restock"
        :icon="AlertTriangle"
        icon-bg="bg-amber-50 dark:bg-amber-500/10"
        icon-color="text-amber-600 dark:text-amber-400"
        value-color="text-amber-600 dark:text-amber-400"
      />
      <KpiCard
        label="Out of Stock"
        :value="dashboard.out_of_stock_count"
        sub="items depleted"
        :icon="XCircle"
        icon-bg="bg-red-50 dark:bg-red-500/10"
        icon-color="text-red-600 dark:text-red-400"
        value-color="text-red-600 dark:text-red-400"
      />
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-border overflow-x-auto">
      <button 
        @click="activeTab = 'books'" 
        class="px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === 'books' ? 'border-gray-800 text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'"
      >
        Catalog
      </button>
      <button 
        @click="activeTab = 'drafts'" 
        class="px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === 'drafts' ? 'border-gray-800 text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'"
      >
        Drafts & Pricing
      </button>
      <button 
        @click="activeTab = 'adjustments'" 
        class="px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === 'adjustments' ? 'border-gray-800 text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'"
      >
        Adjustments
      </button>
      <button 
        @click="activeTab = 'low-stock'" 
        class="px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === 'low-stock' ? 'border-gray-800 text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'"
      >
        Low Stock
      </button>
      <button 
        @click="activeTab = 'categories'" 
        class="px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === 'categories' ? 'border-gray-800 text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'"
      >
        Categories
      </button>
      <button 
        @click="activeTab = 'stock-movements'" 
        class="px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
        :class="activeTab === 'stock-movements' ? 'border-gray-800 text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'"
      >
        Stock Movements
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <InventoryBooksTab v-if="activeTab === 'books'" @stock-adjusted="fetchDashboard" />
      <InventoryDraftsTab v-else-if="activeTab === 'drafts'" @published="fetchDashboard" />
      <InventoryAdjustmentsTab v-else-if="activeTab === 'adjustments'" />
      <InventoryLowStockTab v-else-if="activeTab === 'low-stock'" />
      <InventoryCategoriesTab v-else-if="activeTab === 'categories'" />
      <InventoryStockMovementsTab v-else-if="activeTab === 'stock-movements'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Package, DollarSign, AlertTriangle, XCircle } from 'lucide-vue-next'
import KpiCard from '~/components/reports/KpiCard.vue'
import { useInventory } from '~/composables/useInventory'
import InventoryBooksTab from '~/components/inventory/BooksTab.vue'
import InventoryDraftsTab from '~/components/inventory/DraftsTab.vue'
import InventoryCategoriesTab from '~/components/inventory/CategoriesTab.vue'
import InventoryStockMovementsTab from '~/components/inventory/StockMovementsTab.vue'
import InventoryAdjustmentsTab from '~/components/inventory/AdjustmentsTab.vue'
import InventoryLowStockTab from '~/components/inventory/LowStockTab.vue'

const activeTab = ref('books')
const dashboard = ref({ total_items: 0, total_value: 0, low_stock_count: 0, out_of_stock_count: 0 })
const loadingDashboard = ref(true)

const { getDashboard } = useInventory()

const fetchDashboard = async () => {
  try {
    const res = await getDashboard()
    if (res?.data) {
      dashboard.value = res.data
    }
  } catch (error) {
    console.error("Failed to fetch dashboard KPIs", error)
  } finally {
    loadingDashboard.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>
