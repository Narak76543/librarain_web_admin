<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-text-primary mb-2">Reports</h1>
    <p class="text-text-secondary text-sm mb-8">
      Select a report type to view sales and stock data
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      <!-- Purchase Orders -->
      <NuxtLink to="/reports/purchase-orders"
        class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4
               hover:border-primary transition-colors group">
        <div class="w-12 h-12 border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/10 rounded flex items-center
                    justify-center mb-4 group-hover:bg-amber-500
                    group-hover:text-white transition-colors duration-300">
          <FileText :size="22" class="text-amber-600 group-hover:text-white transition duration-300"/>
        </div>
        <h2 class="font-bold text-text-primary mb-1">Purchase Orders Report</h2>
        <p class="text-sm text-text-secondary">
          Supplier expenses, pending POs, and cost breakdowns
        </p>
        <div class="mt-4 flex items-center text-amber-600 text-sm font-semibold">
          View Report <ChevronRight :size="16" class="ml-1"/>
        </div>
      </NuxtLink>

      <!-- Daily -->
      <NuxtLink to="/reports/daily"
        class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4
               hover:border-primary transition-colors group">
        <div class="w-12 h-12 border border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/10 rounded flex items-center
                    justify-center mb-4 group-hover:bg-primary
                    group-hover:text-white transition duration-300">
          <Calendar :size="22" class="text-primary group-hover:text-white transition duration-300"/>
        </div>
        <h2 class="font-bold text-text-primary mb-1">Daily Report</h2>
        <p class="text-sm text-text-secondary">
          Today's orders, revenue, profit and stock movement
        </p>
        <div class="mt-4 flex items-center text-primary text-sm font-semibold">
          View Report <ChevronRight :size="16" class="ml-1"/>
        </div>
      </NuxtLink>

      <!-- Weekly -->
      <NuxtLink to="/reports/weekly"
        class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4
               hover:border-primary transition-colors group">
        <div class="w-12 h-12 border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 rounded flex items-center
                    justify-center mb-4 group-hover:bg-emerald-600
                    group-hover:text-white transition duration-300">
          <CalendarDays :size="22" class="text-emerald-600 group-hover:text-white transition duration-300"/>
        </div>
        <h2 class="font-bold text-text-primary mb-1">Weekly Report</h2>
        <p class="text-sm text-text-secondary">
          Weekly summary, daily sales trend, delivery/payment charts
        </p>
        <div class="mt-4 flex items-center text-emerald-600 text-sm font-semibold">
          View Report <ChevronRight :size="16" class="ml-1"/>
        </div>
      </NuxtLink>

      <!-- Monthly -->
      <NuxtLink to="/reports/monthly"
        class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4
               hover:border-primary transition-colors group">
        <div class="w-12 h-12 border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10 rounded flex items-center
                    justify-center mb-4 group-hover:bg-blue-600
                    group-hover:text-white transition duration-300">
          <BarChart2 :size="22" class="text-blue-600 group-hover:text-white transition duration-300"/>
        </div>
        <h2 class="font-bold text-text-primary mb-1">Monthly Report</h2>
        <p class="text-sm text-text-secondary">
          Monthly trends, top books, category breakdown
        </p>
        <div class="mt-4 flex items-center text-blue-600 text-sm font-semibold">
          View Report <ChevronRight :size="16" class="ml-1"/>
        </div>
      </NuxtLink>

      <!-- Yearly -->
      <NuxtLink to="/reports/yearly"
        class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4
               hover:border-primary transition-colors group">
        <div class="w-12 h-12 border border-purple-200 dark:border-purple-500/20 bg-purple-50/50 dark:bg-purple-500/10 rounded flex items-center
                    justify-center mb-4 group-hover:bg-purple-600
                    group-hover:text-white transition duration-300">
          <TrendingUp :size="22" class="text-purple-600 group-hover:text-white transition duration-300"/>
        </div>
        <h2 class="font-bold text-text-primary mb-1">Yearly Report</h2>
        <p class="text-sm text-text-secondary">
          Full year performance, growth trends, annual summary
        </p>
        <div class="mt-4 flex items-center text-purple-600 text-sm font-semibold">
          View Report <ChevronRight :size="16" class="ml-1"/>
        </div>
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
import { Calendar, CalendarDays, ChevronRight, BarChart2, TrendingUp, FileText } from 'lucide-vue-next'
</script>
