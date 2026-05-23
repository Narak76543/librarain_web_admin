import { _ as _sfc_main$1 } from './StatusBadge-ayQFkwOT.mjs';
import { _ as _sfc_main$2 } from './ConfirmModal-2isBYOOQ.mjs';
import { ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-vue-next';
import { u as useApi } from './useApi-B4ykdJwO.mjs';
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

const useCategories = () => {
  const { get, post, put, del } = useApi();
  const getCategories = async () => {
    return await get("/api/v1/categories");
  };
  const createCategory = async (payload) => {
    return await post("/api/v1/categories", payload);
  };
  const updateCategory = async (categoryId, payload) => {
    return await put(`/api/v1/categories/${categoryId}`, payload);
  };
  const deleteCategory = async (categoryId) => {
    return await del(`/api/v1/categories/${categoryId}`);
  };
  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = ref([]);
    const isLoading = ref(false);
    const searchQuery = ref("");
    const showFormModal = ref(false);
    const showDeleteModal = ref(false);
    const isEditing = ref(false);
    const catToDelete = ref(null);
    const form = reactive({
      id: "",
      name: "",
      slug: "",
      is_active: true
    });
    const filteredCategories = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) return categories.value;
      return categories.value.filter((category) => {
        return [category.name, category.slug].filter(Boolean).some((value) => value.toLowerCase().includes(query));
      });
    });
    const fetchCategories = async () => {
      isLoading.value = true;
      try {
        const { getCategories } = useCategories();
        const res = await getCategories();
        if (res == null ? void 0 : res.ok) {
          categories.value = (res.data || []).map((category) => ({
            ...category,
            books_count: category.books_count || category.books || 0
          }));
        } else {
          handleApiError(res);
        }
      } catch (err) {
        handleApiError(err.data || err);
      } finally {
        isLoading.value = false;
      }
    };
    const handleDelete = async () => {
      if (!catToDelete.value) return;
      try {
        const { deleteCategory } = useCategories();
        await deleteCategory(catToDelete.value.id);
        showDeleteModal.value = false;
        catToDelete.value = null;
        await fetchCategories();
      } catch (err) {
        handleApiError(err.data || err);
      }
    };
    const handleApiError = (err) => {
      console.error("Category API Error:", err);
      if ((err == null ? void 0 : err.status) === 401) {
        navigateTo("/login");
      } else if ((err == null ? void 0 : err.status) === 403) {
        alert("Admin access required");
      } else {
        alert((err == null ? void 0 : err.message) || "Cannot connect to server. Check your connection.");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_StatusBadge = _sfc_main$1;
      const _component_ConfirmModal = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
      _push(`<input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Search categories..." class="pl-9 w-64 bg-white"></div><button class="btn-primary">`);
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Add Category </button></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`);
      if (isLoading.value) {
        _push(`<!--[-->`);
        ssrRenderList(6, (index) => {
          _push(`<div class="card"><div class="h-5 w-32 bg-gray-100 rounded animate-pulse mb-3"></div><div class="h-4 w-20 bg-gray-100 rounded animate-pulse mb-12"></div><div class="h-px bg-border mb-4"></div><div class="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(filteredCategories.value, (cat) => {
          _push(`<div class="card flex flex-col hover:border-primary transition-colors"><div class="flex items-start justify-between mb-4"><div><h3 class="text-lg font-semibold text-text-primary">${ssrInterpolate(cat.name)}</h3><p class="text-sm text-text-secondary mt-1">/${ssrInterpolate(cat.slug)}</p></div>`);
          _push(ssrRenderComponent(_component_StatusBadge, {
            status: cat.is_active
          }, null, _parent));
          _push(`</div><div class="flex-1"></div><div class="flex items-center justify-between mt-6 pt-4 border-t border-border"><span class="px-2.5 py-1 bg-primary-light text-primary rounded-full text-xs font-semibold">${ssrInterpolate(cat.books_count || 0)} Books </span><div class="flex items-center gap-2"><button class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-info transition-colors">`);
          _push(ssrRenderComponent(unref(Edit2), { class: "w-4 h-4" }, null, _parent));
          _push(`</button><button class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface text-text-secondary hover:text-error transition-colors">`);
          _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      if (!isLoading.value && filteredCategories.value.length === 0) {
        _push(`<div class="card text-center py-12 text-text-secondary"> No categories found </div>`);
      } else {
        _push(`<!---->`);
      }
      if (showFormModal.value) {
        _push(`<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div class="card w-full max-w-md animate-in fade-in zoom-in duration-200"><div class="flex items-center justify-between mb-6"><h3 class="text-lg font-semibold text-text-primary">${ssrInterpolate(isEditing.value ? "Edit Category" : "Add Category")}</h3><button class="text-text-secondary hover:text-text-primary">`);
        _push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
        _push(`</button></div><form class="space-y-4"><div><label class="block text-sm font-medium text-text-secondary mb-1">Name</label><input type="text"${ssrRenderAttr("value", form.name)} class="w-full" required placeholder="e.g. Science Fiction"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Slug</label><input type="text"${ssrRenderAttr("value", form.slug)} class="w-full" required placeholder="e.g. science-fiction"></div><div class="flex items-center justify-between pt-2"><span class="text-sm font-medium text-text-secondary">Status</span><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer"${ssrIncludeBooleanAttr(Array.isArray(form.is_active) ? ssrLooseContain(form.is_active, null) : form.is_active) ? " checked" : ""}><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div></label></div><div class="flex justify-end gap-3 mt-6 pt-4 border-t border-border"><button type="button" class="h-10 px-4 rounded-lg font-medium text-sm text-text-primary hover:bg-surface transition-colors"> Cancel </button><button type="submit" class="btn-primary">${ssrInterpolate(isEditing.value ? "Save Changes" : "Create")}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showDeleteModal.value) {
        _push(ssrRenderComponent(_component_ConfirmModal, {
          title: "Delete Category",
          message: `Are you sure you want to delete '${(_a = catToDelete.value) == null ? void 0 : _a.name}'? This will also affect ${((_b = catToDelete.value) == null ? void 0 : _b.books_count) || 0} books.`,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C0xcub39.mjs.map
