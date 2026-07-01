<template>
  <div class="card !p-0 overflow-hidden animate-fade-in">
    <div class="w-full overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border">
          <tr>
            <th v-for="col in columns" :key="col.key" class="px-6 py-3" :class="col.class">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border bg-card">
          <tr 
            v-for="(row, idx) in rows" 
            :key="idx" 
            class="hover:bg-surface transition-colors group cursor-pointer"
            @click="$emit('row-click', row)"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-2.5" :class="col.class">
              <slot :name="col.key" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="columns.length" class="px-6 py-8 text-center text-text-secondary">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="total > 0" class="px-4 py-2.5 border-t border-border bg-card flex justify-between items-center text-sm">
      <p class="text-text-secondary">Showing <span class="font-medium text-text-primary">{{ (page - 1) * perPage + 1 }}</span> to <span class="font-medium text-text-primary">{{ Math.min(page * perPage, total) }}</span> of <span class="font-medium text-text-primary">{{ total }}</span> results</p>
      
      <div class="flex gap-1">
        <button 
          class="w-8 h-8 rounded border border-border flex items-center justify-center disabled:opacity-50 hover:bg-surface text-text-secondary transition-colors"
          :disabled="page === 1"
          @click="$emit('page-change', page - 1)"
        >
          &larr;
        </button>
        <button 
          v-for="p in totalPages" 
          :key="p"
          class="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors border"
          :class="p === page ? 'border-primary bg-primary text-white' : 'border-transparent text-text-secondary hover:bg-surface hover:border-border'"
          @click="$emit('page-change', p)"
        >
          {{ p }}
        </button>
        <button 
          class="w-8 h-8 rounded border border-border flex items-center justify-center disabled:opacity-50 hover:bg-surface text-text-secondary transition-colors"
          :disabled="page === totalPages"
          @click="$emit('page-change', page + 1)"
        >
          &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  perPage: { type: Number, default: 10 }
})

defineEmits(['page-change', 'row-click'])

const totalPages = computed(() => {
  return Math.ceil(props.total / props.perPage)
})
</script>
