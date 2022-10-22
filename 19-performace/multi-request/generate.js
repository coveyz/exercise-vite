const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('./src/template.tsx');

fs.mkdirSync('./src/components');

for (let index = 0; index < 100; index++) {
	const filePath = path.resolve(__dirname, `./src/components/${index}.tsx`);

	fs.writeFileSync(filePath, content);
}
