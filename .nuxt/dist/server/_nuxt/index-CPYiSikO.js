import { _ as _sfc_main$1 } from "./StatusBadge-ayQFkwOT.js";
import { ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { Search, X, Loader2, CheckCircle2, XCircle, Mail, Phone, MessageCircle, MapPin } from "lucide-vue-next";
import { u as useApi } from "./useApi-C-IOE6Or.js";
import { n as navigateTo } from "../server.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/hookable/dist/index.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/unctx/dist/index.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/defu/dist/defu.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/ufo/dist/index.mjs";
const useAdminUsers = () => {
  const { get, post, put, del } = useApi();
  const getUsers = async ({ search = "", role = "", status = "", limit = 10, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (status) params.append("status", status);
    params.append("limit", limit);
    params.append("offset", offset);
    return await get(`/api/v1/admin/users?${params.toString()}`);
  };
  const getUserDetail = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}`);
  };
  const updateUserStatus = async (userId, isActive) => {
    return await put(`/api/v1/admin/users/${userId}/status`, { is_active: isActive });
  };
  const resetLoginAttempt = async (userId) => {
    return await post(`/api/v1/admin/users/${userId}/reset-attempt`, {});
  };
  const forceLogout = async (userId) => {
    return await del(`/api/v1/admin/users/${userId}/sessions`);
  };
  const getLoginLogs = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}/login-logs?limit=10`);
  };
  return {
    getUsers,
    getUserDetail,
    updateUserStatus,
    resetLoginAttempt,
    forceLogout,
    getLoginLogs
  };
};
const perPage = 10;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const users = ref([]);
    const total = ref(0);
    const isLoading = ref(false);
    const searchQuery = ref("");
    const roleFilter = ref("");
    const statusFilter = ref("");
    const currentPage = ref(1);
    const selectedUser = ref(null);
    const isPanelOpen = ref(false);
    const isLoadingDetail = ref(false);
    let searchTimeout = null;
    const debouncedFetch = () => {
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchUsers();
      }, 400);
    };
    watch([searchQuery, roleFilter, statusFilter], () => {
      debouncedFetch();
    });
    watch(currentPage, () => {
      fetchUsers();
    });
    const normalizeAdminUser = (record) => {
      if (!record?.basic_info && !record?.account_status) return record;
      const basic = record.basic_info || {};
      const status = record.account_status || {};
      return {
        id: basic.id || record.user?.id,
        full_name: basic.full_name || record.user?.full_name,
        email: basic.email || record.user?.email,
        phone: basic.phone || record.profile?.phone || record.user?.phone,
        is_active: basic.is_active ?? record.user?.is_active,
        is_verified: basic.is_verified ?? record.user?.is_verified,
        roles: basic.roles || record.user?.roles || [],
        created_at: status.created_at,
        updated_at: status.updated_at,
        failed_login_attempts: status.failed_login_attempts || 0,
        locked_until: status.locked_until,
        locked_at: status.locked_at,
        locked_reason: status.locked_reason,
        last_login_at: status.last_login_at,
        password_changed_at: status.password_changed_at,
        profile: record.profile || {
          first_name: basic.first_name,
          last_name: basic.last_name,
          first_name_local: basic.first_name_local,
          last_name_local: basic.last_name_local,
          phone: basic.phone,
          telegram: basic.telegram,
          address: basic.address,
          avatar_url: basic.avatar_url
        },
        login_logs: record.login_activity || [],
        password_recovery: record.password_recovery,
        sessions: record.sessions || [],
        raw: record
      };
    };
    const isLockedUser = (user) => {
      return Boolean(user?.locked_until) || (user?.failed_login_attempts || 0) > 0;
    };
    const getUserInitials = (user) => {
      const name = user?.full_name || user?.email || "";
      const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").substring(0, 2).toUpperCase();
      return initials || "?";
    };
    const getProfileSubtitle = (user) => {
      const profile = user?.profile;
      if (!profile) return "";
      const localName = [profile.last_name_local, profile.first_name_local].filter(Boolean).join(" ").trim();
      if (localName) return localName;
      const englishName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
      return englishName;
    };
    const fetchUsers = async () => {
      isLoading.value = true;
      try {
        const { getUsers } = useAdminUsers();
        const res = await getUsers({
          search: searchQuery.value,
          role: roleFilter.value,
          status: statusFilter.value,
          limit: perPage,
          offset: (currentPage.value - 1) * perPage
        });
        if (res && res.ok) {
          users.value = res.data.users.map(normalizeAdminUser);
          total.value = res.data.total;
        } else {
          if (res?.status === 401 || res?.status === 403) {
            handleApiError(res);
          }
        }
      } catch (err) {
        handleApiError(err.data || err);
      } finally {
        isLoading.value = false;
      }
    };
    const handleApiError = (err) => {
      console.error("API Error:", err);
      if (err?.status === 401) {
        navigateTo("/login");
      } else if (err?.status === 403) {
        alert("Admin access required");
      } else if (err?.status >= 500) {
        alert("Server error. Please try again.");
      } else {
        alert(err?.message || "Cannot connect to server. Check your connection.");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StatusBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 relative h-full" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><h2 class="text-xl font-semibold text-text-primary">User Management</h2><div class="flex items-center gap-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search users..." class="pl-9 w-64 bg-white"></div><select class="bg-white min-w-[120px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(roleFilter.value) ? ssrLooseContain(roleFilter.value, "") : ssrLooseEqual(roleFilter.value, "")) ? " selected" : ""}>All Roles</option><option value="ADMIN"${ssrIncludeBooleanAttr(Array.isArray(roleFilter.value) ? ssrLooseContain(roleFilter.value, "ADMIN") : ssrLooseEqual(roleFilter.value, "ADMIN")) ? " selected" : ""}>Admin</option><option value="USER"${ssrIncludeBooleanAttr(Array.isArray(roleFilter.value) ? ssrLooseContain(roleFilter.value, "USER") : ssrLooseEqual(roleFilter.value, "USER")) ? " selected" : ""}>User</option></select><select class="bg-white min-w-[120px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "") : ssrLooseEqual(statusFilter.value, "")) ? " selected" : ""}>All Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "active") : ssrLooseEqual(statusFilter.value, "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "inactive") : ssrLooseEqual(statusFilter.value, "inactive")) ? " selected" : ""}>Inactive</option><option value="locked"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "locked") : ssrLooseEqual(statusFilter.value, "locked")) ? " selected" : ""}>Lock Attempt: True</option><option value="unlocked"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "unlocked") : ssrLooseEqual(statusFilter.value, "unlocked")) ? " selected" : ""}>Lock Attempt: False</option></select></div></div><div class="card !p-0 overflow-hidden"><div class="w-full overflow-x-auto"><table class="w-full text-left text-sm"><thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border"><tr><th class="px-6 py-3">Name</th><th class="px-6 py-3">Email</th><th class="px-6 py-3">Phone</th><th class="px-6 py-3">Role</th><th class="px-6 py-3">Joined</th><th class="px-6 py-3">Lock Attempt</th><th class="px-6 py-3">Status</th></tr></thead><tbody class="divide-y divide-border">`);
      if (isLoading.value) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<tr><td colspan="7"><div class="h-4 bg-gray-100 rounded animate-pulse mx-4 my-3"></div></td></tr>`);
        });
        _push(`<!--]-->`);
      } else if (users.value.length === 0) {
        _push(`<tr><td colspan="7" class="text-center py-16 text-gray-400"> No users found </td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(users.value, (user, idx) => {
          _push(`<tr class="${ssrRenderClass([{ "bg-surface/20": idx % 2 === 1 }, "hover:bg-surface/50 transition-colors group"])}"><td class="px-6 py-4"><div class="flex items-center gap-3">`);
          if (user.profile?.avatar_url) {
            _push(`<img${ssrRenderAttr("src", user.profile.avatar_url)}${ssrRenderAttr("alt", user.full_name || "User avatar")} class="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border">`);
          } else {
            _push(`<div class="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">${ssrInterpolate(getUserInitials(user))}</div>`);
          }
          _push(`<div><span class="font-semibold text-text-primary block">${ssrInterpolate(user.full_name)}</span>`);
          if (getProfileSubtitle(user)) {
            _push(`<span class="text-[11px] text-text-secondary block">${ssrInterpolate(getProfileSubtitle(user))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></td><td class="px-6 py-4">${ssrInterpolate(user.email)}</td><td class="px-6 py-4">${ssrInterpolate(user.phone || "—")}</td><td class="px-6 py-4"><span class="${ssrRenderClass([user.roles?.[0] === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-surface text-text-secondary", "px-2 py-1 rounded text-xs font-semibold"])}">${ssrInterpolate(user.roles?.[0] || "USER")}</span></td><td class="px-6 py-4 text-text-secondary">${ssrInterpolate(user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—")}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><span class="${ssrRenderClass([isLockedUser(user) ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-text-secondary", "px-2 py-1 rounded text-xs font-semibold"])}">${ssrInterpolate(isLockedUser(user) ? "True" : "False")}</span>`);
          if (isLockedUser(user)) {
            _push(`<button class="px-2.5 py-1 rounded border border-amber-200 text-amber-600 hover:bg-amber-50 text-xs font-medium transition-colors" title="Reset Login Attempts"> Reset </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4"><div class="flex items-center gap-2"><span class="${ssrRenderClass([user.is_active ? "bg-primary-light text-primary" : "bg-red-100 text-error", "px-2 py-1 rounded text-xs font-semibold"])}">${ssrInterpolate(user.is_active ? "Active" : "Inactive")}</span></div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
      if (total.value > 0) {
        _push(`<div class="px-6 py-4 border-t border-border bg-white flex justify-between items-center text-sm"><p class="text-text-secondary">Showing <span class="font-semibold text-text-primary">${ssrInterpolate((currentPage.value - 1) * perPage + 1)}</span> to <span class="font-semibold text-text-primary">${ssrInterpolate(Math.min(currentPage.value * perPage, total.value))}</span> of <span class="font-semibold text-text-primary">${ssrInterpolate(total.value)}</span> results</p><div class="flex gap-1"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="w-8 h-8 rounded border border-border flex items-center justify-center disabled:opacity-50 hover:bg-surface">&lt;</button><button class="w-8 h-8 rounded bg-primary text-white font-medium">${ssrInterpolate(currentPage.value)}</button><button${ssrIncludeBooleanAttr(currentPage.value * perPage >= total.value) ? " disabled" : ""} class="w-8 h-8 rounded border border-border flex items-center justify-center disabled:opacity-50 hover:bg-surface">&gt;</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (isPanelOpen.value) {
        _push(`<div class="fixed inset-0 bg-black/20 z-40"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([isPanelOpen.value ? "translate-x-0" : "translate-x-full", "fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto"])}"><div class="p-6"><div class="flex justify-between items-start mb-8"><h3 class="text-lg font-semibold text-text-primary">User Profile</h3><button class="text-text-secondary hover:text-text-primary">`);
      _push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
      _push(`</button></div>`);
      if (isLoadingDetail.value) {
        _push(`<div class="flex justify-center py-20">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin h-8 w-8 text-primary" }, null, _parent));
        _push(`</div>`);
      } else if (selectedUser.value) {
        _push(`<div class="space-y-6"><div class="flex flex-col items-center mb-6">`);
        if (selectedUser.value.profile?.avatar_url) {
          _push(`<img${ssrRenderAttr("src", selectedUser.value.profile.avatar_url)} class="w-24 h-24 rounded-full object-cover mb-3 shadow-sm border border-border">`);
        } else {
          _push(`<div class="w-24 h-24 rounded-full bg-primary-light text-primary flex items-center justify-center text-3xl font-semibold mb-3">${ssrInterpolate(selectedUser.value.full_name ? selectedUser.value.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "?")}</div>`);
        }
        _push(`<h4 class="text-xl font-semibold text-text-primary flex items-center gap-2">${ssrInterpolate(selectedUser.value.full_name)} `);
        if (selectedUser.value.is_verified) {
          _push(ssrRenderComponent(unref(CheckCircle2), {
            class: "w-4 h-4 text-primary",
            title: "Verified"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(XCircle), {
            class: "w-4 h-4 text-error",
            title: "Not Verified"
          }, null, _parent));
        }
        _push(`</h4><div class="flex gap-2 mt-2"><span class="${ssrRenderClass([selectedUser.value.roles?.[0] === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-surface text-text-secondary", "px-2 py-0.5 rounded text-[11px] font-semibold"])}">${ssrInterpolate(selectedUser.value.roles?.[0] || "USER")}</span>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: selectedUser.value.is_active
        }, null, _parent));
        _push(`</div></div><div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Personal Info</h5><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-text-secondary">First Name (EN)</span><span class="font-medium text-text-primary">${ssrInterpolate(selectedUser.value.profile?.first_name || "—")}</span></div><div class="flex justify-between"><span class="text-text-secondary">Last Name (EN)</span><span class="font-medium text-text-primary">${ssrInterpolate(selectedUser.value.profile?.last_name || "—")}</span></div><div class="flex justify-between"><span class="text-text-secondary">ឈ្មោះខ្មែរ (First Local)</span><span class="font-medium text-text-primary">${ssrInterpolate(selectedUser.value.profile?.first_name_local || "—")}</span></div><div class="flex justify-between"><span class="text-text-secondary">នាមខ្មែរ (Last Local)</span><span class="font-medium text-text-primary">${ssrInterpolate(selectedUser.value.profile?.last_name_local || "—")}</span></div></div></div><div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Contact Details</h5><div class="space-y-3"><div class="flex items-center gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4 text-text-secondary" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(selectedUser.value.email)}</span></div><div class="flex items-center gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(Phone), { class: "w-4 h-4 text-text-secondary" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(selectedUser.value.profile?.phone || "—")}</span></div><div class="flex items-center gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(MessageCircle), { class: "w-4 h-4 text-text-secondary" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(selectedUser.value.profile?.telegram ? `@${selectedUser.value.profile.telegram}` : "—")}</span></div><div class="flex items-start gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4 text-text-secondary mt-0.5" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(selectedUser.value.profile?.address || "—")}</span></div></div></div><div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Security &amp; Activity</h5><div class="bg-surface rounded-lg p-4 space-y-3 text-sm"><div class="flex justify-between items-center"><span class="text-text-secondary">Failed Attempts</span><span class="${ssrRenderClass([{ "text-error": selectedUser.value.failed_login_attempts > 0 }, "font-medium"])}">${ssrInterpolate(selectedUser.value.failed_login_attempts)}</span></div><div class="flex justify-between items-center"><span class="text-text-secondary">Locked Until</span><span class="${ssrRenderClass([{ "text-amber-600": selectedUser.value.locked_until }, "font-medium"])}">${ssrInterpolate(selectedUser.value.locked_until ? new Date(selectedUser.value.locked_until).toLocaleString() : "—")}</span></div><div class="flex justify-between items-center"><span class="text-text-secondary">Last Login</span><span class="font-medium">${ssrInterpolate(selectedUser.value.last_login_at ? new Date(selectedUser.value.last_login_at).toLocaleString() : "—")}</span></div></div></div>`);
        if (selectedUser.value.sessions?.length > 0) {
          _push(`<div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider flex justify-between"> Active Sessions <button class="text-error hover:underline normal-case text-[11px]">Force Logout All</button></h5><div class="space-y-2"><!--[-->`);
          ssrRenderList(selectedUser.value.sessions, (sess) => {
            _push(`<div class="text-xs bg-white border border-border p-3 rounded-lg"><p class="font-semibold mb-1">${ssrInterpolate(sess.device_name)}</p><p class="text-text-secondary truncate">${ssrInterpolate(sess.user_agent)}</p><div class="flex justify-between mt-2 text-text-secondary"><span>IP: ${ssrInterpolate(sess.ip_address)}</span><span>Exp: ${ssrInterpolate(new Date(sess.expires_at).toLocaleDateString())}</span></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedUser.value.login_logs?.length > 0) {
          _push(`<div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Recent Logins</h5><div class="space-y-2"><!--[-->`);
          ssrRenderList(selectedUser.value.login_logs, (log) => {
            _push(`<div class="text-xs flex justify-between border-b border-border pb-2 last:border-0"><div><p class="${ssrRenderClass([log.login_status === "SUCCESS" ? "text-primary" : "text-error", "font-medium"])}">${ssrInterpolate(log.login_status)}</p><p class="text-text-secondary">${ssrInterpolate(log.ip_address)}</p></div><div class="text-right"><p class="text-text-secondary">${ssrInterpolate(new Date(log.created_at).toLocaleString())}</p>`);
            if (log.failure_reason) {
              _push(`<p class="text-error mt-0.5">${ssrInterpolate(log.failure_reason)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CPYiSikO.js.map
