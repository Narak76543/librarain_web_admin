<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-text-primary tracking-tight">Invoice Management</h1>
        <p class="text-sm text-text-secondary mt-1">Monitor sales invoices, view itemized totals, track customer billing history, and manage payment states.</p>
      </div>
    </div>

    <!-- KPI Summary Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InvoiceSummaryCard
        label="Total Invoices"
        :value="stats.totalCount"
        sub="All issued invoices"
        :icon="FileText"
        iconBg="bg-blue-50 dark:bg-blue-500/10"
        iconColor="text-blue-600"
      />
      <InvoiceSummaryCard
        label="Paid Invoices"
        :value="`$${stats.paidAmount.toFixed(2)}`"
        :sub="`${stats.paidCount} fully paid`"
        :icon="CheckCircle"
        iconBg="bg-green-50 dark:bg-green-500/10"
        iconColor="text-green-600"
        valueColor="text-green-700 dark:text-green-400"
      />
      <InvoiceSummaryCard
        label="Unpaid Amount"
        :value="`$${stats.unpaidAmount.toFixed(2)}`"
        :sub="`${stats.unpaidCount} outstanding`"
        :icon="Clock"
        iconBg="bg-amber-50 dark:bg-amber-500/10"
        iconColor="text-amber-600"
        valueColor="text-amber-700 dark:text-amber-400"
      />
      <InvoiceSummaryCard
        label="Cancelled"
        :value="stats.cancelledCount"
        sub="Invoices voided"
        :icon="AlertTriangle"
        iconBg="bg-red-50 dark:bg-red-500/10"
        iconColor="text-red-600"
      />
    </div>

    <!-- Filters Panel -->
    <InvoiceFilters @filter="handleFilters" />

    <!-- Invoices List Table -->
    <div class="bg-card rounded-xl border border-gray-200 dark:border-gray-500/20 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw class="animate-spin text-primary" :size="32" />
        <span class="text-sm font-semibold text-text-secondary">Loading invoices...</span>
      </div>

      <div v-else-if="invoices.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <FileText class="text-gray-300" :size="48" />
        <p class="mt-4 text-base font-bold text-text-secondary">No invoices found</p>
        <p class="text-sm text-text-secondary mt-1">Try resetting or broadening your search criteria.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="th">Invoice Number</th>
              <th class="th">Customer</th>
              <th class="th">Issue Date</th>
              <th class="th text-right">Total Amount</th>
              <th class="th text-center">Status</th>
              <th class="th text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inv in invoices" :key="inv.id" class="border-b border-border hover:bg-surface/50 transition">
              <td class="td font-bold text-text-primary">{{ inv.invoice_number }}</td>
              <td class="td">
                <div class="font-semibold text-text-primary">{{ inv.customer_name }}</div>
                <div class="text-xs text-text-secondary mt-0.5" v-if="inv.user_id">{{ inv.notes ? inv.notes.split('#')[1] ? 'Order #' + inv.notes.split('#')[1] : '' : '' }}</div>
              </td>
              <td class="td text-text-secondary font-medium">{{ formatDate(inv.issued_at) }}</td>
              <td class="td text-right font-bold text-text-primary">${{ parseFloat(inv.total).toFixed(2) }}</td>
              <td class="td text-center">
                <InvoiceStatusBadge :status="inv.status" />
              </td>
              <td class="td text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <NuxtLink :to="`/invoices/${inv.id}`"
                    class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 dark:text-text-secondary hover:text-primary transition active:scale-95"
                    title="View Invoice Detail">
                    <Eye :size="16" />
                  </NuxtLink>
                  <button @click="handleDownload(inv)"
                    class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 dark:text-text-secondary hover:text-green-600 transition active:scale-95"
                    title="Download PDF">
                    <Download :size="16" />
                  </button>
                  <button v-if="inv.status === 'issued'" @click="handleMarkPaid(inv)"
                    class="p-1.5 hover:bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition active:scale-95"
                    title="Mark as Paid">
                    <DollarSign :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="invoices.length > 0" class="px-4 py-2.5 flex items-center justify-between border-t border-gray-100 bg-gray-50/50 dark:bg-gray-500/10">
        <span class="text-xs font-semibold text-text-secondary">
          Showing {{ offset + 1 }} to {{ Math.min(offset + limit, totalInvoices) }} of {{ totalInvoices }} invoices
        </span>
        <div class="flex items-center gap-1">
          <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
            class="h-8 w-8 flex items-center justify-center border border-gray-200 dark:border-gray-500/20 rounded-lg bg-card text-gray-600 dark:text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition">
            &lt;
          </button>
          <span class="px-3 text-xs font-bold text-text-secondary">Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
            class="h-8 w-8 flex items-center justify-center border border-gray-200 dark:border-gray-500/20 rounded-lg bg-card text-gray-600 dark:text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition">
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { FileText, CheckCircle, Clock, AlertTriangle, RefreshCw, Eye, Download, DollarSign } from 'lucide-vue-next'
import { useInvoices } from '~/composables/useInvoices'
import InvoiceSummaryCard from '~/components/invoices/InvoiceSummaryCard.vue'
import InvoiceFilters from '~/components/invoices/InvoiceFilters.vue'
import InvoiceStatusBadge from '~/components/invoices/InvoiceStatusBadge.vue'

