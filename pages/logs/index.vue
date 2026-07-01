<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-2xl font-bold text-text-primary mb-1">System Logs</h1>
        <p class="text-sm text-text-secondary">View and track all important system operations and events.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="fetchStats"
          class="h-[38px] px-4 rounded-md border border-gray-200 dark:border-gray-500/20 text-sm font-medium text-text-secondary hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-card rounded-md border border-gray-200 dark:border-gray-500/20 p-4 mb-4 flex flex-wrap gap-4 items-end">
      <div class="w-full md:w-64">
        <label class="block text-[12px] font-medium text-text-secondary mb-1">Search</label>
        <div class="relative">
          <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="filters.search"
            type="text" 
            placeholder="Search action or desc..." 
            class="w-full h-[38px] pl-9 pr-3 rounded-md border border-gray-200 dark:border-gray-500/20 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            @keyup.enter="applyFilters"
          />
        </div>
      </div>

      <div class="w-full md:w-40">
        <label class="block text-[12px] font-medium text-text-secondary mb-1">Module</label>
        <select 
          v-model="filters.module" 
          class="w-full h-[38px] px-3 rounded-md border border-gray-200 dark:border-gray-500/20 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"
        >
          <option value="">All Modules</option>
          <option value="AUTH">Auth</option>
          <option value="ORDER">Order</option>
          <option value="BOOK">Book</option>
          <option value="CATEGORY">Category</option>
          <option value="PROFILE">Profile</option>
          <option value="ADMIN">Admin</option>
          <option value="STOCK">Stock</option>
          <option value="CART">Cart</option>
          <option value="WISHLIST">Wishlist</option>
          <option value="SYSTEM">System</option>
        </select>
      </div>

      <div class="w-full md:w-40">
        <label class="block text-[12px] font-medium text-text-secondary mb-1">Level</label>
        <select 
          v-model="filters.level" 
          class="w-full h-[38px] px-3 rounded-md border border-gray-200 dark:border-gray-500/20 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"
        >
          <option value="">All Levels</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="ERROR">Error</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div class="w-full md:w-40">
        <label class="block text-[12px] font-medium text-text-secondary mb-1">User Role</label>
        <select 
          v-model="filters.user_role" 
          class="w-full h-[38px] px-3 rounded-md border border-gray-200 dark:border-gray-500/20 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-card"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="SYSTEM">System</option>
        </select>
      </div>

      <button 
        @click="applyFilters"
        class="h-[38px] px-6 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        Filter
      </button>

      <button 
        @click="resetFilters"
        class="h-[38px] px-4 rounded-md border border-gray-200 dark:border-gray-500/20 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- Logs Table -->
    <div class="bg-card rounded-md border border-gray-200 dark:border-gray-500/20 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-card/50 flex items-center justify-center z-10">
        <Loader2 class="w-6 h-6 text-primary animate-spin" />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface border-b border-border text-text-secondary font-medium">
            <tr>
              <th class="px-4 py-3">Timestamp</th>
              <th class="px-4 py-3">Level</th>
              <th class="px-4 py-3">Module</th>
              <th class="px-4 py-3">Action</th>
              <th class="px-4 py-3">Description</th>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">IP Address</th>
              <th class="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-500/10 transition-colors">
              <td class="px-4 py-3 text-text-secondary">
                {{ new Date(log.created_at).toLocaleString() }}
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium" :class="getLevelColor(log.level)">
                  {{ log.level }}
                </span>
              </td>
              <td class="px-4 py-3 font-medium text-text-secondary">{{ log.module }}</td>
              <td class="px-4 py-3 text-text-primary">{{ log.action }}</td>
              <td class="px-4 py-3 text-text-secondary truncate max-w-[250px]" :title="log.description">
                {{ log.description }}
              </td>
              <td class="px-4 py-3">
                <div v-if="log.user_email">
                  <div class="text-text-primary">{{ log.user_email }}</div>
                  <div class="text-[11px] text-text-secondary">{{ log.user_role }}</div>
                </div>
                <div v-else class="text-text-secondary text-xs italic">System</div>
              </td>
              <td class="px-4 py-3 text-text-secondary text-xs">
                {{ log.ip_address || '-' }}
              </td>
              <td class="px-4 py-3">
                <button 
                  @click="viewDetails(log)"
                  class="text-primary hover:underline font-medium text-xs flex items-center gap-1"
                >
                  <Eye class="w-3 h-3" /> View
                </button>
              </td>
            </tr>
            <tr v-if="logs.length === 0 && !loading">
              <td colspan="8" class="px-4 py-8 text-center text-text-secondary">
                No logs found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-border flex items-center justify-between bg-surface">
        <span class="text-sm text-text-secondary">
          Showing {{ pagination.offset + 1 }} to {{ Math.min(pagination.offset + pagination.limit, pagination.total) }} of {{ pagination.total }} entries
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="h-8 px-3 rounded border border-gray-200 dark:border-gray-500/20 bg-card text-sm font-medium text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Prev
          </button>
          <div class="flex items-center gap-1">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="changePage(page)"
              class="h-8 w-8 rounded text-sm font-medium flex items-center justify-center transition-colors"
              :class="page === currentPage ? 'bg-primary text-white' : 'border border-gray-200 dark:border-gray-500/20 bg-card text-text-secondary hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </div>
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="h-8 px-3 rounded border border-gray-200 dark:border-gray-500/20 bg-card text-sm font-medium text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-text-primary">Log Details</h3>
          <button @click="selectedLog = null" class="text-text-secondary hover:text-text-secondary">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto flex-1">
          <div class="grid grid-cols-2 gap-y-4 gap-x-6 mb-4">
            <div>
              <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Timestamp</p>
              <p class="text-sm font-medium text-text-primary">{{ new Date(selectedLog.created_at).toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Level / Module</p>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium" :class="getLevelColor(selectedLog.level)">
                  {{ selectedLog.level }}
                </span>
                <span class="text-sm font-medium text-text-secondary">{{ selectedLog.module }}</span>
              </div>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Action</p>
              <p class="text-sm font-medium text-text-primary">{{ selectedLog.action }}</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Status</p>
              <span class="px-2 py-0.5 rounded text-[11px] font-medium" :class="selectedLog.status === 'SUCCESS' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'">
                {{ selectedLog.status }}
              </span>
            </div>
            <div class="col-span-2">
              <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Description</p>
              <p class="text-sm text-text-secondary">{{ selectedLog.description }}</p>
            </div>
          </div>

          <!-- User Info -->
          <div class="border border-border rounded-md p-4 mb-4 bg-surface">
            <h4 class="text-xs font-bold text-text-primary mb-3 uppercase">Context</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="block text-[11px] text-text-secondary">User Email</span>
                <span class="text-sm font-medium text-text-primary">{{ selectedLog.user_email || 'System' }}</span>
              </div>
              <div>
                <span class="block text-[11px] text-text-secondary">User Role</span>
                <span class="text-sm font-medium text-text-primary">{{ selectedLog.user_role || '-' }}</span>
              </div>
              <div>
                <span class="block text-[11px] text-text-secondary">IP Address</span>
                <span class="text-sm font-medium text-text-primary">{{ selectedLog.ip_address || '-' }}</span>
              </div>
              <div>
                <span class="block text-[11px] text-text-secondary">Endpoint</span>
                <span class="text-sm font-medium text-text-primary">{{ selectedLog.method || '' }} {{ selectedLog.endpoint || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Changes (Old vs New) -->
          <div v-if="selectedLog.old_value || selectedLog.new_value" class="mb-2">
            <h4 class="text-xs font-bold text-text-primary mb-3 uppercase">Data Changes</h4>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="selectedLog.old_value" class="border border-red-100 rounded-md overflow-hidden">
                <div class="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 border-b border-red-100">
                  Old Value
                </div>
                <div class="p-3 bg-red-50/30">
                  <pre class="text-[11px] text-text-secondary overflow-x-auto">{{ JSON.stringify(selectedLog.old_value, null, 2) }}</pre>
                </div>
              </div>
              <div v-if="selectedLog.new_value" class="border border-green-100 rounded-md overflow-hidden" :class="{ 'col-span-2': !selectedLog.old_value }">
                <div class="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 border-b border-green-100">
                  New Value
                </div>
                <div class="p-3 bg-green-50/30">
                  <pre class="text-[11px] text-text-secondary overflow-x-auto">{{ JSON.stringify(selectedLog.new_value, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-right">
          <button @click="selectedLog = null" class="h-9 px-4 rounded border border-gray-200 dark:border-gray-500/20 bg-card text-sm font-medium text-text-secondary hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Activity, Search, RefreshCw, Loader2, Eye, X } from 'lucide-vue-next'

const logs = ref([])
const loading = ref(false)
const isRefreshing = ref(false)
const selectedLog = ref(null)

const filters = ref({
  search: '',
  module: '',
  level: '',
  user_role: ''
})

const pagination = ref({
  limit: 20,
  offset: 0,
  total: 0
})

const currentPage = computed(() => Math.floor(pagination.value.offset / pagination.value.limit) + 1)
const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit))

const fetchLogs = async (showRefresh = false) => {
  if (showRefresh) isRefreshing.value = true
  else loading.value = true
  
  try {
    const { getSystemLogs } = useLogs()
    const query = {
      limit: pagination.value.limit,
      offset: pagination.value.offset,
      ...filters.value
    }
    
    // Remove empty filters
    Object.keys(query).forEach(key => {
      if (query[key] === '') delete query[key]
    })
    
    const res = await getSystemLogs(query)
    if (res?.ok) {
      logs.value = res.data.logs
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('Failed to fetch logs:', error)
  } finally {
    loading.value = false
    isRefreshing.value = false
  }
}

const fetchStats = () => {
  fetchLogs(true)
}

const applyFilters = () => {
  pagination.value.offset = 0
  fetchLogs()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    module: '',
    level: '',
    user_role: ''
  }
  pagination.value.offset = 0
  fetchLogs()
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.offset = (page - 1) * pagination.value.limit
  fetchLogs()
}

const viewDetails = (log) => {
  selectedLog.value = log
}

const getLevelColor = (level) => {
  switch (level) {
    case 'INFO': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'WARNING': return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
    case 'ERROR': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
    case 'CRITICAL': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'
    default: return 'bg-gray-100 dark:bg-gray-500/10 text-text-secondary'
  }
}

onMounted(() => {
  fetchLogs()
})
</script>
