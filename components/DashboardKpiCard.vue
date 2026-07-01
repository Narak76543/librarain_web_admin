<template>
  <div class="bg-card p-4 rounded border border-border flex flex-col justify-between">
    <div class="flex justify-between items-start mb-4">
      <div 
        class="w-10 h-10 rounded flex items-center justify-center"
        :class="colorClasses.bg"
      >
        <component :is="iconComponent" class="w-5 h-5" :class="colorClasses.text" />
      </div>
      
      <div v-if="trend" class="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full" :class="trendClasses.bg + ' ' + trendClasses.text">
        <TrendingUpIcon v-if="trend !== 'New' && trend !== '0%' && !trend.includes('-')" class="w-3 h-3" />
        <TrendingDownIcon v-else-if="trend.includes('-')" class="w-3 h-3" />
        <PlusIcon v-else-if="trend === 'New'" class="w-3 h-3" />
        <MinusIcon v-else-if="trend === '0%'" class="w-3 h-3" />
        {{ trend }}
      </div>
    </div>
    
    <div>
      <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{{ title }}</h3>
      <p class="text-2xl font-bold text-text-primary">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: String,
  trend: String,
  icon: String,
  color: {
    type: String,
    default: 'blue'
  }
})

const iconComponent = computed(() => {
  return icons[props.icon] || icons.CircleIcon
})

const TrendingUpIcon = icons.TrendingUp
const TrendingDownIcon = icons.TrendingDown
const PlusIcon = icons.Plus
const MinusIcon = icons.Minus

const colorClasses = computed(() => {
  return { bg: 'bg-card border border-border', text: 'text-text-primary' }
})

const trendClasses = computed(() => {
  if (props.trend === 'New' || (!props.trend?.includes('-') && props.trend !== '0%')) {
    return { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' }
  } else if (props.trend === '0%') {
    return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-text-secondary' }
  } else {
    return { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' }
  }
})
</script>
