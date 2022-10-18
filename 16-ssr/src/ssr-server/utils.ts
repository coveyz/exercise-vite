import { ViteDevServer } from "vite";
import * as path from 'path';

export const isProd = process.env.NODE_ENV === 'production';
export const cwd = process.cwd();

export function matchPageUrl(url: string) {
  return url === '/'
}

export function resolveTemplatePath() {
  return isProd ? path.join(cwd, 'dist/client/index.html')
    : path.join(cwd, 'index.html')
}

export function loadSsrEntryModule(vite: ViteDevServer | null) {
  //* 生产模式下直接 require 打包后的产物
  if (isProd) {
    const entryPath = path.join(cwd, "dist/server/entry-server.mjs");
    console.log('entryPath=>', entryPath);
    return require(entryPath);
  }
  //* 开发环境下 通过 no-bundle 方式进行加载
  else {
    const entryPath = path.join(cwd, "src/entry-server.tsx")
    return vite!.ssrLoadModule(entryPath);
  }
}

