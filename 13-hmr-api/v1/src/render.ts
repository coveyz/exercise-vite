import  './style.css';

export function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = `
  <h1>Hello Vite!</h1>
  <p target="_blank">This is hmr test.123 这是增加的文本</p>
  `
}
