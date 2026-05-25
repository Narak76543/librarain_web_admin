import { _ as __nuxt_component_0 } from "./nuxt-link-DjCrawh9.js";
import { _ as _sfc_main$1 } from "./DataTable-BR1nB7Yg.js";
import { _ as _sfc_main$2 } from "./ConfirmModal-2isBYOOQ.js";
import { ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Search, Plus, Edit2, Trash2, Star } from "lucide-vue-next";
import { u as useApi } from "./useApi-B4ykdJwO.js";
import "/Users/macme/Desktop/librarain_web_admin/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/macme/Desktop/librarain_web_admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/macme/Desktop/librarain_web_admin/node_modules/hookable/dist/index.mjs";
import "/Users/macme/Desktop/librarain_web_admin/node_modules/unctx/dist/index.mjs";
import "/Users/macme/Desktop/librarain_web_admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/macme/Desktop/librarain_web_admin/node_modules/defu/dist/defu.mjs";
const useBooks = () => {
  const { get, post, put, del, postForm } = useApi();
  const getBooks = async ({
    search = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    limit = 10,
    offset = 0
  } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    params.append("limit", limit);
    params.append("offset", offset);
    return await get(`/api/v1/books?${params.toString()}`);
  };
  const getBook = async (bookId) => {
    return await get(`/api/v1/books/${bookId}`);
  };
  const createBook = async (payload) => {
    return await post("/api/v1/books", payload);
  };
  const updateBook = async (bookId, payload) => {
    return await put(`/api/v1/books/${bookId}`, payload);
  };
  const deleteBook = async (bookId) => {
    return await del(`/api/v1/books/${bookId}`);
  };
  const uploadCover = async (bookId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return await postForm(`/api/v1/books/${bookId}/cover`, formData);
  };
  return {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    uploadCover
  };
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { getBooks, updateBook, deleteBook } = useBooks();
    const books = ref([]);
    const categories = ref([]);
    const totalBooks = ref(0);
    const currentPage = ref(1);
    const perPage = ref(10);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedStatus = ref("");
    const fetchBooks = async () => {
      const offset = (currentPage.value - 1) * perPage.value;
      const res = await getBooks({
        search: searchQuery.value,
        category: selectedCategory.value,
        limit: perPage.value,
        offset
      });
      if (res && res.ok) {
        books.value = res.data.books.map((b) => ({
          ...b,
          cover: b.cover_url || "https://via.placeholder.com/48x64",
          category: b.category?.name || "Uncategorized",
          price: Number(b.price) || 0,
          stock: Number(b.stock) || 0,
          rating: Number(b.rating_average) || 0,
          status: b.is_active
        }));
        totalBooks.value = res.data.total;
      }
    };
    watch([searchQuery, selectedCategory, selectedStatus], () => {
      currentPage.value = 1;
      fetchBooks();
    });
    const onPageChange = (page) => {
      currentPage.value = page;
      fetchBooks();
    };
    const toggleStatus = async (row) => {
      const newStatus = !row.status;
      const res = await updateBook(row.id, { is_active: newStatus });
      if (res && res.ok) {
        row.status = newStatus;
      } else {
        fetchBooks();
      }
    };
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
    const handleDelete = async () => {
      if (bookToDelete.value) {
        await deleteBook(bookToDelete.value.id);
        fetchBooks();
      }
      showDeleteModal.value = false;
      bookToDelete.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_DataTable = _sfc_main$1;
      const _component_ConfirmModal = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search books..." class="pl-9 w-64 bg-white"></div><select class="bg-white min-w-[150px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, "") : ssrLooseEqual(selectedCategory.value, "")) ? " selected" : ""}>All Categories</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.slug)}${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, cat.slug) : ssrLooseEqual(selectedCategory.value, cat.slug)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><select class="bg-white min-w-[120px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, "") : ssrLooseEqual(selectedStatus.value, "")) ? " selected" : ""}>All Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, "active") : ssrLooseEqual(selectedStatus.value, "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, "inactive") : ssrLooseEqual(selectedStatus.value, "inactive")) ? " selected" : ""}>Inactive</option></select></div>`);
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
        rows: books.value,
        total: totalBooks.value,
        page: currentPage.value,
        perPage: perPage.value,
        onPageChange
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
                  checked: row.status,
                  onChange: ($event) => toggleStatus(row)
                }, null, 40, ["checked", "onChange"]),
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
          message: `Are you sure you want to delete '${bookToDelete.value?.title}'? This action cannot be undone.`,
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BxbVVT9n.js.map
