import path from 'path';
import { readFile } from 'fs-extra';

import { CLIENT_PUBLIC_PATH, HMR_PORT } from '../constants';
import type { Plugin } from '../plugin'
import type { ServerContext } from '../server'

export function clientInjectPlugin(): Plugin {
    let _serverContext: ServerContext;

    return {
        name: 'm-vite:client-inject',
        configureServer(serverContext) {
            _serverContext = serverContext;
        },
        resolveId(id) {
            if (id === CLIENT_PUBLIC_PATH) return { id };
            return null;
        },
        async load(id) {
            // 加载 HMR 客户端脚本
            if (id !== CLIENT_PUBLIC_PATH) return;
            const realPath = path.join(
                _serverContext.root,
                "node_modules",
                "mini-vite",
                "dist",
                "client.mjs"
            );

            const code = await readFile(realPath, "utf-8");

            return {
                // 替换占位符
                code: code.replace("__HMR_PORT__", JSON.stringify(HMR_PORT)),
            }
        },
        transformIndexHtml(raw) {
            // 插入客户端脚本
            // 即在 head 标签后面加上 <script type="module" src="/@vite/client"></script>
            // 注： 在 indexHtml 中间件里面会自动执行 transformIndexHtml 钩子
            return raw.replace(
                /(<head[^>]*>)/i,
                `$1<script type="module" src="${CLIENT_PUBLIC_PATH}"></script>`
            );
        }
    }
}