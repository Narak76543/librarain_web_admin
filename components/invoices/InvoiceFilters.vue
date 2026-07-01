<template>
  <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      
      <!-- Invoice Number -->
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-text-secondary mb-1">Invoice Number</label>
        <input type="text" v-model="filters.invoice_number" 
          placeholder="e.g. INV-2026-00001"
          @input="emitFilters"
          class="h-10 border border-gray-200 dark:border-gray-500/20 rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"/>
      </div>

      <!-- Customer -->
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-text-secondary mb-1">Customer / Email</label>
        <input type="text" v-model="filters.customer" 
          placeholder="e.g. Sarat Narak"
          @input="emitFilters"
          class="h-10 border border-gray-200 dark:border-gray-500/20 rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"/>
      </div>

      <!-- Status -->
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-text-secondary mb-1">Status</label>
        <select v-model="filters.status" @change="emitFilters"
          class="h-10 border border-gray-200 dark:border-gray-500/20 rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="issued">Issued</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <!-- Date From -->
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-text-secondary mb-1">Date From</label>
        <input type="date" v-model="filters.date_from" @change="emitFilters"
          class="h-10 border border-gray-200 dark:border-gray-500/20 rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"/>
      </div>

      <!-- Date To -->
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-text-secondary mb-1">Date To</label>
        <input type="date" v-model="filters.date_to" @change="emitFilters"
          class="h-10 border border-gray-200 dark:border-gray-500/20 rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"/>
      </div>

    </div>

    <div class="flex justify-end gap-2">
      <button @click="clearFilters" 
        class="h-9 px-4 border border-gray-200 dark:border-gray-500/20 rounded-lg text-sm text-text-secondary hover:bg-gray-50 transition active:scale-95">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter'])

const filters = ref({
  invoice_number: '',
  customer: '',
  status: '',
  date_from: '',
  date_to: ''
})

const emitFilters = () => {
  emit('filter', { ...filters.value })
}

const clearFilters = () => {
  filters.value = {
    invoice_number: '',
    customer: '',
    status: '',
    date_from: '',
    date_to: ''
  }
  emitFilters()
}
</script>
