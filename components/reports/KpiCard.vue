<template>
  <div class="bg-card rounded border border-border p-4 transition-colors">
    <div class="flex items-center justify-between mb-3">
      <p class="text-sm text-text-secondary font-medium">{{ label }}</p>
      <div :class="`p-2 rounded-lg ${iconBg}`">
        <component :is="icon" :size="18" :class="iconColor"/>
      </div>
    </div>
    <p :class="`text-2xl font-bold ${valueColor}`">{{ value }}</p>
    <p v-if="sub" class="text-xs text-text-secondary mt-1 font-normal">{{ sub }}</p>
  </div>
</template>

<script setup>
defineProps({
  label:      String,
  value:      [String, Number],
  sub:        String,
  icon:       Object,
  iconBg:     { type: String, default: 'bg-green-50 dark:bg-green-500/10' },
  iconColor:  { type: String, default: 'text-primary dark:text-primary' },
  valueColor: { type: String, default: 'text-text-primary' },
})
</script>
