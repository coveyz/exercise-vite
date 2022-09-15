const { build } = require('esbuild');
const httpImport = require('./http-import-plugin');
const htmlPlugin = require('./html-plugin');

const options = {
	absWorkingDir: process.cwd(),
	entryPoints: ['./src/index.jsx'],
	entryNames: '[dir]/[name]-[hash]',
	outdir: 'dist',
	bundle: true,
	format: 'esm',
	splitting: true,
	sourcemap: true,
	metafile: true,
	chunkNames: '[name]-[hash]',
	assetNames: 'assets/[name]-[hash]',
	plugins: [httpImport(), htmlPlugin()],
	// plugins: [httpImport()],
};

async function runBuild() {
	build(options).then(() => {
		console.log(`🚀 Build Finish`);
	});
}

runBuild();
