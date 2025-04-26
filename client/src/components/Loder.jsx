import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import loder from '../assets/images/Loader3.lottie'
const Loder = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen bg-black'>
        <DotLottieReact
            src={loder}
            autoplay
            loop
            className='h-86 w-[500px]'
        />
    </div>
  )
}
 
export default Loder
