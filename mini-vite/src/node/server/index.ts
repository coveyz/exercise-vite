import connect from 'connect';
import { blue, green } from 'picocolors';

import { optimize } from '../optimizer';

export async function startDevServer() {
    const app = connect();
    const root = process.cwd();
    const start = Date.now();

    app.listen(3000, async () => {
        await optimize(root);

        console.log(
            green("No-Bundle Service Has Started Successfully 🚀!"),
            `耗时：${Date.now() - start}ms`,
        );

        console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`);
    });
};