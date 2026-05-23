import { _ as _sfc_main$1 } from './StatusBadge-ayQFkwOT.mjs';
import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Search, ChevronDown } from 'lucide-vue-next';
import { u as useMockData } from './useMockData-eX352thy.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { orders, books } = useMockData();
    const expandedRow = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StatusBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text" placeholder="Search orders (ID, customer)..." class="pl-9 w-full md:w-64 bg-white"></div><div class="flex flex-wrap items-center gap-4"><select class="bg-white min-w-[150px]"><option value="">All Statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select><input type="date" class="bg-white"><span class="text-text-secondary text-sm">to</span><input type="date" class="bg-white"></div></div><div class="card !p-0 overflow-hidden"><div class="w-full overflow-x-auto"><table class="w-full text-left text-sm"><thead class="bg-surface text-text-secondary text-xs font-semibold uppercase border-b border-border"><tr><th class="px-6 py-3">Order ID</th><th class="px-6 py-3">Customer</th><th class="px-6 py-3">Date</th><th class="px-6 py-3 text-center">Items</th><th class="px-6 py-3">Total</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Action</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`);
      ssrRenderList(unref(orders), (row, idx) => {
        _push(`<!--[--><tr class="${ssrRenderClass([{ "bg-surface/20": idx % 2 === 1, "bg-primary-light/30": expandedRow.value === row.id }, "hover:bg-surface/50 transition-colors cursor-pointer group"])}"><td class="px-6 py-4 font-semibold">${ssrInterpolate(row.id)}</td><td class="px-6 py-4"><p class="font-semibold text-text-primary">${ssrInterpolate(row.customer)}</p><p class="text-xs text-text-secondary">${ssrInterpolate(row.email)}</p></td><td class="px-6 py-4 text-text-secondary">${ssrInterpolate(row.date)}</td><td class="px-6 py-4 text-center">${ssrInterpolate(row.books)}</td><td class="px-6 py-4 font-medium">$${ssrInterpolate(row.total.toFixed(2))}</td><td class="px-6 py-4">`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: row.status
        }, null, _parent));
        _push(`</td><td class="px-6 py-4 text-right"><button class="${ssrRenderClass([{ "rotate-180": expandedRow.value === row.id }, "w-8 h-8 inline-flex items-center justify-center rounded hover:bg-surface text-text-secondary transition-colors"])}">`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 transition-transform" }, null, _parent));
        _push(`</button></td></tr>`);
        if (expandedRow.value === row.id) {
          _push(`<tr class="bg-surface/30 border-b border-border"><td colspan="7" class="p-6"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2"><h4 class="text-sm font-semibold text-text-primary mb-4">Order Items</h4><div class="space-y-4"><!--[-->`);
          ssrRenderList(row.books, (i) => {
            _push(`<div class="flex items-center gap-4 border border-border rounded-lg p-3 bg-white"><img${ssrRenderAttr("src", unref(books)[i % unref(books).length].cover)} class="w-12 h-16 object-cover rounded"><div class="flex-1"><p class="font-semibold text-text-primary">${ssrInterpolate(unref(books)[i % unref(books).length].title)}</p><p class="text-xs text-text-secondary">By ${ssrInterpolate(unref(books)[i % unref(books).length].author)}</p></div><div class="text-right"><p class="font-semibold text-text-primary">$${ssrInterpolate(unref(books)[i % unref(books).length].price.toFixed(2))}</p><p class="text-xs text-text-secondary">Qty: 1</p></div></div>`);
          });
          _push(`<!--]--></div></div><div><h4 class="text-sm font-semibold text-text-primary mb-4">Order Summary</h4><div class="bg-white border border-border rounded-lg p-4 space-y-3"><div class="flex justify-between text-sm"><span class="text-text-secondary">Subtotal</span><span class="font-medium text-text-primary">$${ssrInterpolate((row.total * 0.9).toFixed(2))}</span></div><div class="flex justify-between text-sm"><span class="text-text-secondary">Tax (10%)</span><span class="font-medium text-text-primary">$${ssrInterpolate((row.total * 0.1).toFixed(2))}</span></div><div class="flex justify-between text-sm"><span class="text-text-secondary">Shipping</span><span class="font-medium text-text-primary">$0.00</span></div><div class="pt-3 border-t border-border flex justify-between"><span class="font-semibold text-text-primary">Total</span><span class="font-semibold text-primary">$${ssrInterpolate(row.total.toFixed(2))}</span></div></div><h4 class="text-sm font-semibold text-text-primary mb-3 mt-6">Update Status</h4><div class="flex gap-2"><select class="flex-1 bg-white"><option value="Pending"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Pending") : ssrLooseEqual(row.status, "Pending")) ? " selected" : ""}>Pending</option><option value="Processing"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Processing") : ssrLooseEqual(row.status, "Processing")) ? " selected" : ""}>Processing</option><option value="Delivered"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Delivered") : ssrLooseEqual(row.status, "Delivered")) ? " selected" : ""}>Delivered</option><option value="Cancelled"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Cancelled") : ssrLooseEqual(row.status, "Cancelled")) ? " selected" : ""}>Cancelled</option></select><button class="btn-primary">Update</button></div></div></div></td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></tbody></table></div><div class="px-6 py-4 border-t border-border bg-white flex justify-between items-center text-sm"><p class="text-text-secondary">Showing <span class="font-semibold text-text-primary">1</span> to <span class="font-semibold text-text-primary">5</span> of <span class="font-semibold text-text-primary">89</span> results</p><div class="flex gap-1"><button class="w-8 h-8 rounded border border-border flex items-center justify-center opacity-50">&lt;</button><button class="w-8 h-8 rounded bg-primary text-white font-medium">1</button><button class="w-8 h-8 rounded border border-border hover:bg-surface">2</button><button class="w-8 h-8 rounded border border-border hover:bg-surface">3</button><button class="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-surface">&gt;</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-OImY66oo.mjs.map
