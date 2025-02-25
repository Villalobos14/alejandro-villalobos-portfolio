import Image from 'next/image'
import React from 'react'

function Projects() {
  return (
    <section className='w-full h-full bg-[#141414] p-8 pt-12 md:p-20'>
      <div className='h-full'>
        <div className='w-full flex justify-between text-3xl  md:text-6xl text-white font-medium'>
          <h3>Selected works</h3>
          <h4 className='text-white/35'>21'-24'</h4>
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
      <div className='w-full h-full flex flex-col md:flex-row justify-between gap-x-8 mt-8'>
        <div className='w-full md:w-1/2 h-[400px]  md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/second-project.png'}
            alt='First project'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
        <div className='w-full md:w-1/2 h-[400px] mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/third-project.png'}
            alt='First project'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
      </div>
    </section>
  )
}

export default Projects
