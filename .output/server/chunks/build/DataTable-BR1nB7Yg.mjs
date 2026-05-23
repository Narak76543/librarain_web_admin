import { computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "DataTable",
  __ssrInlineRender: true,
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    total: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    perPage: { type: Number, default: 10 }
  },
  emits: ["page-change", "row-click"],
  setup(__props) {
    const props = __props;
    const totalPages = computed(() => {
      return Math.ceil(props.total / props.perPage);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full border border-border rounded-xl overflow-hidden bg-white" }, _attrs))}><div class="overflow-x-auto"><table class="w-full text-left text-sm"><thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border"><tr><!--[-->`);
      ssrRenderList(__props.columns, (col) => {
        _push(`<th class="${ssrRenderClass([col.class, "px-6 py-3"])}">${ssrInterpolate(col.label)}</th>`);
      });
      _push(`<!--]--></tr></thead><tbody class="divide-y divide-border"><!--[-->`);
      ssrRenderList(__props.rows, (row, idx) => {
        _push(`<tr class="${ssrRenderClass([{ "bg-surface/20": idx % 2 === 1 }, "hover:bg-surface/50 transition-colors cursor-pointer group"])}"><!--[-->`);
        ssrRenderList(__props.columns, (col) => {
          _push(`<td class="${ssrRenderClass([col.class, "px-6 py-4"])}">`);
          ssrRenderSlot(_ctx.$slots, col.key, { row }, () => {
            _push(`${ssrInterpolate(row[col.key])}`);
          }, _push, _parent);
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]-->`);
      if (!__props.rows.length) {
        _push(`<tr><td${ssrRenderAttr("colspan", __props.columns.length)} class="px-6 py-8 text-center text-text-secondary"> No data available </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      if (__props.total > 0) {
        _push(`<div class="flex items-center justify-between px-6 py-4 border-t border-border bg-white"><p class="text-sm text-text-secondary"> Showing <span class="font-semibold text-text-primary">${ssrInterpolate((__props.page - 1) * __props.perPage + 1)}</span> to <span class="font-semibold text-text-primary">${ssrInterpolate(Math.min(__props.page * __props.perPage, __props.total))}</span> of <span class="font-semibold text-text-primary">${ssrInterpolate(__props.total)}</span> results </p><div class="flex gap-1"><button class="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(__props.page === 1) ? " disabled" : ""}> &lt; </button><!--[-->`);
        ssrRenderList(totalPages.value, (p) => {
          _push(`<button class="${ssrRenderClass([p === __props.page ? "bg-primary text-white border border-primary" : "border border-border text-text-secondary hover:bg-surface", "w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors"])}">${ssrInterpolate(p)}</button>`);
        });
        _push(`<!--]--><button class="w-8 h-8 flex items-center justify-center rounded border border-border text-text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(__props.page === totalPages.value) ? " disabled" : ""}> &gt; </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=DataTable-BR1nB7Yg.mjs.map
