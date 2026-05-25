import { computed, mergeProps, createVNode, resolveDynamicComponent, useSSRContext, unref, withCtx, createTextVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { BookOpen, ShoppingBag, Users, DollarSign } from "lucide-vue-next";
import { _ as __nuxt_component_0 } from "./nuxt-link-Bu_9owwu.js";
import { _ as _sfc_main$2 } from "./DataTable-BR1nB7Yg.js";
import { _ as _sfc_main$3 } from "./StatusBadge-ayQFkwOT.js";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/hookable/dist/index.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/unctx/dist/index.mjs";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "D:/mobile_assignment/web_s2_nuxt/bookstore-admin/node_modules/defu/dist/defu.mjs";
const _sfc_main$1 = {
  __name: "StatsCard",
  __ssrInlineRender: true,
  props: {
    title: String,
    value: [String, Number],
    type: String
  },
  setup(__props) {
    const props = __props;
    const icon = computed(() => {
      if (props.type === "books") return BookOpen;
      if (props.type === "orders") return ShoppingBag;
      if (props.type === "users") return Users;
      if (props.type === "revenue") return DollarSign;
      return BookOpen;
    });
    const colorClass = computed(() => {
      if (props.type === "books") return "bg-blue-100 text-blue-600";
      if (props.type === "orders") return "bg-amber-100 text-amber-600";
      if (props.type === "users") return "bg-purple-100 text-purple-600";
      if (props.type === "revenue") return "bg-green-100 text-green-600";
      return "bg-gray-100 text-gray-600";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card flex items-center gap-4" }, _attrs))}><div class="${ssrRenderClass([colorClass.value, "w-12 h-12 rounded-full flex items-center justify-center"])}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(icon.value), { class: "w-6 h-6" }, null), _parent);
      _push(`</div><div><p class="text-sm text-text-secondary">${ssrInterpolate(__props.title)}</p><p class="text-2xl font-semibold text-text-primary">${ssrInterpolate(__props.value)}</p></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatsCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const useMockData = () => {
  const stats = {
    totalBooks: 243,
    totalOrders: 89,
    totalUsers: 512,
    totalRevenue: 12480
  };
  const books = [
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      category: "Fiction",
      price: 18.5,
      stock: 45,
      rating: 4.2,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "2",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Fiction",
      price: 14.2,
      stock: 30,
      rating: 4.5,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "3",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Help",
      price: 16.99,
      stock: 100,
      rating: 4.8,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "4",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      category: "History",
      price: 19.99,
      stock: 60,
      rating: 4.6,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "5",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      category: "Science",
      price: 12.99,
      stock: 25,
      rating: 4.7,
      status: false,
      cover: "https://via.placeholder.com/48x64"
    }
  ];
  const categories = [
    { id: "1", name: "Fiction", slug: "fiction", books: 89, status: true },
    { id: "2", name: "Non-Fiction", slug: "non-fiction", books: 45, status: true },
    { id: "3", name: "Science", slug: "science", books: 32, status: true },
    { id: "4", name: "History", slug: "history", books: 28, status: true },
    { id: "5", name: "Self-Help", slug: "self-help", books: 41, status: true },
    { id: "6", name: "Biography", slug: "biography", books: 18, status: false }
  ];
  const orders = [
    {
      id: "#1042",
      customer: "Sarat Narak",
      email: "sarat@gmail.com",
      books: 3,
      total: 42.97,
      status: "Delivered",
      date: "May 15, 2026"
    },
    {
      id: "#1041",
      customer: "Dara Chan",
      email: "dara@gmail.com",
      books: 1,
      total: 18.5,
      status: "Processing",
      date: "May 14, 2026"
    },
    {
      id: "#1040",
      customer: "Sokha Lim",
      email: "sokha@gmail.com",
      books: 2,
      total: 31.99,
      status: "Pending",
      date: "May 13, 2026"
    },
    {
      id: "#1039",
      customer: "Maly Pich",
      email: "maly@gmail.com",
      books: 4,
      total: 67.5,
      status: "Delivered",
      date: "May 12, 2026"
    },
    {
      id: "#1038",
      customer: "Rith Sok",
      email: "rith@gmail.com",
      books: 1,
      total: 14.2,
      status: "Cancelled",
      date: "May 11, 2026"
    }
  ];
  const users = [
    {
      id: "1",
      name: "Sarat Narak",
      email: "sarat@gmail.com",
      phone: "070850965",
      role: "Admin",
      status: true,
      joined: "Jan 21, 2026"
    },
    {
      id: "2",
      name: "Dara Chan",
      email: "dara@gmail.com",
      phone: "012345678",
      role: "User",
      status: true,
      joined: "Feb 10, 2026"
    },
    {
      id: "3",
      name: "Sokha Lim",
      email: "sokha@gmail.com",
      phone: "096789012",
      role: "User",
      status: true,
      joined: "Mar 5, 2026"
    },
    {
      id: "4",
      name: "Maly Pich",
      email: "maly@gmail.com",
      phone: "078901234",
      role: "User",
      status: false,
      joined: "Apr 1, 2026"
    }
  ];
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    orders: [5, 12, 8, 15, 10, 20, 14],
    revenue: [120, 340, 180, 420, 290, 580, 390]
  };
  return { stats, books, categories, orders, users, chartData };
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { stats, chartData, orders, categories } = useMockData();
    const recentOrders = computed(() => orders.slice(0, 5));
    const orderColumns = [
      { key: "id", label: "Order ID" },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Date" },
      { key: "total", label: "Total" },
      { key: "status", label: "Status" }
    ];
    const maxOrder = Math.max(...chartData.orders);
    const points = computed(() => {
      return chartData.orders.map((val, idx) => {
        return {
          x: idx * 110 + 20,
          y: 200 - val / maxOrder * 180 + 10
        };
      });
    });
    const linePoints = computed(() => {
      return points.value.map((p) => `${p.x},${p.y}`).join(" ");
    });
    const categoryColors = ["#059669", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#6B7280"];
    const donutSlices = computed(() => {
      let total = categories.reduce((sum, cat) => sum + cat.books, 0);
      let currentAngle = 0;
      return categories.map((cat, idx) => {
        const angle = cat.books / total * Math.PI * 2;
        const startX = Math.sin(currentAngle) * 100;
        const startY = -Math.cos(currentAngle) * 100;
        currentAngle += angle;
        const endX = Math.sin(currentAngle) * 100;
        const endY = -Math.cos(currentAngle) * 100;
        const largeArcFlag = angle > Math.PI ? 1 : 0;
        return {
          label: cat.name,
          value: cat.books,
          color: categoryColors[idx % categoryColors.length],
          path: `M 0 0 L ${startX} ${startY} A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StatsCard = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_DataTable = _sfc_main$2;
      const _component_StatusBadge = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
      _push(ssrRenderComponent(_component_StatsCard, {
        title: "Total Books",
        value: unref(stats).totalBooks,
        type: "books"
      }, null, _parent));
      _push(ssrRenderComponent(_component_StatsCard, {
        title: "Total Orders",
        value: unref(stats).totalOrders,
        type: "orders"
      }, null, _parent));
      _push(ssrRenderComponent(_component_StatsCard, {
        title: "Total Users",
        value: unref(stats).totalUsers,
        type: "users"
      }, null, _parent));
      _push(ssrRenderComponent(_component_StatsCard, {
        title: "Total Revenue",
        value: `$${unref(stats).totalRevenue.toLocaleString()}`,
        type: "revenue"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="card flex flex-col"><h3 class="text-lg font-semibold text-text-primary mb-4">Orders Overview</h3><div class="flex-1 relative min-h-[250px] w-full"><svg viewBox="0 0 700 250" class="w-full h-full" preserveAspectRatio="none"><!--[-->`);
      ssrRenderList(5, (i) => {
        _push(`<line x1="0"${ssrRenderAttr("y1", (i - 1) * 50 + 10)} x2="700"${ssrRenderAttr("y2", (i - 1) * 50 + 10)} stroke="#E5E7EB" stroke-width="1"></line>`);
      });
      _push(`<!--]--><polyline fill="none" stroke="#059669" stroke-width="3"${ssrRenderAttr("points", linePoints.value)} stroke-linejoin="round" stroke-linecap="round"></polyline><!--[-->`);
      ssrRenderList(points.value, (point, idx) => {
        _push(`<circle${ssrRenderAttr("cx", point.x)}${ssrRenderAttr("cy", point.y)} r="4" fill="#059669" stroke="#FFFFFF" stroke-width="2"></circle>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(chartData).labels, (label, idx) => {
        _push(`<text${ssrRenderAttr("x", idx * 110 + 20)} y="240" fill="#6B7280" font-size="12" font-family="sans-serif">${ssrInterpolate(label)}</text>`);
      });
      _push(`<!--]--></svg></div></div><div class="card flex flex-col"><h3 class="text-lg font-semibold text-text-primary mb-4">Books by Category</h3><div class="flex-1 flex items-center justify-center gap-8"><svg viewBox="0 0 200 200" class="w-48 h-48"><g transform="translate(100, 100)"><!--[-->`);
      ssrRenderList(donutSlices.value, (slice, idx) => {
        _push(`<path${ssrRenderAttr("d", slice.path)}${ssrRenderAttr("fill", slice.color)}></path>`);
      });
      _push(`<!--]--><circle cx="0" cy="0" r="60" fill="#FFFFFF"></circle><text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="600" fill="#1C1C1E">${ssrInterpolate(unref(stats).totalBooks)}</text><text x="0" y="20" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#6B7280"> Books </text></g></svg><div class="space-y-2"><!--[-->`);
      ssrRenderList(donutSlices.value, (slice, idx) => {
        _push(`<div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: slice.color })}"></div><span class="text-sm text-text-secondary">${ssrInterpolate(slice.label)}</span><span class="text-sm font-semibold text-text-primary ml-auto">${ssrInterpolate(slice.value)}</span></div>`);
      });
      _push(`<!--]--></div></div></div></div><div class="card !p-0 overflow-hidden"><div class="p-6 border-b border-border flex justify-between items-center"><h3 class="text-lg font-semibold text-text-primary">Recent Orders</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/orders",
        class: "text-sm text-primary hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View All`);
          } else {
            return [
              createTextVNode("View All")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_DataTable, {
        columns: orderColumns,
        rows: recentOrders.value
      }, {
        status: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.status
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StatusBadge, {
                status: row.status
              }, null, 8, ["status"])
            ];
          }
        }),
        total: withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` $${ssrInterpolate(row.total.toFixed(2))}`);
          } else {
            return [
              createTextVNode(" $" + toDisplayString(row.total.toFixed(2)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-8vOqjs9U.js.map
