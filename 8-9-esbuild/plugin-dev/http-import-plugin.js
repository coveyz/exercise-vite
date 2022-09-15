/**
 ** CDN 依赖拉取插件
 */

module.exports = () => ({
	name: 'esbuild:http',
	setup(build) {
		let https = require('https'),
			http = require('http');

		// 1 拦截请求
		build.onResolve({ filter: /^https?:\/\// }, (args) => {
			console.log('build-onResolve');
			return {
				path: args.path,
				namespace: 'http-url',
			};
		});
		// 拦截 间接依赖的路径 并重写路径
		// tip 间接依赖同样会被自动带上 ‘http-url'的 namespace
		build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args) => ({
			path: new URL(args.path, args.importer).toString(),
			namespace: 'http-url',
		}));

		// 2 通过 fetch 请求加载 CDN 资源
		build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
			console.log('onLoad');
			let contents = await new Promise((resolve, reject) => {
				function fetch(url) {
					console.log('modulePath->', url);
					let lib = url.startsWith('https') ? https : http;
					let req = lib
						.get(url, (res) => {
							// 重定向
							if ([301, 302, 307].includes(res.statusCode)) {
								console.log('重定向');
								fetch(new URL(res.headers.location, url).toString());
								req.abort();
							} else if (res.statusCode === 200) {
								let chunks = [];
								res.on('data', (chunk) => chunks.push(chunk));
								res.on('end', () => resolve(Buffer.concat(chunks)));
							} else {
								reject(new Error(`GET ${url} fail:status ${res.statusCode}`));
							}
						})
						.on('error', reject);
				}
				fetch(args.path);
			});
			return { contents };
		});
	},
});
