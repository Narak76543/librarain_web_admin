<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary">Reports</h1>
    </div>

    <!-- Tabs -->
    <div class="inline-flex gap-1 p-1 bg-surface/50 rounded-xl">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="currentTab = tab.id"
        class="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
        :class="currentTab === tab.id 
          ? 'bg-card text-primary shadow-sm' 
          : 'text-text-secondary hover:text-text-primary hover:bg-surface'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <OverviewTab v-if="currentTab === 'overview'" />
      <DailyReportTab v-if="currentTab === 'daily_report'" />
      <SalesHistoryTab v-if="currentTab === 'sales_history'" />
      <StockInHistoryTab v-if="currentTab === 'stock_in_history'" />
      <SalesByBookTab v-if="currentTab === 'sales_by_book'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OverviewTab from '~/components/reports/OverviewTab.vue'
import DailyReportTab from '~/components/reports/DailyReportTab.vue'
import SalesHistoryTab from '~/components/reports/SalesHistoryTab.vue'
import StockInHistoryTab from '~/components/reports/StockInHistoryTab.vue'
import SalesByBookTab from '~/components/reports/SalesByBookTab.vue'

const tabs = [
  { id: 'overview', label: 'Stock Overview' },
  { id: 'daily_report', label: 'Daily Report' },
  { id: 'sales_history', label: 'Sales History' },
  { id: 'stock_in_history', label: 'Stock-In History' },
  { id: 'sales_by_book', label: 'Sales by Book' }
]

const currentTab = ref('overview')
</script>
