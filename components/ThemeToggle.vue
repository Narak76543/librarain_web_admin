<template>
  <div class="flex items-center gap-3">
    <span class="text-sm font-medium text-text-secondary">
      <Sun v-if="!isDark" class="w-4 h-4" />
      <Moon v-else class="w-4 h-4" />
    </span>
    <button 
      @click="toggleTheme" 
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      :class="isDark ? 'bg-primary' : 'bg-gray-300'"
      role="switch"
      :aria-checked="isDark"
    >
      <span class="sr-only">Toggle Dark Mode</span>
      <span 
        class="inline-block h-4 w-4 transform rounded-full bg-card transition-transform"
        :class="isDark ? 'translate-x-6' : 'translate-x-1'"
      />
    </button>
  </div>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
