<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="card w-full max-w-md animate-in fade-in zoom-in duration-200">
      <h3 class="text-lg font-semibold text-text-primary mb-2">{{ title }}</h3>
      <p class="text-text-secondary mb-4 text-sm">{{ message }}</p>
      
      <div class="flex justify-end gap-3">
        <button 
          @click="$emit('cancel')"
          class="h-10 px-4 rounded-lg font-medium text-sm text-text-primary hover:bg-surface transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="$emit('confirm')"
          class="h-10 px-4 rounded-lg font-medium text-sm bg-error text-white hover:bg-red-600 transition-colors"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmLabel: { type: String, default: 'Confirm' }
})

defineEmits(['confirm', 'cancel'])
</script>
