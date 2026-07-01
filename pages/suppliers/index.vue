<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary">Suppliers</h1>
      <button @click="openModal()" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <Plus class="w-4 h-4" />
        New Supplier
      </button>
    </div>

    <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div v-if="pending" class="p-8 text-center text-text-secondary">
        <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
        Loading suppliers...
      </div>
      
      <table v-else-if="suppliers.length > 0" class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface border-b border-border text-text-secondary text-sm">
            <th class="px-4 py-2.5 font-semibold">Name</th>
            <th class="px-4 py-2.5 font-semibold">Contact</th>

            <th class="px-4 py-2.5 font-semibold">Phone</th>
            <th class="px-4 py-2.5 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="sup in suppliers" :key="sup.id" class="hover:bg-surface/50 transition-colors cursor-pointer text-sm" @click="openModal(sup)">
            <td class="px-4 py-2">
              <span class="font-medium text-text-primary">{{ sup.name }}</span>
            </td>
            <td class="px-4 py-2 text-text-secondary">{{ sup.contact_person || '-' }}</td>

            <td class="px-4 py-2 text-text-secondary">{{ sup.phone || '-' }}</td>
            <td class="px-4 py-2 text-right">
              <span :class="sup.is_active ? 'border border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400'" class="px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide">
                {{ sup.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="p-12 text-center text-text-secondary">
        <Tags class="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p class="text-lg font-medium text-text-primary mb-1">No suppliers found</p>
        <p>Add your first supplier to start creating purchase orders.</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div class="bg-card rounded-xl shadow-xl w-full max-w-lg border border-border flex flex-col max-h-[90vh]">
        <div class="p-4 border-b border-border flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-primary">
            {{ isEditing ? 'Edit Supplier' : 'New Supplier' }}
          </h3>
          <button @click="closeModal" class="text-text-secondary hover:text-text-primary">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Company Name <span class="text-error">*</span></label>
            <input v-model="form.name" type="text" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Contact Person</label>
            <input v-model="form.contact_person" type="text" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Phone</label>
              <input v-model="form.phone" type="text" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Address</label>
            <textarea v-model="form.address" rows="3" class="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"></textarea>
          </div>
          <div class="flex items-center gap-2 mt-4" v-if="isEditing">
            <input type="checkbox" id="isActive" v-model="form.is_active" class="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            <label for="isActive" class="text-sm font-medium text-text-primary">Active Supplier</label>
          </div>
        </div>
        
        <div class="p-4 border-t border-border flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-surface transition-colors">
            Cancel
          </button>
          <button @click="saveSupplier" :disabled="saving || !form.name" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ saving ? 'Saving...' : 'Save Supplier' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Tags, X, Loader2 } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'

const { get, post, put } = useApi()
const suppliers = ref([])
const pending = ref(true)
const saving = ref(false)

const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null,
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
  is_active: true
})

const fetchSuppliers = async () => {
  pending.value = true
  try {
    const res = await get('/api/v1/suppliers')
    if (res?.data?.suppliers) {
      suppliers.value = res.data.suppliers
    }
  } catch (error) {
    console.error("Error fetching suppliers:", error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchSuppliers()
})

const openModal = (supplier = null) => {
  if (supplier) {
    isEditing.value = true
    form.value = { ...supplier }
  } else {
    isEditing.value = false
    form.value = { id: null, name: '', contact_person: '', email: '', phone: '', address: '', is_active: true }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveSupplier = async () => {
  if (!form.value.name) return
  saving.value = true
  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value ? `/api/v1/suppliers/${form.value.id}` : '/api/v1/suppliers'
    
    const payload = {
      name: form.value.name,
      contact_person: form.value.contact_person,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      is_active: form.value.is_active
    }
    
    if (isEditing.value) {
      await put(url, payload)
    } else {
      await post(url, payload)
    }
    await fetchSuppliers()
    closeModal()
  } catch (error) {
    console.error("Error saving supplier:", error)
  } finally {
    saving.value = false
  }
}
</script>
