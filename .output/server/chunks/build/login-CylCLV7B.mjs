import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderDynamicModel, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Book, Eye, EyeOff, Loader2 } from 'lucide-vue-next';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const remainingAttempts = ref(null);
    const lockedUntil = ref(null);
    const errorType = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-surface flex items-center justify-center p-4" }, _attrs))}><div class="bg-white rounded-2xl border border-border p-10 w-full max-w-md shadow-sm"><div class="flex flex-col items-center justify-center mb-8"><div class="flex items-center">`);
      _push(ssrRenderComponent(unref(Book), { class: "w-10 h-10 text-primary mr-2" }, null, _parent));
      _push(`<h1 class="text-2xl font-bold text-primary">BookStore</h1><span class="text-[12px] text-text-secondary ml-1 mt-1">Admin</span></div></div><div class="mb-6"><h2 class="text-[22px] font-bold text-[#1C1C1E] mb-1">Welcome back</h2><p class="text-sm text-text-secondary">Sign in to your admin account</p></div><form class="space-y-4"><div><label class="block text-[13px] font-medium text-text-secondary mb-1">Email</label><input${ssrRenderAttr("value", email.value)} type="email" placeholder="admin@bookstore.com" class="w-full h-10 border border-border rounded-lg px-3 focus:border-primary focus:outline-none focus:ring-0" required></div><div class="relative"><label class="block text-[13px] font-medium text-text-secondary mb-1">Password</label><div class="relative"><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="w-full h-10 border border-border rounded-lg pl-3 pr-10 focus:border-primary focus:outline-none focus:ring-0" required><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">`);
      if (showPassword.value) {
        _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "w-4 h-4" }, null, _parent));
      }
      _push(`</button></div></div>`);
      if (errorMessage.value) {
        _push(`<div class="pt-2">`);
        if (errorType.value === "invalid") {
          _push(`<div class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">${ssrInterpolate(errorMessage.value)} `);
          if (remainingAttempts.value) {
            _push(`<span class="text-gray-500 text-xs block mt-1">${ssrInterpolate(remainingAttempts.value)} attempts remaining before lockout </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (errorType.value === "locked") {
          _push(`<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700 text-sm"> Account locked. Try again after ${ssrInterpolate(lockedUntil.value)}</div>`);
        } else {
          _push(`<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 text-sm">${ssrInterpolate(errorMessage.value)}</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="w-full h-11 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center transition-colors">`);
      if (isLoading.value) {
        _push(`<span>`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin h-4 w-4 mr-2 inline" }, null, _parent));
        _push(` Signing in... </span>`);
      } else {
        _push(`<span>Sign In</span>`);
      }
      _push(`</button></form><div class="mt-8 text-center flex flex-col items-center"><p class="text-[12px] text-text-secondary">BookStore Admin Panel</p><p class="text-[11px] text-text-secondary mt-0.5">\xA9 2026 All rights reserved</p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CylCLV7B.mjs.map
