<template>
  <span :class="classes" class="px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide rounded border">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const label = computed(() => {
  return props.status ? props.status.toUpperCase() : 'UNKNOWN'
})

const classes = computed(() => {
  const stat = props.status ? props.status.toLowerCase() : ''
  switch (stat) {
    case 'paid':
      return 'bg-green-50/50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
    case 'issued':
      return 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
    case 'cancelled':
      return 'bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
    case 'refunded':
      return 'bg-purple-50/50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
    case 'draft':
    default:
      return 'bg-gray-50/50 dark:bg-gray-500/10 text-gray-700 dark:text-text-secondary border-gray-200 dark:border-gray-500/20'
  }
})
</script>
