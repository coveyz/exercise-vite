import { NextHandleFunction } from 'connect';
import createDebug from 'debug'

import { isJSRequest, cleanUrl, isCSSRequest, isImportRequest } from '../../utils';
import type { ServerContext } from '..';



const debug = createDebug('dev');

export async function transformRequest(
    url: string,
    serverContext: ServerContext
) {
    const { pluginContainer, moduleGraph } = serverContext;
    url = cleanUrl(url);

    let mod = await moduleGraph.getModuleByUrl(url);

    if (mod && mod.transformResult) {
        return mod.transformResult;
    }

    // 依次调用插件容器的  resolveId load transform 方法
    const resolveResult = await pluginContainer.resolveId(url);

    let transformResult;
    if (resolveResult?.id) {
        let code = await pluginContainer.load(resolveResult.id);
        if (typeof code === 'object' && code !== null) {
            code = code.code;
        };

        mod = await moduleGraph.ensureEntryFromUrl(url);

        if (code) {
            transformResult = await pluginContainer.transform(
                code as string,
                resolveResult?.id
            )
        };

        if (mod) {
            mod.transformResult = transformResult
        }
    };

    return transformResult;
}

export function transformMiddleware(serverContext: ServerContext): NextHandleFunction {
    return async (req, res, next) => {
        if (req.method !== 'GET' || !req.url) {
            return next();
        };

        const url = req.url;
        debug('transformMiddleware: %s', url);

        //transform JS request
        if (
            isJSRequest(url)
            || isCSSRequest(url)
            || isImportRequest(url)
        ) {
            let result = await transformRequest(url, serverContext);

            // console.log('result=>', result);

            if (!result) {
                return next();
            };
            if (result && typeof result !== 'string') {
                result = result.code;
            };



            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/javascript');
            return res.end(result);
        };

        return next();
    }
}
