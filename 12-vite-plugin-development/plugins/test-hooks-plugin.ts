import { Plugin } from 'vite';

export default function testHookPlugin(): Plugin {
  return {
    name: 'test-hooks-plugin',
    /** 🚚 服务器启动阶段 */
    // Vite 独有钩子
    config(config) {
      console.log('config=>')
    },
    // Vite 独有钩子
    //* 记录最终配置
    configResolved(resolveConfig) {
      console.log('resolveConfig=>')
    },
    // 通用狗子
    options(opts) {
      console.log('options')
      return opts
    },
    // Vite 独有钩子
    //* Dev Server 实例
    configureServer(server) {
      console.log('configServe=>');
      // setTimeout(() => {
      //   // 手动退出进程
      //   console.log('手动退出进程')
      //   process.kill(process.pid, 'SIGTERM')
      // }, 3000);
    },
    // 通用钩子
    buildStart() {
      console.log('buildStart=>')
    },
    /** 🚚 服务器启动阶段 */

    /** ✨ 服务器关闭阶段 */
    // 通用钩子
    buildEnd() {
      console.log('buildEnd=>')
    },
    // 通用钩子
    closeBundle() {
      console.log('closeBundle=>')
    },
    /** ✨ 服务器关闭阶段 */
  }
}