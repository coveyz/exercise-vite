import path from 'path'

export const EXTERNAL_TYPES = [
    "css",
    "less",
    "sass",
    "scss",
    "styl",
    "stylus",
    "pcss",
    "postcss",
    "vue",
    "svelte",
    "marko",
    "astro",
    "png",
    "jpe?g",
    "gif",
    "svg",
    "ico",
    "webp",
    "avif",
];

export const BARE_IMPORT_RE = /^[\w@][^:]/;
/**  预构建产物默认存放在 node_modules 中的 .m-vite 目录中 */
export const PRE_BUNDLE_DIR = path.join("node_modules", ".m-vite");

export const HASH_RE = /#.*$/s;
export const QUERY_RE = /\?.*$/s;

export const JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/;
export const DEFAULT_EXTENSIONS = [".tsx", ".ts", ".jsx", "js"];

export const HMR_PORT = 13579;

export const CLIENT_PUBLIC_PATH = "/@vite/client";

export const INTERNAL_LIST = [CLIENT_PUBLIC_PATH, "/@react-refresh"];
