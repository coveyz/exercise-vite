import os from 'os';
import path from 'path'

import { HASH_RE, QUERY_RE, JS_TYPES_RE } from './constants';

export const slash = (path: string) => {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

    if (isExtendedLengthPath || hasNonAscii) return path;

    return path.replace(/\\/g, '/');
};


export const isWindows = os.platform() === 'win32';

export const normalizePath = (id: string) => {
    return path.posix.normalize(isWindows ? slash(id) : id);
}

export const cleanUrl = (url: string) => {
    return url.replace(HASH_RE, '').replace(QUERY_RE, '');
};

export const isJSRequest = (id: string) => {
    id = cleanUrl(id);
    if (JS_TYPES_RE.test(id)) return true;

    if (!path.extname(id) && !id.endsWith('/')) return true;

    return false
};

export const isCSSRequest = (id: string) => {
    return cleanUrl(id).endsWith('.css');
};

export const isImportRequest = (url: string): boolean => {
    return url.endsWith('?import');
}

export const removeImportQuery = (url: string) => {
    return url.replace(/\?import$/, "");
};

export const getShortName = (file: string, root: string) => {
    return file.startsWith(root + '/')  
        ? path.posix.relative(root, file)
        : file;
}