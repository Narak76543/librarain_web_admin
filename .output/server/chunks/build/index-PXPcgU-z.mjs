import { _ as __nuxt_component_0 } from './nuxt-link-Bu_9owwu.mjs';
import { _ as _sfc_main$1 } from './DataTable-BR1nB7Yg.mjs';
import { _ as _sfc_main$2 } from './ConfirmModal-2isBYOOQ.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Search, Plus, Edit2, Trash2, Star } from 'lucide-vue-next';
import { u as useMockData } from './useMockData-eX352thy.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { books, categories } = useMockData();
    const columns = [
      { key: "book", label: "Book" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price" },
      { key: "stock", label: "Stock" },
      { key: "rating", label: "Rating" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" }
    ];
    const showDeleteModal = ref(false);
    const bookToDelete = ref(null);
    const confirmDelete = (book) => {
      bookToDelete.value = book;
      showDeleteModal.value = true;
    };
    const handleDelete = () => {
      showDeleteModal.value = false;
      bookToDelete.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_DataTable = _sfc_main$1;
      const _component_ConfirmModal = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text" placeholder="Search books..." class="pl-9 w-64 bg-white"></div><select class="bg-white min-w-[150px]"><option value="">All Categories</option><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><select class="bg-white min-w-[120px]"><option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/books/new",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "w-4 h-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Add Book `);
          } else {
            return [
              createVNode(unref(Plus), { class: "w-4 h-4 mr-2" }),
              createTextVNode(" Add Book ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card !p-0 overflow-hidden">`);
      _push(ssrRenderComponent(_component_DataTable, {
        columns,
        rows: unref(books),
        total: 243,
        page: 1,
        perPage: 10
      }, {
        book: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-4"${_scopeId}><img${ssrRenderAttr("src", row.cover)} class="w-12 h-16 object-cover rounded border border-border"${_scopeId}><div${_scopeId}><p class="font-semibold text-text-primary"${_scopeId}>${ssrInterpolate(row.title)}</p><p class="text-sm text-text-secondary"${_scopeId}>${ssrInterpolate(row.author)}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-4" }, [
                createVNode("img", {
                  src: row.cover,
                  class: "w-12 h-16 object-cover rounded border border-border"
                }, null, 8, ["src"]),
                createVNode("div", null, [
                  createVNode("p", { class: "font-semibold text-text-primary" }, toDisplayString(row.title), 1),
                  createVNode("p", { class: "text-sm text-text-secondary" }, toDisplayString(row.author), 1)
                ])
              ])
            ];
          }
        }),
        category: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="px-2 py-1 bg-surface text-text-secondary rounded text-xs"${_scopeId}>${ssrInterpolate(row.category)}</span>`);
          } else {
            return [
              createVNode("span", { class: "px-2 py-1 bg-surface text-text-secondary rounded text-xs" }, toDisplayString(row.category), 1)
            ];
          }
        }),
        price: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` $${ssrInterpolate(row.price.toFixed(2))}`);
          } else {
            return [
              createTextVNode(" $" + toDisplayString(row.price.toFixed(2)), 1)
            ];
          }
        }),
        rating: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-1"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-warning fill-warning" }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(row.rating)}</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-1" }, [
                createVNode(unref(Star), { class: "w-4 h-4 text-warning fill-warning" }),
                createVNode("span", { class: "text-sm" }, toDisplayString(row.rating), 1)
              ])
            ];
          }
        }),
        status: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label class="relative inline-flex items-center cursor-pointer"${_scopeId}><input type="checkbox" class="sr-only peer"${ssrIncludeBooleanAttr(row.status) ? " checked" : ""}${_scopeId}><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"${_scopeId}></div></label>`);
          } else {
            return [
              createVNode("label", { class: "relative inline-flex items-center cursor-pointer" }, [
                createVNode("input", {
                  type: "checkbox",
                  class: "sr-only peer",
                  checked: row.status
                }, null, 8, ["checked"]),
                createVNode("div", { class: "w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" })
              ])
            ];
          }
        }),
        actions: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/books/${row.id}`,
              class: "w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-info transition-colors"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Edit2), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Edit2), { class: "w-4 h-4" })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<button class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-error transition-colors"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(`</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-2" }, [
                createVNode(_component_NuxtLink, {
                  to: `/books/${row.id}`,
                  class: "w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-info transition-colors"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(Edit2), { class: "w-4 h-4" })
                  ]),
                  _: 1
                }, 8, ["to"]),
                createVNode("button", {
                  onClick: ($event) => confirmDelete(row),
                  class: "w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-error transition-colors"
                }, [
                  createVNode(unref(Trash2), { class: "w-4 h-4" })
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (showDeleteModal.value) {
        _push(ssrRenderComponent(_component_ConfirmModal, {
          title: "Delete Book",
          message: `Are you sure you want to delete '${(_a = bookToDelete.value) == null ? void 0 : _a.title}'? This action cannot be undone.`,
          confirmLabel: "Delete",
          onConfirm: handleDelete,
          onCancel: ($event) => showDeleteModal.value = false
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/books/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-PXPcgU-z.mjs.map
