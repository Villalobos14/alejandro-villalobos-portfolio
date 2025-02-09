import Image from 'next/image'
import React from 'react'

function Hero() {
  return (
    <div className='h-screen flex flex-col items-center px-8 xl:px-20 pt-20'>
      <div className='w-full flex flex-col gap-y-8'>
        <h3 className='text-4xl font-medium '>Hello!</h3>
        <div className='flex flex-col md:flex-row items-center gap-x-4'>
          <div className='flex items-center gap-x-4 w-full md:w-auto'>
            <h3 className='text-5xl xl:text-7xl font-medium'>I&apos;m </h3>
            <Image
              src={'/myself-emoji.svg'}
              alt={'Alejandro Villalobos'}
              width={80}
              height={80}
              draggable={false}
              className='block md:hidden'
            />
          </div>
          <div className='w-full md:w-auto flex items-center gap-x-4'>
            <h3 className='text-5xl xl:text-7xl font-medium'>Alejandro VIllalobos</h3>
            <Image
              src={'/myself-emoji.svg'}
              alt={'Alejandro Villalobos'}
              width={100}
              height={100}
              draggable={false}
              className='hidden md:block'
            />
          </div>
        </div>
        <p className='text-3xl xl:text-6xl font-medium leading-tight'>I&apos;m UX/UI Designer and I create a digital experience that borders on efficiency, aesthetics and functionality. 🚀</p>
      </div>
    </div>
  )
}

export default Hero
