const path = require('path');
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';

module.exports = {
	input: 'src/index.js',
	output: {
		dir: 'output',
		format: 'cjs',
	},
	plugins: [
		alias({
			entries: [
				// 将把 import xxx from 'module-a'
				// 转换为 import xxx from './module-a'
				// { find: 'module-a', replacement: './module-a.js' },
				{ find: '@', replacement: path.resolve(__dirname, 'src') },
			],
		}),
	],
};
// /**
//  * @type {import('rollup').RollupOptions}
//  */
// const buildOptions = {
// 	input: ['src/index.js'],
// 	// input: ['src/index.js', 'src/util.js'],
// 	output: {
// 		// 产物目录
// 		dir: 'dist/es',
// 		// dir: path.resolve(__dirname, 'dist'),
// 		// 入口模块 输出文件名
// 		entryFileNames: '[name].js',
// 		// 非入口模块 eg: import的输出文件名
// 		chunkFileNames: 'chunk-[hash].js',
// 		// 静态资源文件输出文件名
// 		assetFileNames: 'assets/[name]-[hash][extname]',
// 		// 产物格式 eg: cjs amd es iife umd system
// 		format: 'esm',
// 		sourcemap: true,
// 		// 如果打包出 iife/umd 格式 需要对外暴露出一个全局变量， 通过name 配置变量名
// 		name: 'MyBundle',
// 		// 全局变量声明
// 		globals: {
// 			// 项目 可以用 $ 替代 jquery
// 			jquery: '$',
// 		},
//     // 加入 terser 插件，用来压缩代码
// 		plugins: [terser()],
// 	},
// 	// output: [
// 	// 	{
// 	// 		dir: 'dist/es',
// 	// 		format: 'esm',
// 	// 	},
// 	// 	{
// 	// 		dir: 'dist/cjs',
// 	// 		format: 'cjs',
// 	// 	},
// 	// ],
// 	plugins: [resolve(), commonjs()],
// };

// export default buildOptions;

//! 如果不同入口对应的打包配置不一样 可以默认导出一个配置数组
// /**
//  * @type { import('rollup').RollupOptions }
//  */
// const buildIndexOptions = {
// 	input: ['src/index.js'],
// 	output: [
// 		{
// 			dir: 'dist/es',
// 			format: 'esm',
// 		},
// 		{
// 			dir: 'dist/cjs',
// 			format: 'cjs',
// 		},
// 	],
// };

// /**
//  * @type { import('rollup').RollupOptions }
//  */
// const buildUtilOptions = {
// 	input: ['src/util.js'],
// 	output: [
// 		{
// 			dir: 'dist/es',
// 			format: 'esm',
// 		},
// 		{
// 			dir: 'dist/cjs',
// 			format: 'cjs',
// 		},
// 	],
// };

// export default [buildIndexOptions, buildUtilOptions];
