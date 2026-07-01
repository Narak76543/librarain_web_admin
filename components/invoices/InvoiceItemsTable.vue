<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr>
          <th class="th w-12 text-center">#</th>
          <th class="th">Book Title</th>
          <th class="th text-center">Qty</th>
          <th class="th text-right">Unit Price</th>
          <th class="th text-right">Total</th>
          <th v-if="isAdmin" class="th text-right text-green-600 dark:text-green-400">Profit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" :key="item.id"
          :class="i % 2 === 0 ? 'bg-card' : 'bg-gray-50/50 dark:bg-gray-500/10'"
          class="border-b border-border hover:bg-surface/50 transition">
          <td class="td text-center font-medium text-text-secondary">{{ i + 1 }}</td>
          <td class="td font-bold text-text-primary">{{ item.book_title }}</td>
          <td class="td text-center font-semibold text-text-secondary">{{ item.quantity }}</td>
          <td class="td text-right font-medium text-text-secondary">${{ item.unit_price }}</td>
          <td class="td text-right font-bold text-text-primary">${{ item.line_total }}</td>
          <td v-if="isAdmin" class="td text-right font-bold text-green-600 dark:text-green-400">${{ item.profit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  isAdmin: {
    type: Boolean,
    default: true
  }
})
</script>
