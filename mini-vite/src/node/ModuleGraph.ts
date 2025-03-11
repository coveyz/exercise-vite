import type { TransformResult, PartialResolvedId } from 'rollup'

import { cleanUrl } from './utils';


export class ModuleNode {
    // 资源访问url
    url: string;
    // 资源绝对路径
    id: string | null = null;
    importers = new Set<ModuleNode>;
    importedModules = new Set<ModuleNode>();
    transformResult: TransformResult | null = null;
    lastHMRTimeStamp = 0;
    constructor(url: string) {
        this.url = url;
    }
};

export class ModuleGraph {
    //  资源url 到 ModuleNode 映射表
    urlModuleMap = new Map<string, ModuleNode>
    //  资源绝对路径 到 ModuleNode 映射表
    idModuleMap = new Map<string, ModuleNode>

    constructor(
        private resolveId: (url: string) => Promise<PartialResolvedId | null>
    ) { }

    private async _resolve(url: string): Promise<{ url: string, resolveId: string }> {
        const resolved = await this.resolveId(url);
        const resolveId = resolved?.id || url;
        return { url, resolveId }
    }

    getModuleById(id: string): ModuleNode | undefined {
        return this.idModuleMap.get(id);
    }

    async getModuleByUrl(rawUrl: string): Promise<ModuleNode | undefined> {
        const { url } = await this._resolve(rawUrl);
        return this.urlModuleMap.get(url);
    }

    async ensureEntryFromUrl(rawUrl: string): Promise<ModuleNode> {
        const { url, resolveId } = await this._resolve(rawUrl);

        // check cache
        if (this.urlModuleMap.has(url)) {
            return this.urlModuleMap.get(url)!;
        };

        // no cache update urlModuleMap&idModuleMap
        const mod = new ModuleNode(url);
        mod.id = resolveId;
        this.urlModuleMap.set(url, mod);
        this.idModuleMap.set(resolveId, mod);

        return mod;
    }
    async updateModuleInfo(mod: ModuleNode, importedModules:Set<string | ModuleNode>) {
        const prevImports = mod.importedModules;

        for (const curImport of importedModules) {
            const dep = typeof curImport === 'string' 
                ? await this.ensureEntryFromUrl(cleanUrl(curImport))
                : curImport;
            if(dep) {
                mod.importedModules.add(dep);
                dep.importers.add(mod);
            }
        };
        // 清除 已经不在被引用的依赖
        for (const preImport of prevImports) {
            preImport.importers.delete(mod);
        }
    }
    /** HMR  触发时会执行这个方法 */
    invalidateModule(file: string) {
        const mod = this.idModuleMap.get(file);
        if (!mod) return;
        mod.lastHMRTimeStamp = Date.now();
        mod.transformResult = null;
        mod.importers.forEach(importer => {
            this.invalidateModule(importer.id!);
        })
    }
}