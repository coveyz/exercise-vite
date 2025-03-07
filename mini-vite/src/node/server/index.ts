import connect from 'connect';
import { blue, green } from 'picocolors';

import { optimize } from '../optimizer';
import { resolvePlugins } from '../plugins';
import { createPluginContainer } from '../pluginContainer'
import { indexHTMLMiddleware } from './middlewares/indexHTML';
import { transformMiddleware } from './middlewares/transform';
import { staticMiddleware } from './middlewares/static';
import type { Plugin } from '../plugin'
import type { PluginContainer } from '../pluginContainer';



export interface ServerContext {
    root: string;
    pluginContainer: PluginContainer;
    app: connect.Server;
    plugins: Plugin[]
};

export async function startDevServer() {
    const app = connect();
    const root = process.cwd();
    const start = Date.now();

    const plugins = resolvePlugins();
    const pluginContainer = createPluginContainer(plugins);

    const serverContext: ServerContext = {
        root: process.cwd(),
        pluginContainer,
        app,
        plugins,
    };

    for (const plugin of plugins) {
        if (plugin.configureServer) {
            await plugin.configureServer(serverContext);
        }
    };
    app.use(indexHTMLMiddleware(serverContext));

    app.use(transformMiddleware(serverContext));

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