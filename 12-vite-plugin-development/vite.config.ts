import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import virtualModule from './plugins/virtual-module';
import testHooks from './plugins/test-hooks-plugin';
import svgr from './plugins/svgt';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtualModule(), svgr({ defaultExport: 'component' }), testHooks()],
})
