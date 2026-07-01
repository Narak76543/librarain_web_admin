<template>
  <span 
    class="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium inline-flex items-center border"
    :class="badgeClass"
  >
    {{ displayStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: [String, Boolean],
    required: true
  }
})

const displayStatus = computed(() => {
  if (typeof props.status === 'boolean') {
    return props.status ? 'Active' : 'Inactive'
  }
  return props.status
})

const badgeClass = computed(() => {
  const s = String(displayStatus.value).toLowerCase()
  if (s === 'completed' || s === 'delivered' || s === 'active') {
    return 'bg-green-50/50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
  }
  if (s === 'processing') {
    return 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
  }
  if (s === 'pending') {
    return 'bg-gray-50/50 dark:bg-gray-500/10 text-gray-600 dark:text-text-secondary border-gray-200 dark:border-gray-500/20'
  }
  if (s === 'cancelled' || s === 'error') {
    return 'bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
  }
  return 'bg-gray-50/50 dark:bg-gray-500/10 text-gray-600 dark:text-text-secondary border-gray-200 dark:border-gray-500/20'
})
</script>
