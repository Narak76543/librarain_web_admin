<template>
  <div class="min-h-screen bg-surface flex">
    <AdminSidebar v-if="!isLoginPage" />
    <div class="flex-1 flex flex-col min-w-0" :class="{ 'ml-60': !isLoginPage }">
      <AdminTopbar v-if="!isLoginPage" />
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')

onMounted(async () => {
  if (isLoginPage.value) return
  
  const { isLoggedIn, getMe } = useAuth()

  if (!isLoggedIn()) {
    navigateTo('/login')
    return
  }

  try {
    const res = await getMe()
    if (!res || !res.ok) navigateTo('/login')
  } catch (err) {
    if (err.data?.status === 401) {
      navigateTo('/login')
    }
  }
})
</script>
