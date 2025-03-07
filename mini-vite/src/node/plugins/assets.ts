import { cleanUrl, getShortName, normalizePath, removeImportQuery } from '../utils';
import type { Plugin } from '../plugin';
import type { ServerContext } from '../server';


export function assetPlugin(): Plugin {
    let serverContext: ServerContext;

    return {
        name: 'm-vite:asset',
        configureServer(_serverContext) {
            serverContext = _serverContext;
        },
        async load(id: string) {
            const cleanId = removeImportQuery(cleanUrl(id));
            const resolveId = `/${getShortName(normalizePath(id), serverContext.root)}`;

            if (cleanId.endsWith('.svg')) {
                return {
                    code: `export default "${resolveId}"`,
                }
            }
        }
    }
}