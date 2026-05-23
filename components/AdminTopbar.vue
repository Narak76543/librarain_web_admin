<template>
  <header class="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
    <h1 class="text-xl font-semibold text-text-primary">{{ pageTitle }}</h1>
    <div class="flex items-center gap-4">
      <div class="relative">
        <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search..." class="pl-9 w-64 bg-surface border-none" />
      </div>
      <button class="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface transition-colors">
        <Bell class="w-5 h-5" />
      </button>
      <div v-if="user" class="hidden md:block text-right ml-2 border-l border-border pl-4">
        <p class="text-sm font-semibold text-text-primary leading-tight">{{ user.full_name }}</p>
        <p class="text-xs text-text-secondary">{{ user.email }}</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Bell } from 'lucide-vue-next'

const route = useRoute()
const user = ref(null)

onMounted(() => {
  const { getCurrentUser } = useAuth()
  user.value = getCurrentUser()
})

const pageTitle = computed(() => {
  if (route.path === '/') return 'Dashboard'
  if (route.path.startsWith('/books')) return 'Books'
  if (route.path.startsWith('/categories')) return 'Categories'
  if (route.path.startsWith('/orders')) return 'Orders'
  if (route.path.startsWith('/users')) return 'Users'
  if (route.path.startsWith('/settings')) return 'Settings'
  return ''
})
</script>
