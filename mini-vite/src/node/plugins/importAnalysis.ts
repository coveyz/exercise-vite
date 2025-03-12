import path from 'path'
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string'

import { BARE_IMPORT_RE, DEFAULT_EXTENSIONS, PRE_BUNDLE_DIR, CLIENT_PUBLIC_PATH } from '../constants';
import { cleanUrl, getShortName, isJSRequest, normalizePath, isInternalRequest } from "../utils";
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
            if (!isJSRequest(id) || isInternalRequest(id)) return null;

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
                const cleanedId = cleanUrl(resolved.id);
                const mod = moduleGraph.getModuleById(cleanedId);
                let resolvedId = `/${getShortName(resolved.id, serverContext.root)}`;

                if (mod && mod.lastHMRTimeStamp > 0) {
                    resolvedId += "?t=" + mod.lastHMRTimeStamp;
                }

                return resolvedId;
            };

            const { moduleGraph } = serverContext;
            const curMod = moduleGraph.getModuleById(id)!;
            const importedModules = new Set<string>();

            // 对每一个 import 语句进行分析
            for (const importInfo of imports) {
                // 举例说明: const str = `import React from 'react'`
                // str.slice(s, e) => 'react'
                const { s: modStart, e: modEnd, n: modSource } = importInfo;

                if (!modSource) continue;
                // 静态资源
                if (modSource.endsWith('.svg')) {
                    const resolvedUrl = await resolve(modSource, id);
                    ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`);
                    continue;
                };
                // 第三方库
                if (BARE_IMPORT_RE.test(modSource)) {
                    const bundlePath = normalizePath(
                        path.join('/', PRE_BUNDLE_DIR, `${modSource}.js`)
                    );
                    ms.overwrite(modStart, modEnd, bundlePath);

                    // console.log('bundlePath=>', bundlePath);

                    importedModules.add(bundlePath);
                }
                else if (modSource.startsWith('.') || modSource.startsWith('/')) {
                    // 直接调用上下文的 resolve方法 会自动经过路径解析插件的处理
                    const resolved = await resolve(modSource, id);

                    // console.log('resolved=>', resolved);

                    if (resolved) {
                        ms.overwrite(modStart, modEnd, resolved);
                        importedModules.add(resolved);
                    }
                }
            }

            // 只对业务代码 源码注入
            if (!id.includes('node_modules')) {
                ms.prepend(
                    `import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";` +
                    `import.meta.hot = __vite__createHotContext(${JSON.stringify(
                        cleanUrl(curMod.url)
                    )});`
                )
            }

            moduleGraph.updateModuleInfo(curMod, importedModules)

            return {
                code: ms.toString(),
                map: ms.generateMap(),
            }
        }
    }
}