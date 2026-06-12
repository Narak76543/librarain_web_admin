<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-surface">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="~/assets/images/login_bg.png" alt="Background" class="w-full h-full object-cover opacity-70" />
      <div class="absolute inset-0 bg-surface/30 backdrop-blur-[2px]"></div>
    </div>
    
    <!-- Login Card -->
    <div class="bg-card/90 backdrop-blur-xl rounded-2xl border border-white/40 p-10 w-full max-w-md shadow-2xl relative z-10">
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center">
          <img src="~/assets/images/icon.png" class="w-10 h-10 mr-2 object-contain" alt="Logo" />
          <h1 class="text-2xl font-bold text-primary">Librarain</h1>
          <span class="text-[12px] text-text-secondary ml-1 mt-1">Admin</span>
        </div>
      </div>
      
      <div class="mb-6">
        <h2 class="text-[22px] font-bold text-[#1C1C1E] mb-1">Welcome back</h2>
        <p class="text-sm text-text-secondary">Sign in to your admin account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-[13px] font-medium text-text-secondary mb-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@librarain.com" 
            class="w-full h-10 border border-border rounded-lg px-3 focus:border-primary focus:outline-none focus:ring-0" 
            required 
          />
        </div>
        
        <div class="relative">
          <label class="block text-[13px] font-medium text-text-secondary mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full h-10 border border-border rounded-lg pl-3 pr-10 focus:border-primary focus:outline-none focus:ring-0" 
              required 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <Eye v-if="showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- Error States -->
        <div v-if="errorMessage" class="pt-2">
          <!-- 401 -->
          <div v-if="errorType === 'invalid'" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {{ errorMessage }}
            <span v-if="remainingAttempts" class="text-gray-500 text-xs block mt-1">
              {{ remainingAttempts }} attempts remaining before lockout
            </span>
          </div>
          
          <!-- 423 -->
          <div v-else-if="errorType === 'locked'" class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700 text-sm">
            Account locked. Try again after {{ lockedUntil }}
          </div>
          
          <!-- Network Error -->
          <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 text-sm">
            {{ errorMessage }}
          </div>
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full h-11 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center transition-colors"
        >
          <span v-if="isLoading">
            <Loader2 class="animate-spin h-4 w-4 mr-2 inline" /> Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>
      
      <div class="mt-8 text-center flex flex-col items-center">
        <p class="text-[12px] text-text-secondary">Librarain Admin Panel</p>
        <p class="text-[11px] text-text-secondary mt-0.5">© 2026 All rights reserved</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Book, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const remainingAttempts = ref(null)
const lockedUntil = ref(null)
const errorType = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  errorType.value = ''

  try {
    const { login } = useAuth()
    const res = await login(email.value, password.value)

    if (res && res.ok) {
      navigateTo('/')
    } else {
      errorType.value = 'invalid'
      errorMessage.value = res?.message ?? 'Invalid email or password'
    }
  } catch (err) {
    if (err.data?.status === 423) {
      errorType.value = 'locked'
      const time = err.data.data?.lockedUntil
      lockedUntil.value = time ? new Date(time).toLocaleTimeString() : 'a while'
      errorMessage.value = 'Account locked.'
    } else if (err.data?.status === 401) {
      errorType.value = 'invalid'
      errorMessage.value = 'Invalid email or password'
      remainingAttempts.value = err.data?.data?.remainingAttempts ?? null
    } else {
      errorType.value = 'network'
      errorMessage.value = 'Cannot connect to server. Check your connection.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
