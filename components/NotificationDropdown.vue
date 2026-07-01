<template>
  <div class="relative">
    <button @click="toggle" class="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface transition-colors focus:outline-none">
      <Bell class="w-5 h-5" />
      <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
    </button>

    <!-- Overlay to catch clicks outside -->
    <div v-if="isOpen" @click="close" class="fixed inset-0 z-40"></div>

    <!-- Dropdown Panel -->
    <div v-if="isOpen" class="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-border flex items-center justify-between bg-surface/50">
        <h3 class="font-bold text-text-primary">Notifications</h3>
        <button @click="fetchLogs" class="text-text-secondary hover:text-primary transition" title="Refresh">
          <RefreshCcw :class="{'animate-spin': loading}" class="w-4 h-4" />
        </button>
      </div>

      <div class="overflow-y-auto max-h-[400px]">
        <div v-if="loading && logs.length === 0" class="p-8 flex justify-center">
          <Loader2 class="w-6 h-6 text-primary animate-spin" />
        </div>
        
        <div v-else-if="logs.length === 0" class="p-8 text-center text-text-secondary">
          <BellOff class="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p class="text-sm">No new notifications</p>
        </div>

        <div v-else class="divide-y divide-border">
          <div v-for="log in logs" :key="log.id" class="p-4 hover:bg-surface/50 transition cursor-default">
            <div class="flex gap-3">
              <div class="mt-0.5">
                <div :class="getIconClass(log.level)" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <component :is="getIcon(log.level)" class="w-4 h-4" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-text-primary truncate">{{ formatAction(log.action) }}</p>
                <p class="text-xs text-text-secondary mt-0.5 line-clamp-2">{{ log.description || log.module }}</p>
                <p class="text-[10px] text-text-secondary font-medium mt-1.5">{{ formatTime(log.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 border-t border-border text-center bg-surface/50">
        <span class="text-xs font-semibold text-text-secondary">
          End of notifications
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell, BellOff, Loader2, RefreshCcw, Info, AlertTriangle, XCircle } from 'lucide-vue-next'
import { useLogs } from '~/composables/useLogs'

const isOpen = ref(false)
const loading = ref(false)
const logs = ref([])
const unreadCount = ref(0)
let pollInterval = null

const { getSystemLogs } = useLogs()

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await getSystemLogs({ limit: 15 })
    if (res?.data?.logs) {
      logs.value = res.data.logs
      const fiveMinsAgo = new Date(Date.now() - 5 * 60000)
      unreadCount.value = logs.value.filter(l => new Date(l.created_at) > fiveMinsAgo).length
    }
  } catch (error) {
    console.error('Failed to fetch logs', error)
  } finally {
    loading.value = false
  }
}

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    fetchLogs()
    unreadCount.value = 0 // clear indicator on open
  }
}

const close = () => {
  isOpen.value = false
}

const formatAction = (action) => {
  if (!action) return 'System Event'
  return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return Math.floor(diff / 86400000) + 'd ago'
}

const getIcon = (level) => {
  switch(level) {
    case 'ERROR':
    case 'CRITICAL': return XCircle
    case 'WARNING': return AlertTriangle
    default: return Info
  }
}

const getIconClass = (level) => {
  switch(level) {
    case 'ERROR':
    case 'CRITICAL': return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
    case 'WARNING': return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
    default: return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
  }
}

onMounted(() => {
  fetchLogs() // initial fetch for badge
  // poll every 30s for demo
  pollInterval = setInterval(() => {
    if (!isOpen.value) fetchLogs()
  }, 30000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
