import path from 'path';
import { readFile } from 'fs-extra';
import esbuild, { build } from 'esbuild';

import { isJSRequest } from '../utils';
import type { Plugin } from '../plugin'


/** Esbuild 语法编译插件 */
export function esbuildTransformPlugin(): Plugin {
    return {
        name: 'm-vite:esbuild-transform',
        async load(id) {
            if (!isJSRequest(id)) return null;
            try {
                const code = await readFile(id, 'utf-8');
                return code;
            } catch (error) {
                return null;
            }
        },
        async transform(code, id) {
            if (!isJSRequest(id)) return null;
            const extname = path.extname(id).slice(1);

            const { code: transformCode, map } = await esbuild.transform(code, {
                target: 'esnext',
                format: 'esm',
                sourcemap: true,
                loader: extname as 'js' | 'jsx' | 'ts' | 'tsx',
            });

            return {
                code: transformCode,
                map: map
            };
        }
    }
}
