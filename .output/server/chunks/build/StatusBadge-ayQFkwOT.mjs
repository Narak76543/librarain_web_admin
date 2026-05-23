import { computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {
      type: [String, Boolean],
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const displayStatus = computed(() => {
      if (typeof props.status === "boolean") {
        return props.status ? "Active" : "Inactive";
      }
      return props.status;
    });
    const badgeClass = computed(() => {
      const s = String(displayStatus.value).toLowerCase();
      if (s === "delivered" || s === "active") {
        return "bg-primary-light text-primary";
      }
      if (s === "processing") {
        return "bg-amber-100 text-amber-700";
      }
      if (s === "pending") {
        return "bg-blue-100 text-blue-700";
      }
      if (s === "cancelled" || s === "error") {
        return "bg-red-100 text-error";
      }
      return "bg-gray-100 text-text-secondary";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center", badgeClass.value]
      }, _attrs))}>${ssrInterpolate(displayStatus.value)}</span>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=StatusBadge-ayQFkwOT.mjs.map
