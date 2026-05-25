import { _ as _sfc_main$1 } from "./StatusBadge-ayQFkwOT.js";
import { ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { Download, Search, ChevronDown } from "lucide-vue-next";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const orders = ref([]);
    const totalOrders = ref(0);
    const isLoading = ref(true);
    const isUpdating = ref(false);
    const limit = ref(10);
    const offset = ref(0);
    const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1);
    const totalPages = computed(() => Math.ceil(totalOrders.value / limit.value) || 1);
    const searchQuery = ref("");
    const statusFilter = ref("");
    const fromDate = ref("");
    const toDate = ref("");
    const expandedRow = ref(null);
    const displayedPages = computed(() => {
      const pages = [];
      for (let i = 1; i <= totalPages.value; i++) {
        if (i === 1 || i === totalPages.value || i >= currentPage.value - 1 && i <= currentPage.value + 1) {
          pages.push(i);
        }
      }
      return [...new Set(pages)].sort((a, b) => a - b);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StatusBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><div class="flex items-end gap-3"><h1 class="text-2xl font-bold text-text-primary">Orders</h1><span class="text-text-secondary text-sm pb-0.5">${ssrInterpolate(totalOrders.value)} orders total</span></div></div><button class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-text-primary hover:bg-surface transition-colors font-medium text-sm shadow-sm">`);
      _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
      _push(` Export CSV </button></div><div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div class="relative w-full xl:w-96">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search orders by ID or customer name..." class="pl-10 pr-4 py-2.5 w-full bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm"></div><div class="flex flex-wrap items-center gap-3"><div class="relative"><select class="appearance-none bg-white border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary cursor-pointer w-36 shadow-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "") : ssrLooseEqual(statusFilter.value, "")) ? " selected" : ""}>All Statuses</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "pending") : ssrLooseEqual(statusFilter.value, "pending")) ? " selected" : ""}>Pending</option><option value="processing"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "processing") : ssrLooseEqual(statusFilter.value, "processing")) ? " selected" : ""}>Processing</option><option value="delivered"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "delivered") : ssrLooseEqual(statusFilter.value, "delivered")) ? " selected" : ""}>Delivered</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "cancelled") : ssrLooseEqual(statusFilter.value, "cancelled")) ? " selected" : ""}>Cancelled</option></select>`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" }, null, _parent));
      _push(`</div><div class="flex items-center gap-4 bg-white border border-border rounded-lg px-4 py-2.5 text-sm shadow-sm"><span class="text-text-secondary">From</span><div class="relative flex items-center gap-2 cursor-pointer group"><input type="date"${ssrRenderAttr("value", fromDate.value)} class="w-28 focus:outline-none text-text-primary bg-transparent cursor-pointer group-hover:text-primary transition-colors text-sm"></div><span class="text-text-secondary">to</span><div class="relative flex items-center gap-2 cursor-pointer group"><input type="date"${ssrRenderAttr("value", toDate.value)} class="w-28 focus:outline-none text-text-primary bg-transparent cursor-pointer group-hover:text-primary transition-colors text-sm"></div></div></div></div><div class="bg-white border border-border rounded-xl overflow-hidden shadow-sm relative">`);
      if (isLoading.value) {
        _push(`<div class="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-full overflow-x-auto min-h-[300px]"><table class="w-full text-left text-sm whitespace-nowrap"><thead class="bg-surface text-text-secondary text-xs font-bold uppercase border-b border-border"><tr><th class="px-6 py-4 tracking-wider">Order ID</th><th class="px-6 py-4 tracking-wider">Customer</th><th class="px-6 py-4 tracking-wider">Date</th><th class="px-6 py-4 text-center tracking-wider">Items</th><th class="px-6 py-4 tracking-wider">Total</th><th class="px-6 py-4 tracking-wider">Status</th><th class="px-6 py-4 text-right tracking-wider">Action</th></tr></thead><tbody class="divide-y divide-border">`);
      if (orders.value.length === 0 && !isLoading.value) {
        _push(`<tr><td colspan="7" class="px-6 py-8 text-center text-text-secondary">No orders found.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(orders.value, (row, idx) => {
        _push(`<!--[--><tr class="${ssrRenderClass([{ "bg-surface/20": idx % 2 === 1, "bg-primary-light/40": expandedRow.value === row.id }, "hover:bg-surface/50 transition-colors cursor-pointer group"])}"><td class="px-6 py-4 font-bold text-primary">${ssrInterpolate(row.id)}</td><td class="px-6 py-4"><p class="font-bold text-text-primary">${ssrInterpolate(row.customer)}</p><p class="text-xs text-text-secondary mt-0.5">${ssrInterpolate(row.email)}</p></td><td class="px-6 py-4 text-text-secondary">${ssrInterpolate(row.date)}</td><td class="px-6 py-4 text-center font-medium">${ssrInterpolate(row.books)}</td><td class="px-6 py-4 font-bold text-text-primary">$${ssrInterpolate(row.total.toFixed(2))}</td><td class="px-6 py-4">`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: row.status
        }, null, _parent));
        _push(`</td><td class="px-6 py-4 text-right"><button class="${ssrRenderClass([{ "rotate-180 bg-white shadow-sm border border-border text-primary": expandedRow.value === row.id }, "w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-border text-text-secondary transition-all"])}">`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 transition-transform" }, null, _parent));
        _push(`</button></td></tr>`);
        if (expandedRow.value === row.id) {
          _push(`<tr class="bg-surface/20 border-b-2 border-border/50"><td colspan="7" class="p-8"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8 whitespace-normal"><div class="lg:col-span-2"><h4 class="text-lg font-bold text-text-primary mb-5">Order Items</h4><div class="space-y-4">`);
          if (!row.items || row.items.length === 0) {
            _push(`<div class="text-text-secondary text-sm">No items found for this order.</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(row.items, (item) => {
            _push(`<div class="flex items-center gap-5 border border-border rounded-xl p-4 bg-white shadow-sm hover:border-primary/30 transition-colors"><img${ssrRenderAttr("src", item.cover)} class="w-16 h-24 object-cover rounded-md shadow-sm border border-border/50 bg-surface"><div class="flex-1"><p class="font-bold text-text-primary text-base mb-1">${ssrInterpolate(item.title)}</p><p class="text-sm text-text-secondary">by ${ssrInterpolate(item.author)}</p></div><div class="text-right"><p class="text-sm text-text-primary mb-1">${ssrInterpolate(item.quantity)} x $${ssrInterpolate(item.price.toFixed(2))}</p><p class="font-bold text-primary text-base">$${ssrInterpolate((item.quantity * item.price).toFixed(2))}</p></div></div>`);
          });
          _push(`<!--]--></div><div class="mt-8 pt-6 border-t border-border flex justify-end"><div class="w-64 space-y-3"><div class="flex justify-between text-sm"><span class="text-text-secondary">Subtotal:</span><span class="font-medium text-text-primary">$${ssrInterpolate(row.total.toFixed(2))}</span></div><div class="flex justify-between text-sm"><span class="text-text-secondary">Shipping:</span><span class="font-medium text-text-primary">$0.00</span></div><div class="flex justify-between text-base pt-3 border-t border-border"><span class="font-bold text-text-primary">Total:</span><span class="font-bold text-text-primary">$${ssrInterpolate(row.total.toFixed(2))}</span></div></div></div></div><div><div class="bg-[#F9FAFB] border border-border rounded-xl p-6 h-full shadow-sm"><h4 class="text-lg font-bold text-text-primary mb-6">Order Info</h4><div class="space-y-6"><div><p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Customer Details</p><p class="font-bold text-text-primary text-sm">${ssrInterpolate(row.customer)}</p><p class="text-sm text-text-secondary mt-1">${ssrInterpolate(row.address)}</p></div><div><p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Placed On</p><p class="text-sm text-text-primary">${ssrInterpolate(row.date)} at ${ssrInterpolate(row.time)}</p></div><div><p class="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Change Status</p><div class="relative mb-4"><select class="w-full appearance-none bg-white border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary cursor-pointer shadow-sm"><option value="Pending"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Pending") : ssrLooseEqual(row.status, "Pending")) ? " selected" : ""}>Pending</option><option value="Processing"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Processing") : ssrLooseEqual(row.status, "Processing")) ? " selected" : ""}>Processing</option><option value="Delivered"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Delivered") : ssrLooseEqual(row.status, "Delivered")) ? " selected" : ""}>Delivered</option><option value="Cancelled"${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, "Cancelled") : ssrLooseEqual(row.status, "Cancelled")) ? " selected" : ""}>Cancelled</option></select>`);
          _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" }, null, _parent));
          _push(`</div><button${ssrIncludeBooleanAttr(isUpdating.value) ? " disabled" : ""} class="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors text-sm shadow-sm active:scale-[0.98] disabled:opacity-50">${ssrInterpolate(isUpdating.value ? "Updating..." : "Update Status")}</button></div></div></div></div></div></td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></tbody></table></div><div class="px-6 py-5 border-t border-border bg-[#F9FAFB] flex flex-col md:flex-row justify-between items-center gap-4"><p class="text-sm text-text-secondary">Showing <span class="font-medium text-text-primary">${ssrInterpolate(orders.value.length > 0 ? offset.value + 1 : 0)} to ${ssrInterpolate(Math.min(offset.value + limit.value, totalOrders.value))}</span> of <span class="font-medium text-text-primary">${ssrInterpolate(totalOrders.value)}</span> results</p>`);
      if (totalPages.value > 1) {
        _push(`<div class="flex items-center gap-1.5"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface transition-colors bg-white shadow-sm disabled:opacity-50">`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 rotate-90" }, null, _parent));
        _push(`</button><!--[-->`);
        ssrRenderList(displayedPages.value, (page) => {
          _push(`<button class="${ssrRenderClass([page === currentPage.value ? "bg-primary text-white font-bold" : "text-text-secondary hover:bg-surface hover:text-text-primary bg-transparent", "w-9 h-9 rounded-lg text-sm shadow-sm transition-colors font-medium"])}">${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface transition-colors bg-white shadow-sm disabled:opacity-50">`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 -rotate-90" }, null, _parent));
        _push(`</button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CCQAcgYG.js.map
