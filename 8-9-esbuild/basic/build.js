const { build, buildSync, serve } = require('esbuild');

const options = {
	// 根目录
	absWorkingDir: process.cwd(),
	// 入口文件
	entryPoints: ['./src/index.jsx'],
	// 打包产物目录
	outdir: 'dist',
	// 是否需要打包 一般true
	bundle: true,
	// 模块格式 esm, commonjs, iife
	format: 'esm',
	// 需要排除打包的依赖列表
	external: [],
	// 是否开启自动拆包
	splitting: true,
	// 是否生成 sourcemap 文件
	sourcemap: true,
	// 是否生成打包的元信息文件
	metafile: true,
	// 是否代码压缩
	minify: false,
	// 数否开启watch， 在watch 情况下代码变动会触发重新打包
	watch: false,
	// 是否将产物 写入磁盘
	write: true,
	// Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
	// 针对特殊文件 调用不同的 loader 进行加载
	loader: {
		'.png': 'base64',
	},
};

async function runbuild() {
	const result = await build(options);
	console.log('result=>', result);
	// serve({ port: 9094, servedir: './dist' }, options).then((server) => {
		// console.log('HTTP Server starts at port', server.port);
	// });
}

runbuild();
