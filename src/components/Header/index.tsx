import styles  from './index.module.scss';
import {devDependencies} from '../../../package.json';

export const Header = () => {
  return (
    <div className='p-20px text-center'>
      <h1 className='font-bold text-2xl mb-2'>
        vite version: {devDependencies.vite}
      </h1>

      {/* <div className={styles.bold}> */}
      <div className="border-3 h-auto outline-gray-500">
        <div className=" h-4rem flex-c" >
          covey
        </div>
      </div>
    </div>
  )
}
