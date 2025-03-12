console.log("[vite] connecting...");

interface Update {
    type: 'js-update' | 'css-update';
    path: string;
    acceptedPath: string;
    timestamp: string
}

// 1. 创建客户端 WebSocket 连接
// 其中 __HMR_PORT__ 是一个占位符，会被 vite no-bundle 替换为实际的端口号
const socket = new WebSocket(`ws://localhost:__HMR_PORT__`, "vite-hmr");

// 2. 根据不同类型进行更新
async function handleMessage(payload: any) {
    console.log('handleMessage=>', payload);
    switch (payload.type) {
        case 'connected': {
            console.log("[vite] connected.");
            // 心跳进ace
            setInterval(() => socket.send("ping"), 1000);
            break;
        }
        case 'update': {
            for (const update of payload.updates as Update[]) {
                switch (update.type) {
                    case 'js-update': {
                        // const { path, acceptedPath } = update;
                        // console.log(`[vite] ${path} updated.`);
                        // // 重新加载模块
                        // const module = await import(path);
                        // // 如果模块有 hot.accept 方法，调用它
                        // if (module.hot && module.hot.accept) {
                        //     module.hot.accept();
                        // }
                        fetchUpdate(update)
                        break;
                    }
                    case 'css-update': {
                        //@ts-ignore
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



interface HotModule {
    id: string;
    callbacks: HotCallback[];
};
interface HotCallback {
    deps: string[];
    fn: (modules: object[]) => void;
};
/** HMR 模块表 */
const hotModulesMap = new Map<string, HotModule>();
/** 不在生效的 模块表 */
const pruneMap = new Map<string, (data: any) => void | Promise<void>>();


export const createHotContext = (ownerPath: string) => {
    const mod = hotModulesMap.get(ownerPath);
    if (mod) {
        mod.callbacks = [];
    };

    function acceptDeps(deps: string[], callback: any) {
        const mod = hotModulesMap.get(ownerPath) || {
            id: ownerPath,
            callbacks: []
        };

        mod.callbacks.push({
            deps,
            fn: callback
        });

        hotModulesMap.set(ownerPath, mod);
    };

    return {
        accept(deps: any, callback?: any) {
            // 只考虑接受自身模块更新的情况
            // import.meta.hot.accept()
            if (typeof deps === 'function' || !deps) {
                acceptDeps([ownerPath], ([mod]) => deps && deps(mod));
            }
        },
        prune(cb: (data: any) => void) {
            // 模块不再生效的回调
            // import.meta.hot.prune(() => {})
            pruneMap.set(ownerPath, cb);
        }
    };
};

async function fetchUpdate({ path, timestamp }: Update) {
    const mod = hotModulesMap.get(path);

    console.log('fetchUpdate=>', mod);

    if (!mod) return;

    const moduleMap = new Map();
    const modulesToUpdate = new Set<string>();
    modulesToUpdate.add(path);

    await Promise.all(
        Array.from(modulesToUpdate).map(async dep => {
            const [path, query] = dep.split(`?`);
            try {
                const newMod = await import(
                    path + `?+=${timestamp}${query ? `&${query}` : ""}`
                );
                moduleMap.set(dep, newMod);
            } catch (error) { }
        })
    );

    return () => {
        for (const { deps, fn } of mod.callbacks) {
            fn(deps.map((dep: any) => moduleMap.get(dep)));
        };

        console.log(`[vite] hot updated: ${path}`);
    };
}
