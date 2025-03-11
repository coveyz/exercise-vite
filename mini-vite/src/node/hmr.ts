import { blue, green } from 'picocolors';

import { getShortName } from './utils';
import type { ServerContext } from './server';


export function bindingHMREvents(serverContext: ServerContext) {

    const { watcher, ws, root } = serverContext;

    watcher.on('change', async (file) => {
        console.log(`✨${blue("[hmr]")} ${green(file)} changed`);
        const { moduleGraph } = serverContext;
        // 清除 模块依赖图中的缓存
        await moduleGraph.invalidateModule(file);

        ws.send({
            type: 'update',
            updates: [
                {
                    type: 'js-update',
                    timestamp: Date.now(),
                    path: `/${getShortName(file, root)}`,
                    acceptedPath: `/${getShortName(file, root)}`
                }
            ]
        })
    });

};