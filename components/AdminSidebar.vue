<template>
  <aside class="w-60 fixed left-0 top-0 h-full bg-white border-r border-border flex flex-col z-20">
    <div class="h-16 flex items-center px-6 border-b border-border">
      <img src="~/assets/images/icon.png" class="w-8 h-8 mr-2 object-contain" alt="Logo" />
      <span class="text-lg font-semibold text-text-primary">BookStore</span>
      <span class="text-[12px] text-text-secondary ml-1 mt-1">Admin</span>
    </div>
    
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="h-11 rounded-lg px-4 flex items-center gap-3 transition-colors"
        :class="[
          route.path === item.path 
            ? 'bg-primary-light text-primary border-l-4 border-primary font-semibold' 
            : 'text-text-secondary hover:bg-surface font-medium'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.label }}
      </NuxtLink>
    </nav>
    
    <div class="p-4 border-t border-border flex items-center gap-3">
      <img
        v-if="profile?.avatar_url"
        :src="profile.avatar_url"
        :alt="displayName"
        class="w-8 h-8 rounded-full object-cover border border-border"
      />
      <div v-else class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
        {{ initials }}
      </div>
      <div class="flex-1 overflow-hidden">
        <p class="text-sm font-semibold text-text-primary truncate">{{ displayName }}</p>
        <p v-if="user?.email" class="text-[11px] text-text-secondary truncate">{{ user.email }}</p>
        <button @click="handleLogout" class="text-xs text-error hover:underline flex items-center gap-1 mt-0.5">
          <LogOut class="w-3 h-3" /> Logout
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Book, LayoutDashboard, Library, Tags, ShoppingCart, Users, Settings, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const profile = ref(null)

onMounted(async () => {
  const { getCurrentUser } = useAuth()
  user.value = getCurrentUser()

  try {
    const { getProfile } = useUserProfile()
    const res = await getProfile()
    if (res?.ok) {
      user.value = res.data?.user || user.value
      profile.value = res.data?.profile || null
    }
  } catch (error) {
    console.error('Failed to load admin profile:', error)
  }
})

const displayName = computed(() => {
  const profileName = [profile.value?.first_name, profile.value?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()

  return profileName || user.value?.full_name || 'Admin User'
})

const initials = computed(() => {
  return displayName.value
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AU'
})

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/books', label: 'Books', icon: Library },
  { path: '/categories', label: 'Categories', icon: Tags },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const handleLogout = async () => {
  const { logout } = useAuth()
  await logout()
  navigateTo('/login')
}
</script>
