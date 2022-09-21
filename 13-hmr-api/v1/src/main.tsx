// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

import {render} from './render';
import {initState} from './state'

render();
initState()

if (import.meta.hot) {
  import.meta.hot.accept(['./render.ts', './state.ts'],(modules) => {
    const [renderModule, stateModuleder] = modules
    console.log('stateModuleder=>',modules)
    if (renderModule) {
      renderModule.render()
    }
    if (stateModuleder) {
      stateModuleder.initState()
    }
  })
}