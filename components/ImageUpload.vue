<template>
  <div 
    class="h-[200px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
    :class="{ 'border-primary bg-primary-light': isDragging, 'bg-surface hover:bg-gray-100': !isDragging && !previewUrl }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="$refs.fileInput.click()"
  >
    <input 
      type="file" 
      ref="fileInput" 
      class="hidden" 
      accept="image/*"
      @change="handleFileSelect"
    />
    
    <template v-if="previewUrl || initialUrl">
      <img :src="previewUrl || initialUrl" class="w-full h-full object-contain" alt="Preview" />
      <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <span class="text-white font-medium text-sm">Change Image</span>
      </div>
    </template>
    
    <template v-else>
      <BookImage class="w-10 h-10 text-text-secondary mb-3" />
      <p class="text-sm font-medium text-text-primary">Click or drag to upload</p>
      <p class="text-xs text-text-secondary mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BookImage } from 'lucide-vue-next'

const props = defineProps({
  initialUrl: { type: String, default: null }
})

const emit = defineEmits(['file-selected'])
const fileInput = ref(null)
const isDragging = ref(false)
const previewUrl = ref(null)

const processFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file)
    emit('file-selected', file)
  }
  isDragging.value = false
}

const handleDrop = (e) => {
  processFile(e.dataTransfer.files[0])
}

const handleFileSelect = (e) => {
  processFile(e.target.files[0])
}
</script>
