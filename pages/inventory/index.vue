<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary">Inventory Management</h1>
    </div>

    <!-- Tabs -->
    <div class="inline-flex gap-1 p-1 bg-surface/50 rounded-xl">
      <button 
        @click="activeTab = 'books'" 
        class="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
        :class="activeTab === 'books' ? 'bg-card text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-surface'"
      >
        Books
      </button>
      <button 
        @click="activeTab = 'categories'" 
        class="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
        :class="activeTab === 'categories' ? 'bg-card text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-surface'"
      >
        Categories
      </button>
      <button 
        @click="activeTab = 'stock-in'" 
        class="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
        :class="activeTab === 'stock-in' ? 'bg-card text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-surface'"
      >
        Stock In
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <InventoryBooksTab v-if="activeTab === 'books'" />
      <InventoryCategoriesTab v-else-if="activeTab === 'categories'" />
      <InventoryStockInTab v-else-if="activeTab === 'stock-in'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('books')
</script>
