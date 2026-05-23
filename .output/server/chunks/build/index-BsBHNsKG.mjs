globalThis.__timing__.logStart('Load chunks/build/index-BsBHNsKG');import { _ as __nuxt_component_0 } from './nuxt-link-Bu_9owwu.mjs';
import { _ as _sfc_main$1 } from './DataTable-BR1nB7Yg.mjs';
import { _ as _sfc_main$2 } from './ConfirmModal-2isBYOOQ.mjs';
import { ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, withModifiers, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Search, Plus, Edit2, Trash2, Star, BookOpen } from 'lucide-vue-next';
import { u as useApi } from './useApi-C-IOE6Or.mjs';
import { n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
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
import 'vue-router';

const useBooks = () => {
  const { get, post, put, del, postForm } = useApi();
  const getBooks = async ({
    search = "",
    categoryId = "",
    status = "",
    limit = 10,
    offset = 0
  } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (categoryId) params.append("category_id", categoryId);
    if (status) params.append("status", status);
    params.append("limit", limit);
    params.append("offset", offset);
    return await get(`/api/v1/admin/books?${params.toString()}`);
  };
  const getBook = async (bookId) => {
    return await get(`/api/v1/admin/books/${bookId}`);
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
const perPage = 10;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const books = ref([]);
    const categories = ref([]);
    const total = ref(0);
    const isLoading = ref(false);
    const searchQuery = ref("");
    const categoryFilter = ref("");
    const statusFilter = ref("");
    const currentPage = ref(1);
    const showDeleteModal = ref(false);
    const bookToDelete = ref(null);
    let searchTimeout = null;
    const columns = [
      { key: "book", label: "Book" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price" },
      { key: "stock", label: "Stock" },
      { key: "rating", label: "Rating" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" }
    ];
    const fetchBooks = async () => {
      var _a, _b;
      isLoading.value = true;
      try {
        const { getBooks } = useBooks();
        const res = await getBooks({
          search: searchQuery.value,
          categoryId: categoryFilter.value,
          status: statusFilter.value,
          limit: perPage,
          offset: (currentPage.value - 1) * perPage
        });
        if (res == null ? void 0 : res.ok) {
          books.value = ((_a = res.data) == null ? void 0 : _a.books) || [];
          total.value = ((_b = res.data) == null ? void 0 : _b.total) || 0;
        } else {
          handleApiError(res);
        }
      } catch (error) {
        handleApiError(error.data || error);
      } finally {
        isLoading.value = false;
      }
    };
    const debouncedFetch = () => {
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchBooks();
      }, 350);
    };
    watch([searchQuery, categoryFilter, statusFilter], debouncedFetch);
    watch(currentPage, fetchBooks);
    const toggleStatus = async (book) => {
      var _a, _b;
      try {
        const { updateBook } = useBooks();
        const nextStatus = !book.is_active;
        const res = await updateBook(book.id, { is_active: nextStatus });
        if (res == null ? void 0 : res.ok) {
          book.is_active = (_b = (_a = res.data) == null ? void 0 : _a.is_active) != null ? _b : nextStatus;
        } else {
          handleApiError(res);
        }
      } catch (error) {
        handleApiError(error.data || error);
      }
    };
    const confirmDelete = (book) => {
      bookToDelete.value = book;
      showDeleteModal.value = true;
    };
    const handleDelete = async () => {
      if (!bookToDelete.value) return;
      try {
        const { deleteBook } = useBooks();
        const res = await deleteBook(bookToDelete.value.id);
        if (res == null ? void 0 : res.ok) {
          showDeleteModal.value = false;
          bookToDelete.value = null;
          await fetchBooks();
        } else {
          handleApiError(res);
        }
      } catch (error) {
        handleApiError(error.data || error);
      }
    };
    const handleApiError = (err) => {
      console.error("Book API Error:", err);
      if ((err == null ? void 0 : err.status) === 401) {
        navigateTo("/login");
      } else if ((err == null ? void 0 : err.status) === 403) {
        alert("Admin access required");
      } else {
        alert((err == null ? void 0 : err.message) || "Cannot connect to server. Check your connection.");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_DataTable = _sfc_main$1;
      const _component_ConfirmModal = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Search books..." class="pl-9 w-64 bg-white"></div><select class="bg-white min-w-[150px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, "") : ssrLooseEqual(categoryFilter.value, "")) ? " selected" : ""}>All Categories</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, cat.id) : ssrLooseEqual(categoryFilter.value, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><select class="bg-white min-w-[120px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "") : ssrLooseEqual(statusFilter.value, "")) ? " selected" : ""}>All Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "active") : ssrLooseEqual(statusFilter.value, "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "inactive") : ssrLooseEqual(statusFilter.value, "inactive")) ? " selected" : ""}>Inactive</option></select></div>`);
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
      if (isLoading.value) {
        _push(`<div class="p-4 space-y-3"><!--[-->`);
        ssrRenderList(5, (index) => {
          _push(`<div class="h-14 bg-gray-100 rounded animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DataTable, {
          columns,
          rows: books.value,
          total: total.value,
          page: currentPage.value,
          perPage,
          onPageChange: ($event) => currentPage.value = $event
        }, {
          book: withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-4"${_scopeId}>`);
              if (row.cover_url) {
                _push2(`<img${ssrRenderAttr("src", row.cover_url)} class="w-12 h-16 object-cover rounded border border-border"${ssrRenderAttr("alt", row.title)}${_scopeId}>`);
              } else {
                _push2(`<div class="w-12 h-16 rounded border border-border bg-surface flex items-center justify-center"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(BookOpen), { class: "w-5 h-5 text-text-secondary" }, null, _parent2, _scopeId));
                _push2(`</div>`);
              }
              _push2(`<div${_scopeId}><p class="font-semibold text-text-primary"${_scopeId}>${ssrInterpolate(row.title)}</p><p class="text-sm text-text-secondary"${_scopeId}>${ssrInterpolate(row.author)}</p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-4" }, [
                  row.cover_url ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: row.cover_url,
                    class: "w-12 h-16 object-cover rounded border border-border",
                    alt: row.title
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "w-12 h-16 rounded border border-border bg-surface flex items-center justify-center"
                  }, [
                    createVNode(unref(BookOpen), { class: "w-5 h-5 text-text-secondary" })
                  ])),
                  createVNode("div", null, [
                    createVNode("p", { class: "font-semibold text-text-primary" }, toDisplayString(row.title), 1),
                    createVNode("p", { class: "text-sm text-text-secondary" }, toDisplayString(row.author), 1)
                  ])
                ])
              ];
            }
          }),
          category: withCtx(({ row }, _push2, _parent2, _scopeId) => {
            var _a2, _b;
            if (_push2) {
              _push2(`<span class="px-2 py-1 bg-surface text-text-secondary rounded text-xs"${_scopeId}>${ssrInterpolate(((_a2 = row.category) == null ? void 0 : _a2.name) || "Uncategorized")}</span>`);
            } else {
              return [
                createVNode("span", { class: "px-2 py-1 bg-surface text-text-secondary rounded text-xs" }, toDisplayString(((_b = row.category) == null ? void 0 : _b.name) || "Uncategorized"), 1)
              ];
            }
          }),
          price: withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` $${ssrInterpolate(Number(row.price || 0).toFixed(2))}`);
            } else {
              return [
                createTextVNode(" $" + toDisplayString(Number(row.price || 0).toFixed(2)), 1)
              ];
            }
          }),
          rating: withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Star), { class: "w-4 h-4 text-warning fill-warning" }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(Number(row.rating_average || 0).toFixed(1))}</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-1" }, [
                  createVNode(unref(Star), { class: "w-4 h-4 text-warning fill-warning" }),
                  createVNode("span", { class: "text-sm" }, toDisplayString(Number(row.rating_average || 0).toFixed(1)), 1)
                ])
              ];
            }
          }),
          status: withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<label class="relative inline-flex items-center cursor-pointer"${_scopeId}><input type="checkbox" class="sr-only peer"${ssrIncludeBooleanAttr(row.is_active) ? " checked" : ""}${_scopeId}><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"${_scopeId}></div></label>`);
            } else {
              return [
                createVNode("label", {
                  class: "relative inline-flex items-center cursor-pointer",
                  onClick: withModifiers(() => {
                  }, ["stop"])
                }, [
                  createVNode("input", {
                    type: "checkbox",
                    class: "sr-only peer",
                    checked: row.is_active,
                    onChange: ($event) => toggleStatus(row)
                  }, null, 40, ["checked", "onChange"]),
                  createVNode("div", { class: "w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" })
                ], 8, ["onClick"])
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
                createVNode("div", {
                  class: "flex items-center gap-2",
                  onClick: withModifiers(() => {
                  }, ["stop"])
                }, [
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
                ], 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
      if (showDeleteModal.value) {
        _push(ssrRenderComponent(_component_ConfirmModal, {
          title: "Delete Book",
          message: `Are you sure you want to delete '${(_a = bookToDelete.value) == null ? void 0 : _a.title}'? This will mark the book inactive.`,
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

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-BsBHNsKG');
//# sourceMappingURL=index-BsBHNsKG.mjs.map
