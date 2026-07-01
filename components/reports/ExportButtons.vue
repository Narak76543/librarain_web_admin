<template>
  <div class="flex gap-2">
    <button @click="$emit('export', 'csv')"
      :disabled="loading"
      class="flex items-center gap-2 h-8 px-3 bg-card hover:bg-gray-50 dark:hover:bg-gray-500/10 border border-border
             rounded-lg text-[13px] text-text-secondary hover:bg-gray-50 transition active:scale-95 disabled:opacity-50">
      <FileCode :size="14" class="text-blue-600"/>
      CSV
    </button>
    <button @click="$emit('export', 'excel')"
      :disabled="loading"
      class="flex items-center gap-2 h-8 px-3 bg-card hover:bg-gray-50 dark:hover:bg-gray-500/10 border border-border
             rounded-lg text-[13px] text-text-secondary hover:bg-gray-50 transition active:scale-95 disabled:opacity-50">
      <FileSpreadsheet :size="14" class="text-green-600"/>
      Excel
    </button>
    <button @click="$emit('export', 'pdf')"
      :disabled="loading"
      class="flex items-center gap-2 h-8 px-3 bg-card hover:bg-gray-50 dark:hover:bg-gray-500/10 border border-border
             rounded-lg text-[13px] text-text-secondary hover:bg-gray-50 transition active:scale-95 disabled:opacity-50">
      <FileText :size="14" class="text-red-500"/>
      PDF
    </button>
  </div>
</template>

<script setup>
import { FileSpreadsheet, FileText, FileCode } from 'lucide-vue-next'
defineProps({ loading: Boolean })
defineEmits(['export'])
</script>