const { getAdminInvoices, downloadPdf, markInvoicePaid } = useInvoices()

const invoices = ref([])
const totalInvoices = ref(0)
const limit = ref(10)
const offset = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const filterParams = ref({})

// We will calculate stats from a fetch of all invoices, or we can fetch a larger sample to calculate summary stats.
// Let's create a separate reactive stats ref.
const stats = ref({
  totalCount: 0,
  paidCount: 0,
  paidAmount: 0,
  unpaidCount: 0,
  unpaidAmount: 0,
  cancelledCount: 0
})

const totalPages = computed(() => Math.ceil(totalInvoices.value / limit.value) || 1)

const fetchInvoices = async () => {
  loading.value = true
  try {
    const res = await getAdminInvoices({
      page: currentPage.value,
      limit: limit.value,
      ...filterParams.value
    })
    if (res && res.data) {
      invoices.value = res.data.invoices || []
      totalInvoices.value = res.data.total || 0
    }
  } catch (error) {
    console.error('Error fetching invoices:', error)
  } finally {
    loading.value = false
  }
}

// Fetch all/larger sample to build local dashboard statistics
const fetchStats = async () => {
  try {
    const res = await getAdminInvoices({ page: 1, limit: 100 })
    if (res && res.data && res.data.invoices) {
      const all = res.data.invoices
      const totalCount = res.data.total || all.length
      const paid = all.filter(i => i.status === 'paid')
      const unpaid = all.filter(i => i.status === 'issued' || i.status === 'draft')
      const cancelled = all.filter(i => i.status === 'cancelled')

      stats.value = {
        totalCount,
        paidCount: paid.length,
        paidAmount: paid.reduce((sum, item) => sum + parseFloat(item.total), 0),
        unpaidCount: unpaid.length,
        unpaidAmount: unpaid.reduce((sum, item) => sum + parseFloat(item.total), 0),
        cancelledCount: cancelled.length
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const handleFilters = (newFilters) => {
  filterParams.value = newFilters
  currentPage.value = 1
  offset.value = 0
  fetchInvoices()
}

const changePage = (page) => {
  currentPage.value = page
  offset.value = (page - 1) * limit.value
  fetchInvoices()
}

const handleDownload = async (inv) => {
  try {
    await downloadPdf(inv.id, inv.invoice_number, true)
  } catch (error) {
    alert('Failed to download invoice PDF')
  }
}

const handleMarkPaid = async (inv) => {
  if (!confirm(`Are you sure you want to mark invoice ${inv.invoice_number} as PAID?`)) return
  try {
    const res = await markInvoicePaid(inv.id)
    if (res && res.ok) {
      alert('Invoice marked as paid successfully.')
      fetchInvoices()
      fetchStats()
    } else {
      alert(res.message || 'Failed to update invoice.')
    }
  } catch (error) {
    alert('An error occurred while marking invoice as paid.')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchInvoices()
  fetchStats()
})
</script>
