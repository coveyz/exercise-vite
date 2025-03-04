import type { Plugin } from 'esbuild';

import { EXTERNAL_TYPES, BARE_IMPORT_RE } from '../constants';


export function scanPlugin(deps: Set<string>): Plugin {
    return {
        name: 'esbuild:scan-deps',
        setup(build) {
            //* 忽略的文件类型
            build.onResolve(
                { filter: new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`) },
                (args) => {
                    return {
                        path: args.path,
                        external: true
                    }
                });

            //* 记录依赖
            build.onResolve(
                { filter: BARE_IMPORT_RE },
                (args) => {
                    const { path: id } = args;
                    deps.add(id);

                    return {
                        path: id, 
                        external: true
                    }
                }
            )
        },
    }
}