<template>
  <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
    <div class="flex justify-between items-start mb-4">
      <div 
        class="w-10 h-10 rounded-lg flex items-center justify-center"
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
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ title }}</h3>
      <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
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
  const map = {
    green: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    red: { bg: 'bg-rose-100', text: 'text-rose-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' }
  }
  return map[props.color] || map.blue
})

const trendClasses = computed(() => {
  if (props.trend === 'New' || (!props.trend?.includes('-') && props.trend !== '0%')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-600' }
  } else if (props.trend === '0%') {
    return { bg: 'bg-gray-100', text: 'text-gray-600' }
  } else {
    return { bg: 'bg-rose-50', text: 'text-rose-600' }
  }
})
</script>
