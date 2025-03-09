import Image from 'next/image'
import React from 'react'

function Hero() {
  return (
    <main className='h-screen flex flex-col items-center px-8 xl:px-16 pt-20 text-white'>
      <div className='w-full flex flex-col gap-y-8'>
        <h3 className=' text-4xl font-medium '>Hello!</h3>
        <div className='flex flex-col md:flex-row items-center gap-x-4'>
          <div className='flex items-center gap-x-4 w-full md:w-auto'>
            <h3 className=' text-5xl xl:text-7xl font-medium'>I&apos;m </h3>
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
<<<<<<< HEAD
        <p className=' text-3xl xl:text-6xl font-medium leading-tight'>I&apos;m UX/UI Designer and I create a digital experience that borders on efficiency, aesthetics and functionality. 🚀</p>
=======
        <p className='text-3xl xl:text-6xl font-medium leading-tight mt-4'>I&apos;m
          <span className='text-secondary'>
            {' '} UX | UI Designer {' '}
          </span>
          and I create a digital experience that borders on efficiency, aesthetics and functionality. 🚀</p>
        <div>
          <p className='text-gray text- xl'>
            Hi, thanks for visiting my portfolio!
          </p>
          <p className='text-gray text- xl'>
            It's still a work in progress, and some sections aren't ready yet. For now, click on projects to view them directly in Figma.
          </p>
        </div>
>>>>>>> origin/leo-dev
      </div>
    </main>
  )
}

export default Hero
