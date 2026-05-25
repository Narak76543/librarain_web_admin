import { _ as __nuxt_component_0 } from './nuxt-link-Bu_9owwu.mjs';
import { computed, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { ArrowLeft, BookImage } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
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

const _sfc_main$1 = {
  __name: "ImageUpload",
  __ssrInlineRender: true,
  props: {
    initialUrl: { type: String, default: null }
  },
  emits: ["file-selected"],
  setup(__props, { emit: __emit }) {
    ref(null);
    const isDragging = ref(false);
    const previewUrl = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["h-[200px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden", { "border-primary bg-primary-light": isDragging.value, "bg-surface hover:bg-gray-100": !isDragging.value && !previewUrl.value }]
      }, _attrs))}><input type="file" class="hidden" accept="image/*">`);
      if (previewUrl.value || __props.initialUrl) {
        _push(`<!--[--><img${ssrRenderAttr("src", previewUrl.value || __props.initialUrl)} class="w-full h-full object-contain" alt="Preview"><div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><span class="text-white font-medium text-sm">Change Image</span></div><!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(BookImage), { class: "w-10 h-10 text-text-secondary mb-3" }, null, _parent));
        _push(`<p class="text-sm font-medium text-text-primary">Click or drag to upload</p><p class="text-xs text-text-secondary mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p><!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageUpload.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const isEditing = computed(() => route.params.id !== "new");
    const categories = ref([]);
    const selectedCover = ref(null);
    const book = ref({
      title: "",
      author: "",
      category_id: "",
      price: "",
      stock: "",
      status: true,
      featured: false,
      description: "",
      isbn: "",
      publisher: "",
      pages: "",
      language: "English",
      published_date: "",
      cover_url: null
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ImageUpload = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-6xl" }, _attrs))}><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/books",
        class: "w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5 text-text-secondary" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-5 h-5 text-text-secondary" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h2 class="text-xl font-semibold text-text-primary">${ssrInterpolate(isEditing.value ? "Edit Book" : "Add New Book")}</h2></div><div class="flex flex-col lg:flex-row gap-6"><div class="lg:w-2/3 card"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="md:col-span-2"><label class="block text-sm font-medium text-text-secondary mb-1">Book Title</label><input type="text"${ssrRenderAttr("value", book.value.title)} class="w-full" placeholder="Enter book title"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Author</label><input type="text"${ssrRenderAttr("value", book.value.author)} class="w-full" placeholder="Enter author name"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Category</label><select class="w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(book.value.category_id) ? ssrLooseContain(book.value.category_id, "") : ssrLooseEqual(book.value.category_id, "")) ? " selected" : ""}>Select category</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(book.value.category_id) ? ssrLooseContain(book.value.category_id, cat.id) : ssrLooseEqual(book.value.category_id, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-text-secondary mb-1">ISBN</label><input type="text"${ssrRenderAttr("value", book.value.isbn)} class="w-full" placeholder="ISBN-13"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Publisher</label><input type="text"${ssrRenderAttr("value", book.value.publisher)} class="w-full" placeholder="Publisher name"></div><div class="md:col-span-2"><label class="block text-sm font-medium text-text-secondary mb-1">Description</label><textarea class="w-full h-32 py-2" placeholder="Write a short summary...">${ssrInterpolate(book.value.description)}</textarea></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Price ($)</label><input type="number" step="0.01"${ssrRenderAttr("value", book.value.price)} class="w-full" placeholder="0.00"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Stock</label><input type="number"${ssrRenderAttr("value", book.value.stock)} class="w-full" placeholder="0"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Pages</label><input type="number"${ssrRenderAttr("value", book.value.pages)} class="w-full" placeholder="Number of pages"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Language</label><select class="w-full"><option value="English"${ssrIncludeBooleanAttr(Array.isArray(book.value.language) ? ssrLooseContain(book.value.language, "English") : ssrLooseEqual(book.value.language, "English")) ? " selected" : ""}>English</option><option value="Spanish"${ssrIncludeBooleanAttr(Array.isArray(book.value.language) ? ssrLooseContain(book.value.language, "Spanish") : ssrLooseEqual(book.value.language, "Spanish")) ? " selected" : ""}>Spanish</option><option value="French"${ssrIncludeBooleanAttr(Array.isArray(book.value.language) ? ssrLooseContain(book.value.language, "French") : ssrLooseEqual(book.value.language, "French")) ? " selected" : ""}>French</option></select></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Published Date</label><input type="date"${ssrRenderAttr("value", book.value.published_date)} class="w-full"></div></div></div><div class="lg:w-1/3 flex flex-col gap-6"><div class="card"><h3 class="text-sm font-medium text-text-secondary mb-4">Cover Image</h3>`);
      _push(ssrRenderComponent(_component_ImageUpload, {
        initialUrl: book.value.cover_url,
        onFileSelected: (f) => selectedCover.value = f
      }, null, _parent));
      _push(`</div><div class="card"><h3 class="text-sm font-medium text-text-secondary mb-4">Publishing Status</h3><div class="flex items-center justify-between mb-4"><span class="text-sm font-medium text-text-primary">Active Status</span><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(book.value.status) ? ssrLooseContain(book.value.status, null) : book.value.status) ? " checked" : ""} class="sr-only peer"><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div></label></div><div class="flex items-center justify-between"><span class="text-sm font-medium text-text-primary">Featured Book</span><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(book.value.featured) ? ssrLooseContain(book.value.featured, null) : book.value.featured) ? " checked" : ""} class="sr-only peer"><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-info"></div></label></div></div><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/books",
        class: "flex-1 h-10 flex items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-text-primary hover:bg-surface transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="flex-1 btn-primary">${ssrInterpolate(isEditing.value ? "Save Changes" : "Create Book")}</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/books/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D9II2xz3.mjs.map
