import path from 'path';
import resolve from 'resolve';
import { pathExists } from 'fs-extra';

import { DEFAULT_EXTENSIONS } from '../constants';
import { cleanUrl, normalizePath } from '../utils';
import type { Plugin } from '../plugin';
import type { ServerContext } from '../server';

// /** 路径解析 */
export function resolvePlugin(): Plugin {
    let serverContext: ServerContext;

    return {
        name: 'm-vite:resolve',
        configureServer(_serverContext) {
            // 服务端 保存上下文
            serverContext = _serverContext;
        },
        async resolveId(id: string, importer?: string) {
            // console.log('resolvePlugin=>', { id, importer });

            //1. 绝对路径
            if (path.isAbsolute(id)) {
                // console.log('绝对路径', { id, importer });
                if (await pathExists(id)) {
                    return { id };
                };
                // 加入root处理  eg: /src/main.tsx
                id = path.join(serverContext.root, id);
                if (await pathExists(id)) {
                    return { id };
                };
            }
            //2. 相对路径
            else if (id.startsWith('.')) {
                // console.log('相对路径', { id, importer });
                if (!importer) throw new Error("`importer` should not be undefined");
                const hasExtension = path.extname(id).length > 1;
                let resolvedId: string;
                //2.1 包含文件后缀名 //eg: ./App.tsx
                if (hasExtension) {
                    resolvedId = normalizePath(
                        resolve.sync(id, { basedir: path.dirname(importer) })
                    );
                    if (await pathExists(resolvedId)) {
                        return { id: resolvedId };
                    };
                }
                //2.2 不包含文件后缀名 //eg: ./App -> ./App.tsx
                else {
                    for (const extname of DEFAULT_EXTENSIONS) {
                        try {
                            const withExtension = `${id}${extname}`;
                            resolvedId = normalizePath(
                                resolve.sync(withExtension, { basedir: path.dirname(importer) })
                            );
                            if (await pathExists(resolvedId)) {
                                return { id: resolvedId };
                            };
                        } catch (error) {
                            continue;
                        }
                    }
                }

            }
            return null;
        },
    }
};