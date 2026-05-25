import { ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { Search, X, Loader2, CheckCircle2, XCircle, Mail, Phone, MessageCircle, MapPin } from 'lucide-vue-next';
import { u as useApi } from './useApi-COT1EI1I.mjs';
import { n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const useAdminUsers = () => {
  const { get, put, del } = useApi();
  const getAllUsers = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await get(`/api/v1/admin/users?${query}`);
  };
  const getUserById = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}`);
  };
  const updateUserById = async (userId, payload) => {
    return await put(`/api/v1/admin/users/${userId}`, payload);
  };
  const deleteUserById = async (userId) => {
    return await del(`/api/v1/admin/users/${userId}`);
  };
  const getUserDetail = async (userId) => {
    return await get(`/api/v1/admin/users/${userId}`);
  };
  const updateUserStatus = async (userId, isActive) => {
    return await put(`/api/v1/admin/users/${userId}`, { is_active: isActive });
  };
  const resetLoginAttempt = async (userId) => {
    return await put(`/api/v1/admin/users/${userId}/reset-attempts`, {});
  };
  const forceLogout = async (userId) => {
    return await del(`/api/v1/admin/users/${userId}/sessions`, {});
  };
  return {
    getAllUsers,
    getUsers: getAllUsers,
    // Fixes the error from image_b20407.png
    getUserById,
    updateUserById,
    deleteUserById,
    getUserDetail,
    updateUserStatus,
    resetLoginAttempt,
    forceLogout
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
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
      if (!record) return record;
      const basic = record.basic_info || {};
      const status = record.account_status || {};
      return {
        id: basic.id || record.id || ((_a = record.user) == null ? void 0 : _a.id),
        full_name: basic.full_name || record.full_name || ((_b = record.user) == null ? void 0 : _b.full_name),
        email: basic.email || record.email || ((_c = record.user) == null ? void 0 : _c.email),
        phone: basic.phone || record.phone || ((_d = record.profile) == null ? void 0 : _d.phone) || ((_e = record.user) == null ? void 0 : _e.phone),
        is_active: (_h = (_f = basic.is_active) != null ? _f : record.is_active) != null ? _h : (_g = record.user) == null ? void 0 : _g.is_active,
        is_verified: (_k = (_i = basic.is_verified) != null ? _i : record.is_verified) != null ? _k : (_j = record.user) == null ? void 0 : _j.is_verified,
        roles: basic.roles || record.roles || ((_l = record.user) == null ? void 0 : _l.roles) || [],
        created_at: status.created_at || record.created_at,
        updated_at: status.updated_at || record.updated_at,
        // Fallback checks from root properties down to nested structures
        failed_login_attempts: (_p = (_o = (_n = (_m = record.failed_login_attempts) != null ? _m : record.failedLoginAttempts) != null ? _n : status.failed_login_attempts) != null ? _o : status.failedLoginAttempts) != null ? _p : 0,
        locked_until: record.locked_until || record.lockedUntil || status.locked_until || status.lockedUntil || null,
        locked_at: record.locked_at || record.lockedAt || status.locked_at || status.lockedAt || null,
        locked_reason: record.locked_reason || record.lockedReason || status.locked_reason || status.lockedReason || null,
        // Add boolean properties for lock status that might be sent by backend
        is_locked: (_r = (_q = record.is_locked) != null ? _q : record.lock_attempt) != null ? _r : false,
        lock_attempt: (_t = (_s = record.lock_attempt) != null ? _s : record.is_locked) != null ? _t : false,
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
          avatar_url: basic.avatar_url || record.avatar_url
        },
        login_logs: record.login_activity || record.login_logs || [],
        password_recovery: record.password_recovery,
        sessions: record.sessions || [],
        raw: record
      };
    };
    const isLockedUser = (user) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      if (!user) return false;
      if (user.is_locked === true || user.lock_attempt === true || ((_a = user.raw) == null ? void 0 : _a.is_locked) === true || ((_b = user.raw) == null ? void 0 : _b.lock_attempt) === true) {
        return true;
      }
      const lockedUntilVal = user.locked_until || user.lockedUntil || ((_c = user.account_status) == null ? void 0 : _c.locked_until) || ((_d = user.account_status) == null ? void 0 : _d.lockedUntil) || ((_f = (_e = user.raw) == null ? void 0 : _e.account_status) == null ? void 0 : _f.lockedUntil);
      if (lockedUntilVal) {
        const lockDate = new Date(lockedUntilVal);
        if (lockDate > /* @__PURE__ */ new Date()) return true;
      }
      const failedAttempts = (_n = (_m = (_k = (_i = (_g = user.failed_login_attempts) != null ? _g : user.failedLoginAttempts) != null ? _i : (_h = user.account_status) == null ? void 0 : _h.failed_login_attempts) != null ? _k : (_j = user.account_status) == null ? void 0 : _j.failedLoginAttempts) != null ? _m : (_l = user.raw) == null ? void 0 : _l.failed_login_attempts) != null ? _n : 0;
      return failedAttempts > 0;
    };
    const getUserInitials = (user) => {
      const name = (user == null ? void 0 : user.full_name) || (user == null ? void 0 : user.email) || "";
      const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").substring(0, 2).toUpperCase();
      return initials || "?";
    };
    const getProfileSubtitle = (user) => {
      const profile = user == null ? void 0 : user.profile;
      if (!profile) return "";
      const localName = [profile.last_name_local, profile.first_name_local].filter(Boolean).join(" ").trim();
      if (localName) return localName;
      const englishName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
      return englishName;
    };
    const fetchUsers = async () => {
      var _a, _b;
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
          const rawUsers = Array.isArray(res.data) ? res.data : ((_a = res.data) == null ? void 0 : _a.users) || [];
          users.value = rawUsers.map(normalizeAdminUser);
          total.value = ((_b = res.data) == null ? void 0 : _b.total) || rawUsers.length;
        } else {
          if ((res == null ? void 0 : res.status) === 401 || (res == null ? void 0 : res.status) === 403) {
            handleApiError(res);
          }
        }
      } catch (err) {
        handleApiError((err == null ? void 0 : err.data) || err);
      } finally {
        isLoading.value = false;
      }
    };
    const handleApiError = (err) => {
      console.error("API Error:", err);
      if ((err == null ? void 0 : err.status) === 401) {
        navigateTo("/login");
      } else if ((err == null ? void 0 : err.status) === 403) {
        alert("Admin access required");
      } else if ((err == null ? void 0 : err.status) >= 500) {
        alert("Server error. Please try again.");
      } else {
        alert((err == null ? void 0 : err.message) || "Cannot connect to server. Check your connection.");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
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
          var _a2, _b2, _c2;
          _push(`<tr class="${ssrRenderClass([{ "bg-surface/20": idx % 2 === 1 }, "hover:bg-surface/50 transition-colors group cursor-pointer"])}"><td class="px-6 py-4"><div class="flex items-center gap-3">`);
          if ((_a2 = user.profile) == null ? void 0 : _a2.avatar_url) {
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
          _push(`</div></div></td><td class="px-6 py-4">${ssrInterpolate(user.email)}</td><td class="px-6 py-4">${ssrInterpolate(user.phone || "\u2014")}</td><td class="px-6 py-4"><span class="${ssrRenderClass([((_b2 = user.roles) == null ? void 0 : _b2[0]) === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-surface text-text-secondary", "px-2 py-1 rounded text-xs font-semibold"])}">${ssrInterpolate(((_c2 = user.roles) == null ? void 0 : _c2[0]) || "USER")}</span></td><td class="px-6 py-4 text-text-secondary">${ssrInterpolate(user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014")}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><span class="${ssrRenderClass([isLockedUser(user) ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-text-secondary", "px-2 py-1 rounded text-xs font-semibold"])}">${ssrInterpolate(isLockedUser(user) ? "True" : "False")}</span>`);
          if (isLockedUser(user)) {
            _push(`<button class="px-2.5 py-1 rounded border border-amber-200 text-amber-600 hover:bg-amber-50 text-xs font-medium transition-colors" title="Reset Login Attempts"> Reset </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4"><div class="flex items-center gap-2"><button class="${ssrRenderClass([user.is_active ? "bg-primary-light text-primary hover:bg-primary-light/80" : "bg-red-100 text-error hover:bg-red-200", "px-2 py-1 rounded text-xs font-semibold transition-colors"])}">${ssrInterpolate(user.is_active ? "Active" : "Inactive")}</button></div></td></tr>`);
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
        if ((_a = selectedUser.value.profile) == null ? void 0 : _a.avatar_url) {
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
        _push(`</h4><div class="flex gap-2 mt-2"><span class="${ssrRenderClass([((_b = selectedUser.value.roles) == null ? void 0 : _b[0]) === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-surface text-text-secondary", "px-2 py-0.5 rounded text-[11px] font-semibold"])}">${ssrInterpolate(((_c = selectedUser.value.roles) == null ? void 0 : _c[0]) || "USER")}</span><span class="${ssrRenderClass([selectedUser.value.is_active ? "bg-primary-light text-primary" : "bg-red-100 text-error", "px-2 py-0.5 rounded text-[11px] font-semibold"])}">${ssrInterpolate(selectedUser.value.is_active ? "Active" : "Inactive")}</span></div></div><div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Personal Info</h5><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-text-secondary">First Name (EN)</span><span class="font-medium text-text-primary">${ssrInterpolate(((_d = selectedUser.value.profile) == null ? void 0 : _d.first_name) || "\u2014")}</span></div><div class="flex justify-between"><span class="text-text-secondary">Last Name (EN)</span><span class="font-medium text-text-primary">${ssrInterpolate(((_e = selectedUser.value.profile) == null ? void 0 : _e.last_name) || "\u2014")}</span></div><div class="flex justify-between"><span class="text-text-secondary">\u1788\u17D2\u1798\u17C4\u17C7\u1781\u17D2\u1798\u17C2\u179A (First Local)</span><span class="font-medium text-text-primary">${ssrInterpolate(((_f = selectedUser.value.profile) == null ? void 0 : _f.first_name_local) || "\u2014")}</span></div><div class="flex justify-between"><span class="text-text-secondary">\u1793\u17B6\u1798\u1781\u17D2\u1798\u17C2\u179A (Last Local)</span><span class="font-medium text-text-primary">${ssrInterpolate(((_g = selectedUser.value.profile) == null ? void 0 : _g.last_name_local) || "\u2014")}</span></div></div></div><div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Contact Details</h5><div class="space-y-3"><div class="flex items-center gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4 text-text-secondary" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(selectedUser.value.email)}</span></div><div class="flex items-center gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(Phone), { class: "w-4 h-4 text-text-secondary" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(selectedUser.value.phone || "\u2014")}</span></div><div class="flex items-center gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(MessageCircle), { class: "w-4 h-4 text-text-secondary" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(((_h = selectedUser.value.profile) == null ? void 0 : _h.telegram) ? `@${selectedUser.value.profile.telegram}` : "\u2014")}</span></div><div class="flex items-start gap-3 text-sm">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4 text-text-secondary mt-0.5" }, null, _parent));
        _push(`<span class="text-text-primary">${ssrInterpolate(((_i = selectedUser.value.profile) == null ? void 0 : _i.address) || "\u2014")}</span></div></div></div><div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider">Security &amp; Activity</h5><div class="bg-surface rounded-lg p-4 space-y-3 text-sm"><div class="flex justify-between items-center"><span class="text-text-secondary">Failed Attempts</span><span class="${ssrRenderClass([{ "text-error": selectedUser.value.failed_login_attempts > 0 }, "font-medium"])}">${ssrInterpolate(selectedUser.value.failed_login_attempts)}</span></div><div class="flex justify-between items-center"><span class="text-text-secondary">Locked Until</span><span class="${ssrRenderClass([{ "text-amber-600": selectedUser.value.locked_until }, "font-medium"])}">${ssrInterpolate(selectedUser.value.locked_until ? new Date(selectedUser.value.locked_until).toLocaleString() : "\u2014")}</span></div><div class="flex justify-between items-center"><span class="text-text-secondary">Last Login</span><span class="font-medium">${ssrInterpolate(selectedUser.value.last_login_at ? new Date(selectedUser.value.last_login_at).toLocaleString() : "\u2014")}</span></div></div></div>`);
        if (((_j = selectedUser.value.sessions) == null ? void 0 : _j.length) > 0) {
          _push(`<div><h5 class="text-xs font-semibold text-text-secondary uppercase mb-3 tracking-wider flex justify-between"> Active Sessions <button class="text-error hover:underline normal-case text-[11px]">Force Logout All</button></h5><div class="space-y-2"><!--[-->`);
          ssrRenderList(selectedUser.value.sessions, (sess) => {
            _push(`<div class="text-xs bg-white border border-border p-3 rounded-lg"><p class="font-semibold mb-1">${ssrInterpolate(sess.device_name)}</p><p class="text-text-secondary truncate">${ssrInterpolate(sess.user_agent)}</p><div class="flex justify-between mt-2 text-text-secondary"><span>IP: ${ssrInterpolate(sess.ip_address)}</span><span>Exp: ${ssrInterpolate(new Date(sess.expires_at).toLocaleDateString())}</span></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_k = selectedUser.value.login_logs) == null ? void 0 : _k.length) > 0) {
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

export { _sfc_main as default };
//# sourceMappingURL=index-CmA8adD-.mjs.map
