import Image from 'next/image'
import React from 'react'

function Projects() {
  return (
    <div className='w-full h-full bg-[#0d0d0d] px-8 md:px-20'>
      <div className='h-screen pt-16'>
        <div className='w-full flex justify-between text-3xl  md:text-6xl text-white font-medium'>
          <h3>SELECTED WORKS</h3>
          <h4 className='text-white/35'>21&apos;-24&apos;</h4>
        </div>
        <div className='w-full h-[550px] mt-12 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/first-project.png'}
            alt='First project'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
      </div>
      <div className='w-full h-screen flex flex-col md:flex-row justify-between gap-x-12 mt-12'>
        <div className='w-full md:w-1/2 h-[400px] mt-20  md:mt-12 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/second-project.png'}
            alt='First project'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
        <div className='w-full md:w-1/2 h-[400px] mt-12 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/third-project.png'}
            alt='First project'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
      </div>
    </div>
  )
}

export default Projects
