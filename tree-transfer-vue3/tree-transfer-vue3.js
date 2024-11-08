import { defineAsyncComponent as s } from "vue";
const r = /* @__PURE__ */ Object.assign({ "./tree-transfer-vue3/tree-transfer-vue3.vue": () => import("./tree-transfer-vue3-BuG4yuaA.js") }), c = (t) => {
  for (const [e, n] of Object.entries(r)) {
    const o = e.slice(e.lastIndexOf("/") + 1, e.lastIndexOf("."));
    t.component(o, s(n));
  }
};
export {
  c as default
};
