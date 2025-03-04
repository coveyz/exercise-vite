import path from 'path';
import { build } from 'esbuild';
import { green } from 'picocolors'

import { scanPlugin } from './scanPlugin';
import { preBundlePlugin } from './preBundlePlugin';
import { PRE_BUNDLE_DIR } from '../constants'


export async function optimize(root: string) {
    //* 1. 确定入口
    const entry = path.resolve(root, 'src/main.tsx');

    //* 2. 从入口处扫描
    const deps = new Set<string>();
    await build({
        entryPoints: [entry],
        bundle: true,
        write: false,
        plugins: [scanPlugin(deps)]
    })
    console.log(
        `${green('Dependencies that require pre-building')}:\n${[...deps]
            .map(green)
            .map((item) => ` ${item}`)
            .join("\n")
        }`
    );

    //* 3. 预构建依赖
    await build({
        entryPoints: [...deps],
        write: true,
        bundle: true,
        format: 'esm',
        splitting: true,
        outdir: path.resolve(root, PRE_BUNDLE_DIR),
        plugins: [preBundlePlugin(deps)]
    });
};