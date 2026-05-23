import { ref, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrInterpolate } from "vue/server-renderer";
import { Settings, Mail, Cloud, Shield } from "lucide-vue-next";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeSection = ref("general");
    const sections = [
      { id: "general", name: "General", icon: Settings },
      { id: "email", name: "Email / SMTP", icon: Mail },
      { id: "cloudinary", name: "Cloudinary", icon: Cloud },
      { id: "security", name: "Security", icon: Shield }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col lg:flex-row gap-6" }, _attrs))}><div class="lg:w-64 flex-shrink-0"><div class="card p-2 space-y-1"><!--[-->`);
      ssrRenderList(sections, (section) => {
        _push(`<button class="${ssrRenderClass([activeSection.value === section.id ? "bg-primary-light text-primary font-semibold" : "text-text-secondary hover:bg-surface font-medium", "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-3"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(section.icon), { class: "w-4 h-4" }, null), _parent);
        _push(` ${ssrInterpolate(section.name)}</button>`);
      });
      _push(`<!--]--></div></div><div class="flex-1">`);
      if (activeSection.value === "general") {
        _push(`<div class="card"><h3 class="text-lg font-semibold text-text-primary mb-6">General Settings</h3><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-text-secondary mb-1">App Name</label><input type="text" class="w-full" value="BookStore"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Contact Email</label><input type="email" class="w-full" value="contact@bookstore.com"></div><div class="md:col-span-2"><label class="block text-sm font-medium text-text-secondary mb-1">App Description</label><textarea class="w-full h-24 py-2">The best place to buy and read books online.</textarea></div></div><div class="border-t border-border pt-4 flex justify-end"><button class="btn-primary">Save Changes</button></div></form></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeSection.value === "email") {
        _push(`<div class="card"><h3 class="text-lg font-semibold text-text-primary mb-6">Email / SMTP Configuration</h3><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="md:col-span-2"><label class="block text-sm font-medium text-text-secondary mb-1">SMTP Server</label><input type="text" class="w-full" value="smtp.gmail.com"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">SMTP Port</label><input type="text" class="w-full" value="587"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">From Email</label><input type="email" class="w-full" value="no-reply@bookstore.com"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Username</label><input type="text" class="w-full" value="admin@bookstore.com"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Password</label><input type="password" class="w-full" value="••••••••••••"></div></div><div class="border-t border-border pt-4 flex justify-between items-center"><button type="button" class="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface transition-colors"> Send Test Email </button><button class="btn-primary">Save Changes</button></div></form></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeSection.value === "cloudinary") {
        _push(`<div class="card"><h3 class="text-lg font-semibold text-text-primary mb-6">Cloudinary Storage</h3><form class="space-y-6"><div class="grid grid-cols-1 gap-6"><div><label class="block text-sm font-medium text-text-secondary mb-1">Cloud Name</label><input type="text" class="w-full" value="bookstore-cloud"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">API Key</label><input type="text" class="w-full" value="8493720498273"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">API Secret</label><input type="password" class="w-full" value="••••••••••••••••"></div></div><div class="border-t border-border pt-4 flex justify-between items-center"><button type="button" class="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface transition-colors"> Test Connection </button><button class="btn-primary">Save Changes</button></div></form></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeSection.value === "security") {
        _push(`<div class="card"><h3 class="text-lg font-semibold text-text-primary mb-6">Security &amp; Authentication</h3><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-text-secondary mb-1">Max Failed Login Attempts</label><input type="number" class="w-full" value="5"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Lock Duration (Minutes)</label><input type="number" class="w-full" value="30"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">JWT Token Expiry (Hours)</label><input type="number" class="w-full" value="24"></div><div class="flex items-center gap-3 pt-6"><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer" checked><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div></label><span class="text-sm font-medium text-text-secondary">Enforce Single Session per User</span></div></div><div class="border-t border-border pt-4 flex justify-end"><button class="btn-primary">Save Changes</button></div></form></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BzO7bm3y.js.map
