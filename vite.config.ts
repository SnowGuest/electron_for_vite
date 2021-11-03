import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electronPlugin from "vitejs-plugin-electron"
import { join, resolve } from 'path'
// import vitePugine from "vite-plugin-imp"
export default defineConfig({
  server: {
    host: "::"
  },
  root: join(__dirname, './'),
  base: './',
  plugins: [vue(), electronPlugin()],
  build: {
    // 
    cssCodeSplit: false, // 不启用css代码分割 这是个bug
    outDir: join(__dirname, 'dist/render'),
    assetsDir: '',
    rollupOptions: {
      output: {
        format: "esm", // 配置 Rollup 打包输出 CommonJs 格式 
        // cjs统一代码风格 个人喜欢esm 虽然最后会被处理为cjs 不重要了
      },
      external: ['electron'], // 告诉 Rollup 不要去打包 electron
    },
  },
  resolve: {
    alias: {
      '$': resolve(__dirname, './'),
      '@': resolve(__dirname, 'src/render'),
      'main': resolve(__dirname, 'src/main')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  optimizeDeps: {
    exclude: ['electron'], // 告诉 Vite 不要转换 electron 模块
  },
})
