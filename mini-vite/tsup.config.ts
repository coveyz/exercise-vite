import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        index: 'src/node/cli.ts',
        client: 'src/client/client.ts'
    },
    format: ['cjs', 'esm'],
    target: 'es2020',
    sourcemap:  true,
    // 没有拆包的需求，关闭拆包能力
    splitting: false
})