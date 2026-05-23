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
  if (s === 'delivered' || s === 'active') {
    return 'bg-primary-light text-primary'
  }
  if (s === 'processing') {
    return 'bg-amber-100 text-amber-700'
  }
  if (s === 'pending') {
    return 'bg-blue-100 text-blue-700'
  }
  if (s === 'cancelled' || s === 'error') {
    return 'bg-red-100 text-error'
  }
  return 'bg-gray-100 text-text-secondary'
})
</script>
