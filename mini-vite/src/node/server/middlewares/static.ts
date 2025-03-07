import sirv from 'sirv'

import { isImportRequest } from '../../utils';
import type { NextHandleFunction } from 'connect';


export function staticMiddleware(root: string): NextHandleFunction {
    const serveFromRoot = sirv(root, {dev: true});

    return async (req, res, next) => {
        if (!req.url) return;
        // 不处理 import
        if (isImportRequest(req.url)) return;

        serveFromRoot(req, res, next);
    }
}