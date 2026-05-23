<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="relative">
        <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search categories..."
          class="pl-9 w-64 bg-white"
        />
      </div>
      
      <button @click="openModal()" class="btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Add Category
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="isLoading" v-for="index in 6" :key="`category-skeleton-${index}`" class="card">
        <div class="h-5 w-32 bg-gray-100 rounded animate-pulse mb-3"></div>
        <div class="h-4 w-20 bg-gray-100 rounded animate-pulse mb-12"></div>
        <div class="h-px bg-border mb-4"></div>
        <div class="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
      </div>

      <div
        v-else
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="card flex flex-col hover:border-primary transition-colors"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-text-primary">{{ cat.name }}</h3>
            <p class="text-sm text-text-secondary mt-1">/{{ cat.slug }}</p>
          </div>
          <StatusBadge :status="cat.is_active" />
        </div>
        
        <div class="flex-1"></div>
        
        <div class="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <span class="px-2.5 py-1 bg-primary-light text-primary rounded-full text-xs font-semibold">
            {{ cat.books_count || 0 }} Books
          </span>
          <div class="flex items-center gap-2">
            <button @click="openModal(cat)" class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-info transition-colors">
              <Edit2 class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(cat)" class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-error transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && filteredCategories.length === 0" class="card text-center py-12 text-text-secondary">
      No categories found
    </div>
    
    <!-- Category Form Modal -->
    <div v-if="showFormModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="card w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-text-primary">{{ isEditing ? 'Edit Category' : 'Add Category' }}</h3>
          <button @click="showFormModal = false" class="text-text-secondary hover:text-text-primary">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Name</label>
            <input type="text" v-model="form.name" class="w-full" required placeholder="e.g. Science Fiction" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Slug</label>
            <input type="text" v-model="form.slug" class="w-full" required placeholder="e.g. science-fiction" />
          </div>
          
          <div class="flex items-center justify-between pt-2">
            <span class="text-sm font-medium text-text-secondary">Status</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" v-model="form.is_active">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <button type="button" @click="showFormModal = false" class="h-10 px-4 rounded-lg font-medium text-sm text-text-primary hover:bg-surface transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Save Changes' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Modal -->
    <ConfirmModal 
      v-if="showDeleteModal"
      title="Delete Category"
      :message="`Are you sure you want to delete '${catToDelete?.name}'? This will also affect ${catToDelete?.books_count || 0} books.`"
      confirmLabel="Delete"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-vue-next'

const categories = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const catToDelete = ref(null)

const form = reactive({
  id: '',
  name: '',
  slug: '',
  is_active: true
})

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return categories.value

  return categories.value.filter((category) => {
    return [category.name, category.slug]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query))
  })
})

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const { getCategories } = useCategories()
    const res = await getCategories()
    if (res?.ok) {
      categories.value = (res.data || []).map((category) => ({
        ...category,
        books_count: category.books_count || category.books || 0,
      }))
    } else {
      handleApiError(res)
    }
  } catch (err) {
    handleApiError(err.data || err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCategories)

const openModal = (cat = null) => {
  if (cat) {
    isEditing.value = true
    form.id = cat.id
    form.name = cat.name
    form.slug = cat.slug
    form.is_active = cat.is_active
  } else {
    isEditing.value = false
    form.id = ''
    form.name = ''
    form.slug = ''
    form.is_active = true
  }
  showFormModal.value = true
}

const handleSave = async () => {
  try {
    const { createCategory, updateCategory } = useCategories()
    const payload = {
      name: form.name,
      slug: form.slug,
    }

    if (isEditing.value) {
      await updateCategory(form.id, {
        ...payload,
        is_active: form.is_active,
      })
    } else {
      await createCategory(payload)
    }

    showFormModal.value = false
    await fetchCategories()
  } catch (err) {
    handleApiError(err.data || err)
  }
}

const confirmDelete = (cat) => {
  catToDelete.value = cat
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!catToDelete.value) return

  try {
    const { deleteCategory } = useCategories()
    await deleteCategory(catToDelete.value.id)
    showDeleteModal.value = false
    catToDelete.value = null
    await fetchCategories()
  } catch (err) {
    handleApiError(err.data || err)
  }
}

const handleApiError = (err) => {
  console.error('Category API Error:', err)
  if (err?.status === 401) {
    navigateTo('/login')
  } else if (err?.status === 403) {
    alert('Admin access required')
  } else {
    alert(err?.message || 'Cannot connect to server. Check your connection.')
  }
}
</script>
