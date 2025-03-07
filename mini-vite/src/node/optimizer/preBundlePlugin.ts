import path from 'path'
import resolve from 'resolve'
import { init, parse } from 'es-module-lexer'
import createDebug from 'debug'
import fs from 'fs-extra'
import type { Loader, Plugin } from 'esbuild';
import type { ExportSpecifier } from 'es-module-lexer'

import { BARE_IMPORT_RE } from '../constants'
import { normalizePath } from '../utils';

const debug = createDebug('dev');

export function preBundlePlugin(deps: Set<string>): Plugin {
    return {
        name: 'esbuild:pre-bundle',
        setup(build) {

            build.onResolve(
                { filter: BARE_IMPORT_RE },
                (args) => {
                    const { path: id, importer } = args;
                    const isEntry = !importer;

                    // 命中 需要预编译的依赖
                    if (deps.has(id)) {
                        return isEntry
                            ? {
                                path: id,
                                namespace: 'dep'
                            }
                            : {
                                // path 绝对路径
                                path: resolve.sync(id, { basedir: process.cwd() }),
                            }
                    }
                }
            );

            // 拿到标记后依赖，构建代理模块， 交给esbuild
            build.onLoad(
                { filter: /.*/, namespace: 'dep' },
                async (args) => {
                    await init;
                    const { path: id } = args;
                    const root = process.cwd();
                    const entryPath = normalizePath(resolve.sync(id, { basedir: root }));
                    const code = await fs.readFile(entryPath, 'utf-8');
                    const [imports, exports] = parse(code);
                    let proxyModule: string[] = [];
                    // cjs
                    if (!imports.length && !exports.length) {
                        // 构建 代理模块
                        // 通过 require 拿到模块的导出对象
                        const res = require(entryPath);
                        // 拿到所有具名导出
                        const specifiers = Object.keys(res);
                        proxyModule.push(
                            `export { ${specifiers.join(",")} } from "${entryPath}"`,
                            `export default require("${entryPath}")`
                        );
                    }
                    // esm
                    else {
                        // export * 或者 export default 
                        if (exports.some((e: ExportSpecifier) => e.n === "default")) {
                            proxyModule.push(`import d from "${entryPath}";export default d`);
                        }
                        proxyModule.push(`export * from "${entryPath}"`);
                    };

                    debug("Proxy module content: %o", proxyModule.join("\n"));
                    const loader = path.extname(entryPath).slice(1);
                    // console.log('proxyModule=>', proxyModule)
                    return {
                        loader: loader as Loader,
                        contents: proxyModule.join("\n"),
                        resolveDir: root,
                    };
                }
            );
        },
    }
}