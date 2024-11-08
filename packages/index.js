import { defineAsyncComponent } from 'vue';

const components = import.meta.glob('./tree-transfer-vue3/*.vue');
const registerGlobalComponent = app => {
  for (const [key, value] of Object.entries(components)) {
    const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
    app.component(name, defineAsyncComponent(value));
  }
};

export default registerGlobalComponent;
