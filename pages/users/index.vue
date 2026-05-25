<template>
  <div class="space-y-6 relative h-full">
    <!-- Header & Filters -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 class="text-xl font-semibold text-text-primary">User Management</h2>
      <div class="flex items-center gap-4">
        <div class="relative">
          <Search class="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search users..." 
            class="pl-9 w-64 bg-white" 
          />
        </div>
        <select v-model="roleFilter" class="bg-white min-w-[120px]">
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
        <select v-model="statusFilter" class="bg-white min-w-[120px]">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="locked">Lock Attempt: True</option>
          <option value="unlocked">Lock Attempt: False</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card !p-0 overflow-hidden">
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border">
            <tr>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Phone</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Joined</th>
              <th class="px-6 py-3">Lock Attempt</th>
              <th class="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <!-- Loading Skeleton -->
            <tr v-if="isLoading" v-for="i in 5" :key="`skeleton-${i}`">
              <td colspan="7">
                <div class="h-4 bg-gray-100 rounded animate-pulse mx-4 my-3"></div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-else-if="users.length === 0">
              <td colspan="7" class="text-center py-16 text-gray-400">
                No users found
              </td>
            </tr>

            <!-- Real Data -->
            <tr 
              v-else 
              v-for="(user, idx) in users" 
              :key="user.id" 
              @click="openPanel(user)"
              class="hover:bg-surface/50 transition-colors group cursor-pointer"
              :class="{'bg-surface/20': idx % 2 === 1}"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="user.profile?.avatar_url"
                    :src="user.profile.avatar_url"
                    :alt="user.full_name || 'User avatar'"
                    class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border"
                  />
                  <div
                    v-else
                    class="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0"
                  >
                    {{ getUserInitials(user) }}
                  </div>
                  <div>
                    <span class="font-semibold text-text-primary block">{{ user.full_name }}</span>
                    <span v-if="getProfileSubtitle(user)" class="text-[11px] text-text-secondary block">
                      {{ getProfileSubtitle(user) }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">{{ user.phone || '—' }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-semibold" :class="user.roles?.[0] === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-surface text-text-secondary'">
                  {{ user.roles?.[0] || 'USER' }}
                </span>
              </td>
              <td class="px-6 py-4 text-text-secondary">
                {{ user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}
              </td>
              <td class="px-6 py-4" @click.stop>
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-1 rounded text-xs font-semibold"
                    :class="isLockedUser(user) ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-text-secondary'"
                  >
                    {{ isLockedUser(user) ? 'True' : 'False' }}
                  </span>
                  <button
                    v-if="isLockedUser(user)"
                    @click="handleResetAttempt(user)"
                    class="px-2.5 py-1 rounded border border-amber-200 text-amber-600 hover:bg-amber-50 text-xs font-medium transition-colors"
                    title="Reset Login Attempts"
                  >
                    Reset
                  </button>
                </div>
              </td>
              <td class="px-6 py-4" @click.stop>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleStatus(user)"
                    class="px-2 py-1 rounded text-xs font-semibold transition-colors"
                    :class="user.is_active ? 'bg-primary-light text-primary hover:bg-primary-light/80' : 'bg-red-100 text-error hover:bg-red-200'"
                  >
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="total > 0" class="px-6 py-4 border-t border-border bg-white flex justify-between items-center text-sm">
        <p class="text-text-secondary">Showing <span class="font-semibold text-text-primary">{{ (currentPage - 1) * perPage + 1 }}</span> to <span class="font-semibold text-text-primary">{{ Math.min(currentPage * perPage, total) }}</span> of <span class="font-semibold text-text-primary">{{ total }}</span> results</p>
        <div class="flex gap-1">
          <button @click="currentPage--" :disabled="currentPage === 1" class="w-8 h-8 rounded border border-border flex items-center justify-center disabled:opacity-50 hover:bg-surface">&lt;</button>
          <button class="w-8 h-8 rounded bg-primary text-white font-medium">{{ currentPage }}</button>
          <button @click="currentPage++" :disabled="currentPage * perPage >= total" class="w-8 h-8 rounded border border-border flex items-center justify-center disabled:opacity-50 hover:bg-surface">&gt;</button>
        </div>
      </div>
    </div>
    
    <!-- Slide-in Profile Panel -->
    <div v-if="isPanelOpen" class="fixed inset-0 bg-black/20 z-40" @click="isPanelOpen = false"></div>
    <div 
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto"
      :class="isPanelOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-8">
          <h3 class="text-lg font-semibold text-text-primary">User Profile</h3>
          <button @click="isPanelOpen = false" class="text-text-secondary hover:text-text-primary">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div v-if="isLoadingDetail" class="flex justify-center py-20">
          <Loader2 class="animate-spin h-8 w-8 text-primary"/>
        </div>
        
        <div v-else-if="selectedUser" class="space-y-6">
          <div class="flex flex-col items-center mb-6">
            <img v-if="selectedUser.profile?.avatar_url" :src="selectedUser.profile.avatar_url" class="w-24 h-24 rounded-full object-cover mb-3 shadow-sm border border-border" />
            <div v-else class="w-24 h-24 rounded-full bg-primary-light text-primary flex items-center justify-center text-3xl font-semibold mb-3">
              {{ selectedUser.full_name ? selectedUser.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?' }}
            </div>
            
            <h4 class="text-xl font-semibold text-text-primary flex items-center gap-2">
              {{ selectedUser.full_name }}
              <CheckCircle2 v-if="selectedUser.is_verified" class="w-4 h-4 text-primary" title="Verified" />
              <XCircle v-else class="w-4 h-4 text-error" title="Not Verified" />
            </h4>
            
            <div class="flex gap-2 mt-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold" :class="selectedUser.roles?.[0] === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-surface text-text-secondary'">
                {{ selectedUser.roles?.[0] || 'USER' }}
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold" :class="selectedUser.is_active ? 'bg-primary-light text-primary' : 'bg-red-100 text-error'">
                {{ selectedUser.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          
          <!-- Personal Info -->
          <div>
            <h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Personal Info</h5>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-text-secondary">First Name (EN)</span>
                <span class="font-medium text-text-primary">{{ selectedUser.profile?.first_name || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">Last Name (EN)</span>
                <span class="font-medium text-text-primary">{{ selectedUser.profile?.last_name || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">ឈ្មោះខ្មែរ (First Local)</span>
                <span class="font-medium text-text-primary">{{ selectedUser.profile?.first_name_local || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">នាមខ្មែរ (Last Local)</span>
                <span class="font-medium text-text-primary">{{ selectedUser.profile?.last_name_local || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Contact Details</h5>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <Mail class="w-4 h-4 text-text-secondary" />
                <span class="text-text-primary">{{ selectedUser.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <Phone class="w-4 h-4 text-text-secondary" />
                <span class="text-text-primary">{{ selectedUser.phone || '—' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <MessageCircle class="w-4 h-4 text-text-secondary" />
                <span class="text-text-primary">{{ selectedUser.profile?.telegram ? `@${selectedUser.profile.telegram}` : '—' }}</span>
              </div>
              <div class="flex items-start gap-3 text-sm">
                <MapPin class="w-4 h-4 text-text-secondary mt-0.5" />
                <span class="text-text-primary">{{ selectedUser.profile?.address || '—' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Security & Activity -->
          <div>
            <h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Security & Activity</h5>
            <div class="bg-surface rounded-lg p-4 space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-text-secondary">Failed Attempts</span>
                <span class="font-medium" :class="{'text-error': selectedUser.failed_login_attempts > 0}">{{ selectedUser.failed_login_attempts }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-secondary">Locked Until</span>
                <span class="font-medium" :class="{'text-amber-600': selectedUser.locked_until}">
                  {{ selectedUser.locked_until ? new Date(selectedUser.locked_until).toLocaleString() : '—' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text-secondary">Last Login</span>
                <span class="font-medium">{{ selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString() : '—' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Active Sessions -->
          <div v-if="selectedUser.sessions?.length > 0">
            <h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider flex justify-between">
              Active Sessions
              <button @click="handleForceLogout(selectedUser)" class="text-error hover:underline normal-case text-[11px]">Force Logout All</button>
            </h5>
            <div class="space-y-2">
              <div v-for="sess in selectedUser.sessions" :key="sess.id" class="text-xs bg-white border border-border p-3 rounded-lg">
                <p class="font-semibold mb-1">{{ sess.device_name }}</p>
                <p class="text-text-secondary truncate">{{ sess.user_agent }}</p>
                <div class="flex justify-between mt-2 text-text-secondary">
                  <span>IP: {{ sess.ip_address }}</span>
                  <span>Exp: {{ new Date(sess.expires_at).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Login Logs -->
          <div v-if="selectedUser.login_logs?.length > 0">
            <h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Recent Logins</h5>
            <div class="space-y-2">
              <div v-for="log in selectedUser.login_logs" :key="log.created_at" class="text-xs flex justify-between border-b border-border pb-2 last:border-0">
                <div>
                  <p class="font-medium" :class="log.login_status === 'SUCCESS' ? 'text-primary' : 'text-error'">
                    {{ log.login_status }}
                  </p>
                  <p class="text-text-secondary">{{ log.ip_address }}</p>
                </div>
                <div class="text-right">
                  <p class="text-text-secondary">{{ new Date(log.created_at).toLocaleString() }}</p>
                  <p v-if="log.failure_reason" class="text-error mt-0.5">{{ log.failure_reason }}</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Search, X, Mail, Phone, MessageCircle, MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'

const users = ref([])
const total = ref(0)
const isLoading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const perPage = 10

// Slide panel
const selectedUser = ref(null)
const isPanelOpen = ref(false)
const isLoadingDetail = ref(false)

// Debounce helper
let searchTimeout = null
const debouncedFetch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 400)
}

onMounted(() => fetchUsers())

watch([searchQuery, roleFilter, statusFilter], () => {
  debouncedFetch()
})

watch(currentPage, () => {
  fetchUsers()
})

// const normalizeAdminUser = (record) => {
//   if (!record?.basic_info && !record?.account_status) return record

//   const basic = record.basic_info || {}
//   const status = record.account_status || {}

//   return {
//     id: basic.id || record.user?.id,
//     full_name: basic.full_name || record.user?.full_name,
//     email: basic.email || record.user?.email,
//     phone: basic.phone || record.profile?.phone || record.user?.phone,
//     is_active: basic.is_active ?? record.user?.is_active,
//     is_verified: basic.is_verified ?? record.user?.is_verified,
//     roles: basic.roles || record.user?.roles || [],
//     created_at: status.created_at,
//     updated_at: status.updated_at,
//     failed_login_attempts: status.failed_login_attempts || 0,
//     locked_until: status.locked_until,
//     locked_at: status.locked_at,
//     locked_reason: status.locked_reason,
//     last_login_at: status.last_login_at,
//     password_changed_at: status.password_changed_at,
//     profile: record.profile || {
//       first_name: basic.first_name,
//       last_name: basic.last_name,
//       first_name_local: basic.first_name_local,
//       last_name_local: basic.last_name_local,
//       phone: basic.phone,
//       telegram: basic.telegram,
//       address: basic.address,
//       avatar_url: basic.avatar_url,
//     },
//     login_logs: record.login_activity || [],
//     password_recovery: record.password_recovery,
//     sessions: record.sessions || [],
//     raw: record,
//   }
// }
// const normalizeAdminUser = (record) => {
//   if (!record?.basic_info && !record?.account_status) return record

//   const basic = record.basic_info || {}
//   const status = record.account_status || {}

//   return {
//     id: basic.id || record.user?.id,
//     full_name: basic.full_name || record.user?.full_name,
//     email: basic.email || record.user?.email,
//     phone: basic.phone || record.profile?.phone || record.user?.phone,
//     is_active: basic.is_active ?? record.user?.is_active,
//     is_verified: basic.is_verified ?? record.user?.is_verified,
//     roles: basic.roles || record.user?.roles || [],
//     created_at: status.created_at,
//     updated_at: status.updated_at,
    
//     // ⬇️ FIX THE KEY ALIASES HERE TO CATCH FASTAPI'S RESPONSES
//     failed_login_attempts: status.failed_login_attempts ?? status.failedLoginAttempts ?? 0,
//     locked_until: status.locked_until || status.lockedUntil || record.data?.lockedUntil || null,
//     locked_at: status.locked_at || status.lockedAt || null,
//     locked_reason: status.locked_reason || status.lockedReason || null,
    
//     last_login_at: status.last_login_at || status.lastLoginAt,
//     password_changed_at: status.password_changed_at || status.passwordChangedAt,
//     profile: record.profile || {
//       first_name: basic.first_name,
//       last_name: basic.last_name,
//       first_name_local: basic.first_name_local,
//       last_name_local: basic.last_name_local,
//       phone: basic.phone,
//       telegram: basic.telegram,
//       address: basic.address,
//       avatar_url: basic.avatar_url,
//     },
//     login_logs: record.login_activity || [],
//     password_recovery: record.password_recovery,
//     sessions: record.sessions || [],
//     raw: record,
//   }
// }

const normalizeAdminUser = (record) => {
  if (!record) return record

  const basic = record.basic_info || {}
  const status = record.account_status || {}

  return {
    id: basic.id || record.id || record.user?.id,
    full_name: basic.full_name || record.full_name || record.user?.full_name,
    email: basic.email || record.email || record.user?.email,
    phone: basic.phone || record.phone || record.profile?.phone || record.user?.phone,
    is_active: basic.is_active ?? record.is_active ?? record.user?.is_active,
    is_verified: basic.is_verified ?? record.is_verified ?? record.user?.is_verified,
    roles: basic.roles || record.roles || record.user?.roles || [],
    created_at: status.created_at || record.created_at,
    updated_at: status.updated_at || record.updated_at,
    
    // Fallback checks from root properties down to nested structures
    failed_login_attempts: record.failed_login_attempts ?? record.failedLoginAttempts ?? status.failed_login_attempts ?? status.failedLoginAttempts ?? 0,
    locked_until: record.locked_until || record.lockedUntil || status.locked_until || status.lockedUntil || null,
    locked_at: record.locked_at || record.lockedAt || status.locked_at || status.lockedAt || null,
    locked_reason: record.locked_reason || record.lockedReason || status.locked_reason || status.lockedReason || null,
    
    // Add boolean properties for lock status that might be sent by backend
    is_locked: record.is_locked ?? record.lock_attempt ?? false,
    lock_attempt: record.lock_attempt ?? record.is_locked ?? false,
    
    last_login_at: record.last_login_at || record.lastLoginAt || status.last_login_at || status.lastLoginAt,
    password_changed_at: record.password_changed_at || record.passwordChangedAt || status.password_changed_at || status.passwordChangedAt,
    profile: record.profile || {
      first_name: basic.first_name || record.first_name,
      last_name: basic.last_name || record.last_name,
      first_name_local: basic.first_name_local || record.first_name_local,
      last_name_local: basic.last_name_local || record.last_name_local,
      phone: basic.phone || record.phone,
      telegram: basic.telegram || record.telegram,
      address: basic.address || record.address,
      avatar_url: basic.avatar_url || record.avatar_url,
    },
    login_logs: record.login_activity || record.login_logs || [],
    password_recovery: record.password_recovery,
    sessions: record.sessions || [],
    raw: record,
  }
}

const isLockedUser = (user) => {
  if (!user) return false
  
  // 1. Check direct boolean flags
  if (user.is_locked === true || user.lock_attempt === true || user.raw?.is_locked === true || user.raw?.lock_attempt === true) {
    return true
  }
  
  // 2. Check for any variation of locked_until timestamps
  const lockedUntilVal = user.locked_until || 
                         user.lockedUntil || 
                         user.account_status?.locked_until || 
                         user.account_status?.lockedUntil ||
                         user.raw?.account_status?.lockedUntil
                         
  if (lockedUntilVal) {
    const lockDate = new Date(lockedUntilVal)
    // If the lock time is in the future, the user is definitely locked
    if (lockDate > new Date()) return true
  }

  // 3. Fallback check for active failed login attempt counters
  const failedAttempts = user.failed_login_attempts ?? 
                         user.failedLoginAttempts ?? 
                         user.account_status?.failed_login_attempts ?? 
                         user.account_status?.failedLoginAttempts ?? 
                         user.raw?.failed_login_attempts ??
                         0

  return failedAttempts > 0
}

const getUserInitials = (user) => {
  const name = user?.full_name || user?.email || ''
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return initials || '?'
}

const getProfileSubtitle = (user) => {
  const profile = user?.profile
  if (!profile) return ''

  const localName = [profile.last_name_local, profile.first_name_local]
    .filter(Boolean)
    .join(' ')
    .trim()
  if (localName) return localName

  const englishName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  return englishName
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const { getUsers } = useAdminUsers()
    const res = await getUsers({
      search: searchQuery.value,
      role: roleFilter.value,
      status: statusFilter.value,
      limit: perPage,
      offset: (currentPage.value - 1) * perPage,
    })
    
    if (res && res.ok) {
      // Handles both dynamic paginated backend structures or raw arrays safely
      const rawUsers = Array.isArray(res.data) ? res.data : (res.data?.users || [])
      
      let filteredUsers = rawUsers
      
      // Local Search Filter
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filteredUsers = filteredUsers.filter(u => 
          (u.full_name && u.full_name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
        )
      }
      
      // Local Role Filter
      if (roleFilter.value) {
        filteredUsers = filteredUsers.filter(u => {
          const norm = normalizeAdminUser(u)
          return norm.roles?.includes(roleFilter.value)
        })
      }
      
      // Local Status Filter
      if (statusFilter.value) {
        filteredUsers = filteredUsers.filter(u => {
          const norm = normalizeAdminUser(u)
          if (statusFilter.value === 'active') return norm.is_active
          if (statusFilter.value === 'inactive') return !norm.is_active
          if (statusFilter.value === 'locked') return isLockedUser(norm)
          if (statusFilter.value === 'unlocked') return !isLockedUser(norm)
          return true
        })
      }
      
      total.value = filteredUsers.length
      
      // Local Pagination
      const startIndex = (currentPage.value - 1) * perPage
      const endIndex = startIndex + perPage
      
      users.value = filteredUsers.slice(startIndex, endIndex).map(normalizeAdminUser)
    } else {
      if (res?.status === 401 || res?.status === 403) {
        handleApiError(res)
      }
    }
  } catch (err) {
    handleApiError(err?.data || err)
  } finally {
    isLoading.value = false
  }
}

const openPanel = async (user) => {
  isPanelOpen.value = true
  isLoadingDetail.value = true
  selectedUser.value = user // temporary optimistic display

  try {
    const { getUserDetail } = useAdminUsers()
    const res = await getUserDetail(user.id)
    if (res && res.ok) {
      // If endpoint returns a detailed nested single entity directly
      selectedUser.value = normalizeAdminUser(res.data)
    } else {
      handleApiError(res)
    }
  } catch (err) {
    handleApiError(err?.data || err)
  } finally {
    isLoadingDetail.value = false
  }
}

const toggleStatus = async (user) => {
  try {
    const { updateUserStatus } = useAdminUsers()
    const newStatus = !user.is_active
    const res = await updateUserStatus(user.id, newStatus)
    
    if (res && res.ok) {
      user.is_active = newStatus
      const idx = users.value.findIndex(u => u.id === user.id)
      if (idx !== -1) users.value[idx].is_active = newStatus
      
      if (selectedUser.value?.id === user.id) {
        selectedUser.value.is_active = newStatus
      }
    } else {
      handleApiError(res)
    }
  } catch (err) {
    handleApiError(err?.data || err)
  }
}

const handleResetAttempt = async (user) => {
  try {
    const { resetLoginAttempt } = useAdminUsers()
    const res = await resetLoginAttempt(user.id)
    if (res && res.ok) {
      const updatedUser = normalizeAdminUser(res.data)
      user.failed_login_attempts = updatedUser.failed_login_attempts || 0
      user.locked_until = updatedUser.locked_until
      user.locked_at = updatedUser.locked_at
      user.locked_reason = updatedUser.locked_reason
      user.is_locked = updatedUser.is_locked || false
      user.lock_attempt = updatedUser.lock_attempt || false
      
      const idx = users.value.findIndex(u => u.id === user.id)
      if (idx !== -1) {
        users.value[idx] = { ...users.value[idx], ...updatedUser }
      }
      
      if (selectedUser.value?.id === user.id) {
        selectedUser.value = { ...selectedUser.value, ...updatedUser }
      }
      alert('Login attempts reset successfully.')
    } else {
      handleApiError(res)
    }
  } catch (err) {
    handleApiError(err?.data || err)
  }
}

const handleForceLogout = async (user) => {
  if (!confirm(`Are you sure you want to force logout ${user.full_name}?`)) return
  
  try {
    const { forceLogout } = useAdminUsers()
    const res = await forceLogout(user.id)
    if (res && res.ok) {
      if (selectedUser.value?.id === user.id) {
        selectedUser.value.sessions = []
      }
      const idx = users.value.findIndex(u => u.id === user.id)
      if (idx !== -1) {
        users.value[idx].sessions = [] 
      }
      alert('User forcefully logged out of all active sessions.')
    } else {
      handleApiError(res)
    }
  } catch (err) {
    handleApiError(err?.data || err)
  }
}

const handleApiError = (err) => {
  console.error('API Error:', err)
  if (err?.status === 401) {
    navigateTo('/login')
  } else if (err?.status === 403) {
    alert("Admin access required")
  } else if (err?.status >= 500) {
    alert("Server error. Please try again.")
  } else {
    alert(err?.message || "Cannot connect to server. Check your connection.")
  }
}
</script>