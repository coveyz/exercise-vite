const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

// inputOptions -配置
const inputOptions = {
	input: './src/index.js',
	external: [],
	plugins: [resolve.default(), commonjs()],
};

// outputOptions - 配置
const outputOptionsList = [
	{
		dir: 'dist/es',
		entryFileNames: '[name].[hash].js',
		chunkFileNames: 'chunk-[hash].js',
		assetFileNames: 'assets/[name]-[hash][extname]',
		format: 'esm',
		sourcemap: true,
		globals: {
			lodash: '-',
		},
	},
];

// const outputOptionsList = [
// 	{
// 		dir: 'dist/es',
// 		format: 'esm',
// 	},
// 	{
// 		dir: 'dist/cjs',
// 		format: 'cjs',
// 	},
// ];

async function generateOutputOptions(bundle) {
	for (const outputOptions of outputOptionsList) {
		// console.log('outputOptions=>', outputOptions);
		// 2 拿到 bundle 对象 根绝每一份输出配置， 调用generate 和 write 方法分别生成和写入产物
		const { output } = await bundle.generate(outputOptions);
		// console.log('generate-after-output==>', output);
		// console.log('output-type=>', Array.isArray(output));
		for (const chunkOrAsset of output) {
			// console.log('chunkOrAsset=>', chunkOrAsset);
			if (chunkOrAsset.type === 'asset') {
				console.log('Asset=>', chunkOrAsset);
			} else {
				console.log('chunk=>', chunkOrAsset.modules);
			}
		}

		await bundle.write(outputOptions);
	}
}

async function build() {
	let bundle,
		bundleFailed = false;
	try {
		// 1 调用 rollup.rollup 生成bundle 对象
		bundle = await rollup.rollup(inputOptions);
		// console.log('bundle=>>', bundle);

		await generateOutputOptions(bundle);
	} catch (error) {
		bundleFailed = true;
		console.error(error);
	}

	if (bundle) {
		// 最后调用 bundle.close 方法结束打包
		await bundle.close();
	}

	process.exit(bundleFailed ? 1 : 0);
}

build();
