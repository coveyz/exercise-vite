const { transform, transformSync } = require('esbuild');

async function runTransform() {
	// 第一个参数是代码字符串
	// 第二个参数是 编译配置
	const content = await transform('const isNull = (str: string): boolean => str.length > 0;', {
		sourcemap: true,
		loader: 'tsx',
	});

	console.log('content=>', content);
}

runTransform();
