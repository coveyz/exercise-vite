import os from 'os';
import path from 'path'

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