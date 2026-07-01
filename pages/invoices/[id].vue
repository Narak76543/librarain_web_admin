<template>
  <div class="space-y-4">
    <!-- Back to Invoices -->
    <div>
      <NuxtLink to="/invoices" class="inline-flex items-center text-sm font-semibold text-text-secondary hover:text-primary transition group">
        <ArrowLeft :size="16" class="mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Invoices
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <RefreshCw class="animate-spin text-primary" :size="36" />
      <span class="text-sm font-semibold text-text-secondary font-sans">Loading invoice details...</span>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!invoice" class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-12 text-center">
      <h2 class="text-xl font-bold text-text-primary">Invoice not found</h2>
      <p class="text-sm text-text-secondary mt-2">The requested invoice does not exist or you do not have permission to view it.</p>
      <NuxtLink to="/invoices" class="mt-6 inline-flex h-9 px-4 bg-primary text-white rounded-lg items-center justify-center text-sm font-semibold hover:bg-emerald-600 transition">
        Return to List
      </NuxtLink>
    </div>

    <!-- Detail View -->
    <div v-else class="space-y-4">
      
      <!-- Top Invoice Action Bar -->
      <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-50 rounded-lg text-primary">
            <FileText :size="24" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-extrabold text-text-primary">{{ invoice.invoice_number }}</span>
              <InvoiceStatusBadge :status="invoice.status" />
            </div>
            <p class="text-xs text-text-secondary mt-1">Generated automatically on order status updates</p>
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2">
          <!-- Download PDF -->
          <button @click="handleDownload" 
            class="h-9 px-4 border border-gray-200 dark:border-gray-500/20 rounded-lg text-sm font-semibold text-text-secondary bg-card hover:bg-gray-50 active:scale-95 transition flex items-center gap-1.5">
            <Download :size="16" />
            Download PDF
          </button>
          
          <!-- Regenerate -->
          <button @click="handleRegenerate" :disabled="actionLoading"
            class="h-9 px-4 border border-gray-200 dark:border-gray-500/20 rounded-lg text-sm font-semibold text-text-secondary bg-card hover:bg-gray-50 disabled:opacity-50 active:scale-95 transition flex items-center gap-1.5">
            <RefreshCw :size="16" :class="{ 'animate-spin': actionLoading }" />
            Regenerate
          </button>

          <!-- Mark Paid -->
          <button v-if="invoice.status === 'issued'" @click="handleMarkPaid" :disabled="actionLoading"
            class="h-9 px-4 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 active:scale-95 transition flex items-center gap-1.5">
            <DollarSign :size="16" />
            Mark Paid
          </button>

          <!-- Cancel Invoice -->
          <button v-if="invoice.status === 'issued' || invoice.status === 'draft'" @click="handleCancel" :disabled="actionLoading"
            class="h-9 px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 disabled:opacity-50 active:scale-95 transition flex items-center gap-1.5">
            <XCircle :size="16" />
            Cancel Invoice
          </button>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <!-- Left 2 Columns: Client, Items & Details -->
        <div class="lg:col-span-2 space-y-4">
          
          <!-- Information Summary Cards -->
          <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 space-y-4">
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-gray-100 pb-3">Invoice Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Customer Info -->
              <div class="space-y-2">
                <span class="text-xs font-bold text-text-secondary uppercase">Customer Details</span>
                <p class="text-base font-bold text-text-primary">{{ invoice.customer_name }}</p>
                <div class="text-sm text-text-secondary space-y-1">
                  <p>Email: {{ customerEmail }}</p>
                  <p>Phone: {{ customerPhone }}</p>
                </div>
              </div>

              <!-- Shipping/Delivery Details -->
              <div class="space-y-2">
                <span class="text-xs font-bold text-text-secondary uppercase">Delivery & Logistics</span>
                <p class="text-sm font-semibold text-text-secondary">
                  Method: <span class="font-normal">{{ deliveryMethod }}</span>
                </p>
                <p class="text-sm font-semibold text-text-secondary">
                  Address: <span class="font-normal text-text-secondary">{{ deliveryAddress }}</span>
                </p>
              </div>

            </div>
          </div>

          <!-- Items Breakdowns -->
          <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 overflow-hidden">
            <div class="px-4 py-2.5 border-b border-gray-100">
              <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider">Itemized Breakdown</h3>
            </div>
            <InvoiceItemsTable :items="invoice.items" :isAdmin="true" />
          </div>

        </div>

        <!-- Right 1 Column: Totals & Dates Summary -->
        <div class="space-y-4">
          
          <!-- Financial totals -->
          <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 space-y-4">
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-gray-100 pb-3">Payment Summary</h3>
            
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Subtotal</span>
                <span class="font-semibold text-text-primary">${{ parseFloat(invoice.subtotal).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Tax</span>
                <span class="font-semibold text-text-primary">${{ parseFloat(invoice.tax_amount).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Discount</span>
                <span class="font-semibold text-text-primary">-${{ parseFloat(invoice.discount_amount).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Delivery Fee</span>
                <span class="font-semibold text-text-primary">${{ parseFloat(invoice.delivery_fee).toFixed(2) }}</span>
              </div>

              <div class="border-t border-gray-100 my-2 pt-3 flex justify-between items-center">
                <span class="text-base font-bold text-text-primary">Total</span>
                <span class="text-2xl font-extrabold text-primary">${{ parseFloat(invoice.total).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Schedule/Dates Info -->
          <div class="bg-card rounded border border-gray-200 dark:border-gray-500/20 p-4 space-y-4">
            <h3 class="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-gray-100 pb-3">Key Scheduling Dates</h3>
            
            <div class="space-y-3">
              <div class="flex flex-col">
                <span class="text-xs font-bold text-text-secondary uppercase">Issue Date</span>
                <span class="text-sm font-semibold text-text-primary mt-0.5">{{ formatDate(invoice.issued_at) }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-text-secondary uppercase">Due Date</span>
                <span class="text-sm font-semibold text-text-primary mt-0.5">{{ formatDate(invoice.due_date) }}</span>
              </div>
              <div v-if="invoice.paid_at" class="flex flex-col">
                <span class="text-xs font-bold text-text-secondary uppercase">Paid Date</span>
                <span class="text-sm font-semibold text-green-600 dark:text-green-400 mt-0.5">{{ formatDate(invoice.paid_at) }}</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, FileText, Download, RefreshCw, DollarSign, XCircle, ExternalLink } from 'lucide-vue-next'
import { useInvoices } from '~/composables/useInvoices'
import InvoiceStatusBadge from '~/components/invoices/InvoiceStatusBadge.vue'
import InvoiceItemsTable from '~/components/invoices/InvoiceItemsTable.vue'

const route = useRoute()
const invoiceId = route.params.id

const { getAdminInvoiceDetail, downloadPdf, regenerateInvoice, markInvoicePaid, cancelInvoice } = useInvoices()

const invoice = ref(null)
const loading = ref(true)
const actionLoading = ref(false)

const customerEmail = computed(() => invoice.value?.customer_email || '—')
const customerPhone = computed(() => invoice.value?.customer_phone || '—')
const deliveryMethod = computed(() => {
  if (!invoice.value) return '—'
  if (invoice.value.delivery_way === 'Delivery') {
    return `Delivery via ${invoice.value.delivery_partner || 'Standard'}`
  }
  return 'Pick Up'
})
const deliveryAddress = computed(() => invoice.value?.delivery_address || '—')

const loadInvoiceDetail = async () => {
  loading.value = true
  try {
    const res = await getAdminInvoiceDetail(invoiceId)
    if (res && res.ok && res.data) {
      invoice.value = res.data
    }
  } catch (error) {
    console.error('Error fetching invoice detail:', error)
  } finally {
    loading.value = false
  }
}

const handleDownload = async () => {
  if (!invoice.value) return
  try {
    await downloadPdf(invoice.value.id, invoice.value.invoice_number, true)
  } catch (err) {
    alert('Failed to download invoice PDF')
  }
}

const handleRegenerate = async () => {
  if (!invoice.value) return
  actionLoading.value = true
  try {
    const res = await regenerateInvoice(invoice.value.id)
    if (res && res.ok) {
      alert('Invoice PDF regenerated successfully.')
      invoice.value = res.data
    } else {
      alert(res.message || 'Failed to regenerate PDF')
    }
  } catch (err) {
    alert('An error occurred while regenerating invoice.')
  } finally {
    actionLoading.value = false
  }
}

const handleMarkPaid = async () => {
  if (!invoice.value) return
  if (!confirm(`Mark invoice ${invoice.value.invoice_number} as PAID?`)) return
  actionLoading.value = true
  try {
    const res = await markInvoicePaid(invoice.value.id)
    if (res && res.ok) {
      alert('Invoice marked as paid.')
      invoice.value = res.data
    } else {
      alert(res.message || 'Failed to update status.')
    }
  } catch (err) {
    alert('Error updating invoice status.')
  } finally {
    actionLoading.value = false
  }
}

const handleCancel = async () => {
  if (!invoice.value) return
  if (!confirm(`Are you sure you want to CANCEL invoice ${invoice.value.invoice_number}?`)) return
  actionLoading.value = true
  try {
    const res = await cancelInvoice(invoice.value.id)
    if (res && res.ok) {
      alert('Invoice cancelled successfully.')
      invoice.value = res.data
    } else {
      alert(res.message || 'Failed to cancel invoice.')
    }
  } catch (err) {
    alert('Error cancelling invoice.')
  } finally {
    actionLoading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await loadInvoiceDetail()
  // Hydrate additional labels
  if (invoice.value) {
    // If serialize_invoice is updated, we get it directly. Let's make sure we update serialize_invoice.
  }
})
</script>
