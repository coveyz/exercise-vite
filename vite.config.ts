import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // root: path.join(__dirname, 'src'), // 手动指定根目录位置
  plugins: [react()],
})
