import * as fs from 'fs';
import * as path from 'path';
import { ViteDevServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import express, { RequestHandler, Express } from 'express';
import serve from 'serve-static';
import { isProd, cwd, loadSsrEntryModule, resolveTemplatePath, matchPageUrl } from './utils';
// 工程化考虑: 路由、状态管理、缓存、 CSR 降级、CSS in JS、按需加载、浏览器 API、自定义 Header



async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  let vite: ViteDevServer | null = null
  if (!isProd) {
    vite = await (await import('vite')).createServer({ root: process.cwd(), server: { middlewareMode: "ssr" } })
    app.use(vite?.middlewares)
  }

  return async (req, res, next) => {
    try {
      // SSR
      // 1 加载服务端入口模块
      // 2 数据获取
      // 3 [核心]渲染组建
      // 4 拼接HTML 返回响应
      const url = req.originalUrl;
      console.log('createSsrMiddleware-return', url)
      if (!matchPageUrl(url)) return await next()

      //* 1 服务端 入口加载
      const { ServerEntry, fetchData } = await loadSsrEntryModule(vite)
      //* 2 获取数据
      const data = await fetchData();
      console.log('data=>', data);
      //* 3 组件渲染 -> 字符串
      const appHTML = renderToString(React.createElement(ServerEntry, { data }))
      console.log('appHTML=>', appHTML)
      //* 4 拼接完整 HTML 字符串 返回客户端
      const templatePath = resolveTemplatePath();
      let template = await fs.readFileSync(templatePath, 'utf-8')
      // 开发模式下 需要注入 HMR, 环境变量相关的代码, 因此需要调用 vite.transformIndexHtml
      if (!isProd && vite) {
        template = await vite.transformIndexHtml(url, template);
      }

      const html = template
        .replace('<!-- SSR_APP -->', appHTML)
        .replace(
          '<!-- SSR_DATA -->',
          `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
        );
      res.status(200).setHeader('Content-Type', 'text/html').end(html)
    } catch (error: any) {
      vite?.ssrFixStacktrace(error);
      console.error(error);
      res.status(500).end(error.message)
    }
  }
}



async function createServer() {
  const app = express()
  // 加入 Vite SSR 中间件
  app.use(await createSsrMiddleware(app))

  if (isProd) {
    app.use(serve(path.join(cwd, 'dist/client')))
  }

  app.listen(3000, () => {
    console.log('Node 服务已经启动');
    console.log(`http://localhost:3000`)
  })
}

createServer()