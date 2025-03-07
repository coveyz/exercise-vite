import path from "path";
import { NextHandleFunction } from 'connect';
import { pathExists, readFile } from 'fs-extra';

import type { ServerContext } from '../';



export function indexHTMLMiddleware(
    serverContext: ServerContext
): NextHandleFunction {
    // return async (req, res, next) => {
    //     if (req.url === '/') {
    //         const { root } = serverContext;
    //         // 默认使用 项目根目录下的 index.html
    //         const indexHTMLPath = path.join(root, 'index.html');
    //         if (await pathExists(indexHTMLPath)) {
    //             const rawHTML = await readFile(indexHTMLPath, 'utf-8');
    //             let html = rawHTML;

    //             // 通过执行插件 transformIndexHtml 方法，处理 index.html 进行自定义修改
    //             for (const plugin of serverContext.plugins) {
    //                 if (plugin.transformIndexHtml) {
    //                     html = await plugin.transformIndexHtml(html);
    //                 }
    //             };

    //             res.statusCode = 200;
    //             res.setHeader('Content-Type', 'text/html');
    //             console.log('html=>', html)

    //             return res.end(html);
    //         }
    //     };

    //     return next();
    // }
    return async (req, res, next) => {
        if (req.url === "/") {
            const { root } = serverContext;
            const indexHtmlPath = path.join(root, "index.html");
            if (await pathExists(indexHtmlPath)) {
                const rawHtml = await readFile(indexHtmlPath, "utf8");
                let html = rawHtml;
                for (const plugin of serverContext.plugins) {
                    if (plugin.transformIndexHtml) {
                        html = await plugin.transformIndexHtml(html);
                    }
                }

                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");

                return res.end(html);
            }
        }
        return next();
    };
};