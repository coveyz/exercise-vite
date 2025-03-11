import connect from 'connect';
import { blue, green } from 'picocolors';
import chokidar, { FSWatcher } from 'chokidar';

import { optimize } from '../optimizer';
import { resolvePlugins } from '../plugins';
import { createPluginContainer } from '../pluginContainer'
import { indexHTMLMiddleware } from './middlewares/indexHTML';
import { transformMiddleware } from './middlewares/transform';
import { staticMiddleware } from './middlewares/static';
import { ModuleGraph } from '../ModuleGraph';
import { createWebSocketServer } from '../ws';
import { bindingHMREvents } from '../hmr';
import { normalizePath } from '../utils'
import type { Plugin } from '../plugin'
import type { PluginContainer } from '../pluginContainer';



export interface ServerContext {
    root: string;
    pluginContainer: PluginContainer;
    app: connect.Server;
    plugins: Plugin[];
    moduleGraph: ModuleGraph;
    ws: { send: (data: any) => void, close: () => void };
    watcher: FSWatcher;
};

export async function startDevServer() {
    const app = connect();
    const root = process.cwd();
    const start = Date.now();

    const plugins = resolvePlugins();
    const pluginContainer = createPluginContainer(plugins);
    const moduleGraph = new ModuleGraph(url => pluginContainer.resolveId(url));

    const watcher = chokidar.watch(root, {
        ignored: ["**/node_modules/**", "**/.git/**"],
        ignoreInitial: true,
    });

    const ws = createWebSocketServer(app);

    const serverContext: ServerContext = {
        root: normalizePath(process.cwd()),
        pluginContainer,
        app,
        plugins,
        moduleGraph,
        ws,
        watcher,
    };

    bindingHMREvents(serverContext);

    for (const plugin of plugins) {
        if (plugin.configureServer) {
            await plugin.configureServer(serverContext);
        }
    };

    //  入口 HTML 资源
    app.use(indexHTMLMiddleware(serverContext));
    // 核心 编译逻辑
    app.use(transformMiddleware(serverContext));
    // 静态资源
    app.use(staticMiddleware(serverContext.root));

    app.listen(3000, async () => {
        await optimize(root);

        console.log(
            green("No-Bundle Service Has Started Successfully 🚀!"),
            `耗时：${Date.now() - start}ms`,
        );

        console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`);
    });
};