<template>
  <span 
    class="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center"
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
    return 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm'
  }
  if (s === 'processing') {
    return 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
  }
  if (s === 'pending') {
    return 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm'
  }
  if (s === 'cancelled' || s === 'error') {
    return 'bg-red-50 text-red-600 border border-red-100 shadow-sm'
  }
  return 'bg-gray-50 text-gray-600 border border-gray-200 shadow-sm'
})
</script>
