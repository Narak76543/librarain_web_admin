import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "ConfirmModal",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "Confirm Action" },
    message: { type: String, default: "Are you sure you want to proceed?" },
    confirmLabel: { type: String, default: "Confirm" }
  },
  emits: ["confirm", "cancel"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" }, _attrs))}><div class="card w-full max-w-md animate-in fade-in zoom-in duration-200"><h3 class="text-lg font-semibold text-text-primary mb-2">${ssrInterpolate(__props.title)}</h3><p class="text-text-secondary mb-6 text-sm">${ssrInterpolate(__props.message)}</p><div class="flex justify-end gap-3"><button class="h-10 px-4 rounded-lg font-medium text-sm text-text-primary hover:bg-surface transition-colors"> Cancel </button><button class="h-10 px-4 rounded-lg font-medium text-sm bg-error text-white hover:bg-red-600 transition-colors">${ssrInterpolate(__props.confirmLabel)}</button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ConfirmModal-2isBYOOQ.mjs.map
