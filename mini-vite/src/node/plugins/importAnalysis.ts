import path from 'path'
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string'

import { BARE_IMPORT_RE, DEFAULT_EXTENSIONS, PRE_BUNDLE_DIR } from '../constants';
import { cleanUrl, getShortName, isJSRequest, normalizePath } from "../utils";
import type { Plugin } from '../plugin'
import type { ServerContext } from '../server';


// /** import 分析插件 */
export function importAnalysisPlugin(): Plugin {
    let serverContext: ServerContext;

    return {
        name: 'm-vite:import-analysis',
        configureServer(_serverContext) {
            serverContext = _serverContext;
        },
        async transform(code: string, id: string) {
            // console.log('importAnalysisPlugin-transform=>', { code, id });
            // 只处理 JS请求
            if (!isJSRequest(id)) return null;

            await init;
            // 解析 import
            const [imports] = parse(code);
            const ms = new MagicString(code);


            const resolve = async (id: string, importer: string) => {
                const resolved = await serverContext.pluginContainer.resolveId(
                    id,
                    normalizePath(importer)
                );
                if (!resolved) return;

                let resolvedId = `/${getShortName(resolved.id, serverContext.root)}`;

                return resolvedId;
            };


            // 对每一个 import 语句进行分析
            for (const importInfo of imports) {
                // 举例说明: const str = `import React from 'react'`
                // str.slice(s, e) => 'react'
                const { s: modStart, e: modEnd, n: modSource } = importInfo;

                if (!modSource) continue;
                // 静态资源
                // if (modSource.endsWith('.svg')) {
                //     const resolvedUrl = await resolve(modSource, id);
                //     ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`);
                //     continue;
                // };
                // 第三方库
                if (BARE_IMPORT_RE.test(modSource)) {
                    const bundlePath = normalizePath(
                        path.join('/', PRE_BUNDLE_DIR, `${modSource}.js`)
                    );
                    ms.overwrite(modStart, modEnd, bundlePath);
                }
                else if (modSource.startsWith('.') || modSource.startsWith('/')) {
                    // 直接调用上下文的 resolve方法 会自动经过路径解析插件的处理
                    const resolved = await resolve(modSource, id);

                    if (resolved) {
                        ms.overwrite(modStart, modEnd, resolved);
                    }
                }
            }

            return {
                code: ms.toString(),
                map: ms.generateMap(),
            }
        }
    }
}