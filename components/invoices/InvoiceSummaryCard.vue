<template>
  <div class="bg-card rounded border border-border p-4 transition-colors flex items-center justify-between">
    <div>
      <p class="text-xs font-bold text-text-secondary uppercase tracking-wider">{{ label }}</p>
      <p :class="`text-2xl font-bold mt-2 ${valueColor}`">{{ value }}</p>
      <p v-if="sub" class="text-xs text-text-secondary mt-1 font-normal">{{ sub }}</p>
    </div>
    <div :class="`p-3 rounded-lg ${iconBg}`">
      <component :is="icon" :size="22" :class="iconColor"/>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  sub: String,
  icon: Object,
  iconBg: { type: String, default: 'bg-green-50 dark:bg-green-500/10' },
  iconColor: { type: String, default: 'text-primary' },
  valueColor: { type: String, default: 'text-text-primary' }
})
</script>
