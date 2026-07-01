<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <!-- Left Column: Navigation -->
    <div class="lg:w-64 flex-shrink-0">
      <div class="card p-2 space-y-1">
        <button 
          v-for="section in sections" 
          :key="section.id"
          @click="activeSection = section.id"
          class="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-3"
          :class="activeSection === section.id ? 'bg-primary-light text-primary font-semibold' : 'text-text-secondary hover:bg-surface font-medium'"
        >
          <component :is="section.icon" class="w-4 h-4" />
          {{ section.name }}
        </button>
      </div>
    </div>
    
    <!-- Right Column: Forms -->
    <div class="flex-1">
      <!-- General Settings -->
      <div v-if="activeSection === 'general'" class="card">
        <h3 class="text-lg font-semibold text-text-primary mb-4">General Settings</h3>
        <form class="space-y-4" @submit.prevent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">App Name</label>
              <input type="text" class="w-full" value="Librarain" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Contact Email</label>
              <input type="email" class="w-full" value="contact@librarain.com" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-text-secondary mb-1">App Description</label>
              <textarea class="w-full h-24 py-2">The best place to buy and read books online.</textarea>
            </div>
          </div>
          <div class="border-t border-border pt-4 flex justify-end">
            <button class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
      
      <!-- Email/SMTP Settings -->
      <div v-if="activeSection === 'email'" class="card">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Email / SMTP Configuration</h3>
        <form class="space-y-4" @submit.prevent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-text-secondary mb-1">SMTP Server</label>
              <input type="text" class="w-full" value="smtp.gmail.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">SMTP Port</label>
              <input type="text" class="w-full" value="587" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">From Email</label>
              <input type="email" class="w-full" value="no-reply@librarain.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Username</label>
              <input type="text" class="w-full" value="admin@librarain.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <input type="password" class="w-full" value="••••••••••••" />
            </div>
          </div>
          <div class="border-t border-border pt-4 flex justify-between items-center">
            <button type="button" class="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface transition-colors">
              Send Test Email
            </button>
            <button class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
      
      <!-- Cloudinary Settings -->
      <div v-if="activeSection === 'cloudinary'" class="card">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Cloudinary Storage</h3>
        <form class="space-y-4" @submit.prevent>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Cloud Name</label>
              <input type="text" class="w-full" value="librarain-cloud" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">API Key</label>
              <input type="text" class="w-full" value="8493720498273" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">API Secret</label>
              <input type="password" class="w-full" value="••••••••••••••••" />
            </div>
          </div>
          <div class="border-t border-border pt-4 flex justify-between items-center">
            <button type="button" class="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface transition-colors">
              Test Connection
            </button>
            <button class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
      
      <!-- Security Settings -->
      <div v-if="activeSection === 'security'" class="card">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Security & Authentication</h3>
        <form class="space-y-4" @submit.prevent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Max Failed Login Attempts</label>
              <input type="number" class="w-full" value="5" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Lock Duration (Minutes)</label>
              <input type="number" class="w-full" value="30" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">JWT Token Expiry (Hours)</label>
              <input type="number" class="w-full" value="24" />
            </div>
            <div class="flex items-center gap-3 pt-6">
              <button 
                type="button"
                class="px-2.5 py-1 text-[11px] font-semibold rounded-full transition-colors border shadow-sm bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
              >
                Enabled
              </button>
              <span class="text-sm font-medium text-text-secondary">Enforce Single Session per User</span>
            </div>
          </div>
          <div class="border-t border-border pt-4 flex justify-end">
            <button class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Settings, Mail, Cloud, Shield } from 'lucide-vue-next'

const activeSection = ref('general')

const sections = [
  { id: 'general', name: 'General', icon: Settings },
  { id: 'email', name: 'Email / SMTP', icon: Mail },
  { id: 'cloudinary', name: 'Cloudinary', icon: Cloud },
  { id: 'security', name: 'Security', icon: Shield },
]
</script>
