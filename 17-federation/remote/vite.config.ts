import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //* 模块联邦配置
    federation(
      {
        name: "remote_app",
        filename: "remoteEntry.js",
        //* 导出模块声明
        exposes: {
          "./Button": "./src/components/Button.js",
          // "./App": "./src/App.vue",
          "./App": "./src/App.vue",
          "./utils": './src/utils.ts'
        },
        // 共享依赖声明
        shared: ['vue']
      }
    )
  ],
  //* 打包配置
  build: {
    target: "esnext"
  }
})
