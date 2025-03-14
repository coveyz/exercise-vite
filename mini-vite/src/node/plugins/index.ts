import { esbuildTransformPlugin } from './esbuild';
import { importAnalysisPlugin } from './importAnalysis';
import { resolvePlugin } from './resolve';
import { cssPlugin } from './css';
import { assetPlugin } from './assets';
import { clientInjectPlugin } from './clientInject';
import type { Plugin } from '../plugin';

export function resolvePlugins(): Plugin[] {
    return [
        clientInjectPlugin(),
        resolvePlugin(),
        esbuildTransformPlugin(),
        importAnalysisPlugin(),
        cssPlugin(),
        assetPlugin(),
    ]
}