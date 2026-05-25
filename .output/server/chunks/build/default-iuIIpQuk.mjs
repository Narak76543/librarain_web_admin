import { _ as __nuxt_component_0 } from './nuxt-link-DjCrawh9.mjs';
import { computed, mergeProps, ref, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, createTextVNode, toDisplayString, useSSRContext, defineComponent, createElementBlock, shallowRef, getCurrentInstance, provide, cloneVNode, h } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute as useRoute$1, useRouter } from 'vue-router';
import { Book, LayoutDashboard, Library, Tags, ShoppingCart, Users, Settings, LogOut, Search, Bell } from 'lucide-vue-next';
import { b as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
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

const _sfc_main$2 = {
  __name: "AdminSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    useRouter();
    const user = ref(null);
    const profile = ref(null);
    const displayName = computed(() => {
      var _a, _b, _c;
      const profileName = [(_a = profile.value) == null ? void 0 : _a.first_name, (_b = profile.value) == null ? void 0 : _b.last_name].filter(Boolean).join(" ").trim();
      return profileName || ((_c = user.value) == null ? void 0 : _c.full_name) || "Admin User";
    });
    const initials = computed(() => {
      return displayName.value.split(" ").filter(Boolean).map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "AU";
    });
    const navItems = [
      { path: "/", label: "Dashboard", icon: LayoutDashboard },
      { path: "/books", label: "Books", icon: Library },
      { path: "/categories", label: "Categories", icon: Tags },
      { path: "/orders", label: "Orders", icon: ShoppingCart },
      { path: "/users", label: "Users", icon: Users },
      { path: "/settings", label: "Settings", icon: Settings }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "w-60 fixed left-0 top-0 h-full bg-white border-r border-border flex flex-col z-20" }, _attrs))}><div class="h-16 flex items-center px-6 border-b border-border">`);
      _push(ssrRenderComponent(unref(Book), { class: "text-primary w-6 h-6 mr-2" }, null, _parent));
      _push(`<span class="text-lg font-semibold text-text-primary">BookStore</span><span class="text-[12px] text-text-secondary ml-1 mt-1">Admin</span></div><nav class="flex-1 p-4 space-y-1 overflow-y-auto"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.path,
          to: item.path,
          class: ["h-11 rounded-lg px-4 flex items-center gap-3 transition-colors", [
            unref(route).path === item.path ? "bg-primary-light text-primary border-l-4 border-primary font-semibold" : "text-text-secondary hover:bg-surface font-medium"
          ]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "w-5 h-5" }, null), _parent2, _scopeId);
              _push2(` ${ssrInterpolate(item.label)}`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-5 h-5" })),
                createTextVNode(" " + toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="p-4 border-t border-border flex items-center gap-3">`);
      if ((_a = profile.value) == null ? void 0 : _a.avatar_url) {
        _push(`<img${ssrRenderAttr("src", profile.value.avatar_url)}${ssrRenderAttr("alt", displayName.value)} class="w-8 h-8 rounded-full object-cover border border-border">`);
      } else {
        _push(`<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">${ssrInterpolate(initials.value)}</div>`);
      }
      _push(`<div class="flex-1 overflow-hidden"><p class="text-sm font-semibold text-text-primary truncate">${ssrInterpolate(displayName.value)}</p>`);
      if ((_b = user.value) == null ? void 0 : _b.email) {
        _push(`<p class="text-[11px] text-text-secondary truncate">${ssrInterpolate(user.value.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="text-xs text-error hover:underline flex items-center gap-1 mt-0.5">`);
      _push(ssrRenderComponent(unref(LogOut), { class: "w-3 h-3" }, null, _parent));
      _push(` Logout </button></div></div></aside>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "AdminTopbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const user = ref(null);
    const pageTitle = computed(() => {
      if (route.path === "/") return "Dashboard";
      if (route.path.startsWith("/books")) return "Books";
      if (route.path.startsWith("/categories")) return "Categories";
      if (route.path.startsWith("/orders")) return "Orders";
      if (route.path.startsWith("/users")) return "Users";
      if (route.path.startsWith("/settings")) return "Settings";
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-10" }, _attrs))}><h1 class="text-xl font-semibold text-text-primary">${ssrInterpolate(pageTitle.value)}</h1><div class="flex items-center gap-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text" placeholder="Search..." class="pl-9 w-64 bg-surface border-none"></div><button class="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-surface transition-colors">`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5" }, null, _parent));
      _push(`</button>`);
      if (user.value) {
        _push(`<div class="hidden md:block text-right ml-2 border-l border-border pl-4"><p class="text-sm font-semibold text-text-primary leading-tight">${ssrInterpolate(user.value.full_name)}</p><p class="text-xs text-text-secondary">${ssrInterpolate(user.value.email)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminTopbar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isLoginPage = computed(() => route.path === "/login");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminSidebar = _sfc_main$2;
      const _component_AdminTopbar = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-surface flex" }, _attrs))}>`);
      if (!isLoginPage.value) {
        _push(ssrRenderComponent(_component_AdminSidebar, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "ml-60": !isLoginPage.value }, "flex-1 flex flex-col min-w-0"])}">`);
      if (!isLoginPage.value) {
        _push(ssrRenderComponent(_component_AdminTopbar, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="flex-1 p-6 overflow-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-iuIIpQuk.mjs.map
