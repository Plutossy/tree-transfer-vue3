import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const VitePluginStyleInject = (styleId = '') => {
  let styleCode = '';

  return {
    name: 'vite-plugin-style-inject',
    apply: 'build', // 应用模式
    enforce: 'post', // 作用阶段
    generateBundle(_, bundle) {
      // 遍历bundle
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key]; // 拿到文件名对应的值
          // 判断+提取+移除
          if (chunk.type === 'asset' && chunk.fileName.includes('.css')) {
            styleCode += chunk.source;
            delete bundle[key];
          }
        }
      }

      // 重新遍历bundle，一次遍历无法同时实现提取注入，例如'style.css'是bundle的最后一个键
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key];
          // 判断是否是JS文件名的chunk
          if (chunk.type === 'chunk' && chunk.fileName.match(/.[cm]?js$/) !== null && !chunk.fileName.includes('polyfill')) {
            const initialCode = chunk.code; // 保存原有代码
            // 重新赋值
            chunk.code = "(function(){ try {var elementStyle = document.createElement('style'); elementStyle.appendChild(document.createTextNode(";
            chunk.code += JSON.stringify(styleCode.trim());
            chunk.code += ')); ';
            // + 判断是否添加id
            if (styleId.length > 0) chunk.code += ` elementStyle.id = "${styleId}"; `;
            chunk.code += "document.head.appendChild(elementStyle);} catch(e) {console.error('vite-plugin-css-injected-by-js', e);} })();";
            // 拼接原有代码
            chunk.code += initialCode;
            break; // 一个bundle插入一次即可
          }
        }
      }
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VitePluginStyleInject('tree-transfer-vue3')], // 注入插件
  build: {
    outDir: 'tree-transfer-vue3', // 输出文件名称
    lib: {
      entry: './packages/index.js', // 指定组件编译入口文件
      name: 'tree-transfer-vue3', // 库名称
      fileName: 'tree-transfer-vue3', // 输出文件名
    }, //库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    }, // rollup打包配置
    minify: 'terser', // 启用 terser 压缩
    terserOptions: {
      compress: {
        drop_console: true, // 删除所有 console
        drop_debugger: true, // 删除 debugger
      },
    },
  },
});
