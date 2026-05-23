<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative">
        <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search orders (ID, customer)..." class="pl-9 w-full md:w-64 bg-white" />
      </div>
      
      <div class="flex flex-wrap items-center gap-4">
        <select class="bg-white min-w-[150px]">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <input type="date" class="bg-white" />
        <span class="text-text-secondary text-sm">to</span>
        <input type="date" class="bg-white" />
      </div>
    </div>

    <div class="card !p-0 overflow-hidden">
      <!-- Custom table for row expansion -->
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border">
            <tr>
              <th class="px-6 py-3">Order ID</th>
              <th class="px-6 py-3">Customer</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3 text-center">Items</th>
              <th class="px-6 py-3">Total</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <template v-for="(row, idx) in orders" :key="row.id">
              <!-- Main Row -->
              <tr 
                class="hover:bg-surface/50 transition-colors cursor-pointer group"
                :class="{'bg-surface/20': idx % 2 === 1, 'bg-primary-light/30': expandedRow === row.id}"
                @click="toggleRow(row.id)"
              >
                <td class="px-6 py-4 font-semibold">{{ row.id }}</td>
                <td class="px-6 py-4">
                  <p class="font-semibold text-text-primary">{{ row.customer }}</p>
                  <p class="text-xs text-text-secondary">{{ row.email }}</p>
                </td>
                <td class="px-6 py-4 text-text-secondary">{{ row.date }}</td>
                <td class="px-6 py-4 text-center">{{ row.books }}</td>
                <td class="px-6 py-4 font-medium">${{ row.total.toFixed(2) }}</td>
                <td class="px-6 py-4">
                  <StatusBadge :status="row.status" />
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-surface text-text-secondary transition-colors" :class="{'rotate-180': expandedRow === row.id}">
                    <ChevronDown class="w-4 h-4 transition-transform" />
                  </button>
                </td>
              </tr>
              
              <!-- Expanded Panel -->
              <tr v-if="expandedRow === row.id" class="bg-surface/30 border-b border-border">
                <td colspan="7" class="p-6">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Order Items -->
                    <div class="lg:col-span-2">
                      <h4 class="text-sm font-semibold text-text-primary mb-4">Order Items</h4>
                      <div class="space-y-4">
                        <div v-for="i in row.books" :key="i" class="flex items-center gap-4 border border-border rounded-lg p-3 bg-white">
                          <img :src="books[i % books.length].cover" class="w-12 h-16 object-cover rounded" />
                          <div class="flex-1">
                            <p class="font-semibold text-text-primary">{{ books[i % books.length].title }}</p>
                            <p class="text-xs text-text-secondary">By {{ books[i % books.length].author }}</p>
                          </div>
                          <div class="text-right">
                            <p class="font-semibold text-text-primary">${{ books[i % books.length].price.toFixed(2) }}</p>
                            <p class="text-xs text-text-secondary">Qty: 1</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Summary & Actions -->
                    <div>
                      <h4 class="text-sm font-semibold text-text-primary mb-4">Order Summary</h4>
                      <div class="bg-white border border-border rounded-lg p-4 space-y-3">
                        <div class="flex justify-between text-sm">
                          <span class="text-text-secondary">Subtotal</span>
                          <span class="font-medium text-text-primary">${{ (row.total * 0.9).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-text-secondary">Tax (10%)</span>
                          <span class="font-medium text-text-primary">${{ (row.total * 0.1).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-text-secondary">Shipping</span>
                          <span class="font-medium text-text-primary">$0.00</span>
                        </div>
                        <div class="pt-3 border-t border-border flex justify-between">
                          <span class="font-semibold text-text-primary">Total</span>
                          <span class="font-semibold text-primary">${{ row.total.toFixed(2) }}</span>
                        </div>
                      </div>
                      
                      <h4 class="text-sm font-semibold text-text-primary mb-3 mt-6">Update Status</h4>
                      <div class="flex gap-2">
                        <select class="flex-1 bg-white" v-model="row.status">
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button class="btn-primary">Update</button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 border-t border-border bg-white flex justify-between items-center text-sm">
        <p class="text-text-secondary">Showing <span class="font-semibold text-text-primary">1</span> to <span class="font-semibold text-text-primary">5</span> of <span class="font-semibold text-text-primary">89</span> results</p>
        <!-- Simple pagination static -->
        <div class="flex gap-1">
          <button class="w-8 h-8 rounded border border-border flex items-center justify-center opacity-50">&lt;</button>
          <button class="w-8 h-8 rounded bg-primary text-white font-medium">1</button>
          <button class="w-8 h-8 rounded border border-border hover:bg-surface">2</button>
          <button class="w-8 h-8 rounded border border-border hover:bg-surface">3</button>
          <button class="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-surface">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, ChevronDown } from 'lucide-vue-next'

const { orders, books } = useMockData()

const expandedRow = ref(null)

const toggleRow = (id) => {
  if (expandedRow.value === id) {
    expandedRow.value = null
  } else {
    expandedRow.value = id
  }
}
</script>
