import { readFile } from 'fs-extra';

import type { Plugin } from '../plugin';

/** CSS 编译插件 */
export function cssPlugin(): Plugin {
    return {
        name: 'm-vite:css',
        load(id) {
            // 加载
            if (id.endsWith('.css')) {
                return readFile(id, 'utf-8');
            }
        },
        // 转换逻辑
        async transform(code, id) {
            if (id.endsWith('.css')) {
                //  包装成 js 代码
                const jsContent = `
const css = "${code.replace(/\n/g, "")}";
const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = css;
document.head.appendChild(style);
export default css;
`.trim();
                return {
                    code: jsContent,
                }
            };

            return null;
        }
    }
}