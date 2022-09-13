import path from 'path';
import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';

import autoprefixer from 'autoprefixer';
import windi from 'vite-plugin-windicss';
import viteEslint from 'vite-plugin-eslint';
import viteStylelint from '@amatlash/vite-plugin-stylelint';
import svg from 'vite-plugin-svgr';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'; // 雪碧图
// import moduleName from '';

// 全局 scss 文件路径
// normalizePath 解决window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/styles/variable.scss'));

const isProduction = process.env.NODE_ENV === 'production'
const CDN_URL = 'test'

// https://vitejs.dev/config/
export default defineConfig({
  // root: path.join(__dirname, 'src'), // 手动指定根目录位置
  resolve: {
    // 别名配置
    alias: {
      "@assets": path.join(__dirname, 'src/assets')
      // '@': path.join(__dirname, 'src')
    }
  },
  plugins: [
    svg(),
    react({
      babel: {
        plugins: [
          // 适配 styled-component
          'babel-plugin-styled-components',
          // 适配 emotion
          '@emotion/babel-plugin'
        ]
      }
    }),
    windi(),
    viteEslint(),
    viteStylelint({
      // 对 某些文件进行排查
      exclude: /windicss|node_modules/
    }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    })
  ],
  // css 相关配置
  css: {
    modules: {
      // generateScopedName 属性来对生成的类名进行自定义
      // 其中 name 表示文件名， local 表示类名
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    },
    // 传递给 CSS 预处理器
    preprocessorOptions: {
      scss: {
        // additionalData 在每一个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    },
    // 进行 PostCSS 配置
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    }
  },
  // base: isProduction ? CDN_URL : '/'
  build: {
    assetsInlineLimit: 8 * 1024
  },
  //todo 
  server: {
    force: true
  },
  optimizeDeps: {
    // entries: ['./src/main.tsx'] // 为一个字符串数组
    entries: ['**/*.vue'], // 将所有的 .vue 文件作为扫描入口
    include: ['loadsh-es', 'vue', 'object-assign'], // 
    esbuildOptions: {
      plugins: [
        // 加入 Esbuild 插件
      ] 
    }
  }
});
