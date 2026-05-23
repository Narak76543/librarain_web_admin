<template>
  <div class="w-full border border-border rounded-xl overflow-hidden bg-white">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border">
          <tr>
            <th v-for="col in columns" :key="col.key" class="px-6 py-3" :class="col.class">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr 
            v-for="(row, idx) in rows" 
            :key="idx" 
            class="hover:bg-surface/50 transition-colors cursor-pointer group"
            :class="{'bg-surface/20': idx % 2 === 1}"
            @click="$emit('row-click', row)"
          >
            <td v-for="col in columns" :key="col.key" class="px-6 py-4" :class="col.class">
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
    <div v-if="total > 0" class="flex items-center justify-between px-6 py-4 border-t border-border bg-white">
      <p class="text-sm text-text-secondary">
        Showing <span class="font-semibold text-text-primary">{{ (page - 1) * perPage + 1 }}</span>
        to <span class="font-semibold text-text-primary">{{ Math.min(page * perPage, total) }}</span>
        of <span class="font-semibold text-text-primary">{{ total }}</span> results
      </p>
      
      <div class="flex gap-1">
        <button 
          class="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page === 1"
          @click="$emit('page-change', page - 1)"
        >
          &lt;
        </button>
        <button 
          v-for="p in totalPages" 
          :key="p"
          class="w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors"
          :class="p === page ? 'bg-primary text-white border border-primary' : 'border border-border text-text-secondary hover:bg-surface'"
          @click="$emit('page-change', p)"
        >
          {{ p }}
        </button>
        <button 
          class="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page === totalPages"
          @click="$emit('page-change', page + 1)"
        >
          &gt;
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
