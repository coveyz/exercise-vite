import Server from 'react-dom/server';
// import { PATH } from 'env';

let Greet = () => <h1>Hello, Covey </h1>;

console.log(Server.renderToString(<Greet />));

// console.log(`PATH is ${PATH}`);
