<template>
  <header class="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
    <h1 class="text-xl font-semibold text-text-primary">{{ pageTitle }}</h1>
    <div class="flex items-center gap-4">
      
      <!-- Global Module Search -->
      <div class="relative" ref="searchContainer">
        <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          v-model="searchQuery"
          @focus="isSearchOpen = true"
          placeholder="Search modules..." 
          class="pl-9 w-64 bg-card border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm h-9 transition-colors" 
        />
        
        <!-- Search Results Dropdown -->
        <div v-if="isSearchOpen && searchQuery" class="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <ul class="max-h-64 overflow-y-auto py-1">
            <li v-for="module in filteredModules" :key="module.path">
              <NuxtLink 
                :to="module.path"
                @click="closeSearch"
                class="block px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface transition-colors"
              >
                {{ module.name }}
              </NuxtLink>
            </li>
            <li v-if="filteredModules.length === 0" class="px-4 py-3 text-sm text-text-secondary text-center">
              No modules found
            </li>
          </ul>
        </div>
      </div>

      <ThemeToggle />
      <NotificationDropdown />
      <div v-if="user" class="hidden md:block text-right ml-2 border-l border-border pl-4">
        <p class="text-sm font-semibold text-text-primary leading-tight">{{ user.full_name }}</p>
        <p class="text-xs text-text-secondary">{{ user.email }}</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from 'lucide-vue-next'

const route = useRoute()
const user = ref(null)

// Search state
const searchQuery = ref('')
const isSearchOpen = ref(false)
const searchContainer = ref(null)

const modules = [
  { name: 'Dashboard', path: '/' },
  { name: 'Books', path: '/books' },
  { name: 'Categories', path: '/categories' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Orders', path: '/orders' },
  { name: 'Purchase Orders', path: '/purchase-orders' },
  { name: 'Reports (Overview)', path: '/reports' },
  { name: 'Daily Report', path: '/reports/daily' },
  { name: 'Weekly Report', path: '/reports/weekly' },
  { name: 'Monthly Report', path: '/reports/monthly' },
  { name: 'Yearly Report', path: '/reports/yearly' },
  { name: 'Suppliers', path: '/suppliers' },
  { name: 'System Logs', path: '/logs' },
  { name: 'Users', path: '/users' },
  { name: 'Settings', path: '/settings' }
]

const filteredModules = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return modules.filter(m => m.name.toLowerCase().includes(query))
})

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

// Close search on outside click
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    isSearchOpen.value = false
  }
}

onMounted(() => {
  const { getCurrentUser } = useAuth()
  user.value = getCurrentUser()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const pageTitle = computed(() => {
  if (route.path === '/') return 'Dashboard'
  if (route.path.startsWith('/books')) return 'Books'
  if (route.path.startsWith('/categories')) return 'Categories'
  if (route.path.startsWith('/orders')) return 'Orders'
  if (route.path.startsWith('/users')) return 'Users'
  if (route.path.startsWith('/settings')) return 'Settings'
  if (route.path.startsWith('/logs')) return 'System Logs'
  if (route.path.startsWith('/purchase-orders')) return 'Purchase Orders'
  if (route.path.startsWith('/reports')) return 'Reports'
  if (route.path.startsWith('/suppliers')) return 'Suppliers'
  if (route.path.startsWith('/inventory')) return 'Inventory'
  return ''
})
</script>
