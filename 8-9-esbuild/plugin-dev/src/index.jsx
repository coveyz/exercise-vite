// Esbuild 原生不支持通过 HTTP 从 CDN 服务上拉取对应的第三方依赖资源
import { render } from 'https://cdn.skypack.dev/react-dom';
// import React from 'https://cdn.skypack.dev/react';
import React from 'react';

let Greet = () => <h1>Hello, Covey </h1>;

render(<Greet />, document.getElementById('root'));
