console.log("[vite] connecting...");

// 1. 创建客户端 WebSocket 连接
// 其中 __HMR_PORT__ 是一个占位符，会被 vite no-bundle 替换为实际的端口号
const socket = new WebSocket(`ws://localhost:__HMR_PORT__`, "vite-hmr");

// 2. 根据不同类型进行更新
async function handleMessage(payload: any) {

    switch (payload.type) {
        case 'connected': {
            console.log("[vite] connected.");
            // 心跳进ace
            setInterval(() => socket.send("ping"), 1000);
            break;
        }
        case 'update': {
            for (const update of payload.updates) {
                switch (update.type) {
                    case 'js-update': {
                        const { path, acceptedPath } = update;
                        console.log(`[vite] ${path} updated.`);
                        // 重新加载模块
                        const module = await import(path);
                        // 如果模块有 hot.accept 方法，调用它
                        if (module.hot && module.hot.accept) {
                            module.hot.accept();
                        }
                        break;
                    }
                    case 'css-update': {
                        const { path, style } = update;
                        console.log(`[vite] ${path} updated.`);
                        // 移除旧的 style
                        const oldStyle = document.head.querySelector(`style[data-vite="${path}"]`);
                        if (oldStyle) {
                            oldStyle.remove();
                        }
                        // 创建新的 style
                        const newStyle = document.createElement('style');
                        newStyle.setAttribute('data-vite', path);
                        newStyle.textContent = style;
                        document.head.appendChild(newStyle);
                        break;
                    }
                }
            }
            break;
        }
    }
}

// 3. 接受服务端的更新信息
socket.addEventListener('message', async ({ data }) => {
    handleMessage(JSON.parse(data)).catch(console.error);
});


