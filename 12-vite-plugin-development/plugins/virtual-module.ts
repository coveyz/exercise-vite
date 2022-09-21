import { Plugin, ResolvedConfig } from 'vite';

// 虚拟模块 名称
const virtualFibModuleId = 'virtual:fib';
// Vite 中约定于虚拟模块，解析后的路径需要加上 '\0' 前缀
const resolveFibModuleId = '\0' + virtualFibModuleId

const virtualEnvModuleId = 'virtual:env'
const resolveEnvModuleId = '\0' + virtualEnvModuleId


export default function virtualFibModulePlugin(): Plugin {
  let config: ResolvedConfig | null = null;
  return {
    name: 'vite-plugin-virtual-module',
    // 记录最终配置
    configResolved(c: ResolvedConfig) {
      config = c
    },
    resolveId(id) {
      if (id === virtualFibModuleId) {
        return resolveFibModuleId
      }
      if (id === virtualEnvModuleId) {
        return resolveEnvModuleId
      }
    },
    load(id) {
      // 加载虚拟模块
      if (id === resolveFibModuleId) {
        return `export default function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n - 2); }`
      }

      if (id === resolveEnvModuleId) {
        return `export default ${JSON.stringify(config!.env)}`
      }
    }
  }
}
