import { useEffect } from 'react';
import styles  from "./index.module.scss";
import  {devDependencies} from '../../../package.json';
import logoSrc from '@assets/imgs/vite.png'; // 导入图片
import {ReactComponent as ReactLogo} from '@assets/icons/logo.svg'; // SVG
import SvgIcon from '../SvgIcon';


// Worker
// import Worker from './example.js?worker';

// const worker = new Worker(); // 初始化 Worker 实例
// worker.addEventListener('message', (e) => {
//   console.log('worker=>>',e)
// })

const icons = import.meta.globEager('@assets/icons/logo-*.svg')
const iconUrls = Object.values(icons).map(mod => {
  const fileName = mod.default.split('/').pop()
  const [svgName] = fileName.split('.')
  return svgName
});


console.log('iconUrls=>',iconUrls)

export const  Header = () => {
  useEffect(() => {
    const img = document.getElementById('logo') as HTMLImageElement;
    img.src = logoSrc;
  },[]);

  return (
      <div className={`p-20px text-center ${styles.header}`} >
        <h1 className="font-bold text-2xl mb-2">
          vite version: {devDependencies.vite}
        </h1>

        {/* <div className={styles.bold}> */}
        <div className="border-3 h-auto outline-gray-500">
          <div className=" h-4rem flex-c">covey</div>
        </div>

        <img id="logo" className="m-auto mb-4" alt="" />

        <ReactLogo />

        {/* {iconUrls.map((item) => <img src={item} key={item} width="50" alt="" />)} */}

        {/* {
          iconUrls.map((item,index) => <SvgIcon name={item} key={index} width="50" height="50" />)
        } */}

{iconUrls.map((item) => (
            <SvgIcon name={item} key={item} width="50" height="50" />
          ))}

      </div>
  );
};
