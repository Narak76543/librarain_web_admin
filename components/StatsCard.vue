<template>
  <div class="card flex items-center gap-4 animate-fade-in-up group">
    <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="colorClass">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <div>
      <p class="text-sm text-text-secondary">{{ title }}</p>
      <p class="text-2xl font-semibold text-text-primary">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BookOpen, ShoppingBag, Users, DollarSign } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: [String, Number],
  type: String
})

const icon = computed(() => {
  if (props.type === 'books') return BookOpen
  if (props.type === 'orders') return ShoppingBag
  if (props.type === 'users') return Users
  if (props.type === 'revenue') return DollarSign
  return BookOpen
})

const colorClass = computed(() => {
  return 'bg-card border border-border text-text-primary shadow-sm'
})
</script>
