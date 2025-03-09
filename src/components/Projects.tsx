import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Projects() {
  return (
    <section className='w-full h-full p-8 md:p-16'>
      <div className='h-full'>
        <div className='w-full flex justify-between text-3xl  md:text-5xl text-white font-normal'>
          <h3>Selected works</h3>
          <h4 className='text-gray tracking-tighter'>21'-24'</h4>
        </div>
        <div className='w-full flex flex-col'>
          <div className='h-[550px] mt-12 relative rounded-2xl overflow-hidden group cursor-pointer'>
            <Image
              src={'/monogatari.png'}
              alt='First project'
              fill
              className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
            />
            <div className='absolute top-3 left-4 text-white'>
              <p className='text-black bg-secondary py-1 px-3 rounded-3xl'>Best Project</p>
            </div>
          </div>
          <div className='text-white mt-3 ml-2'>
            <h3>Monogatari</h3>
            <p className='text-gray'>Web3 Platform International Hackathon Winner</p>
          </div>
        </div>
      </div>
      <div className='w-full h-full flex flex-col md:flex-row justify-between gap-x-8 mt-8'>
        <div className='w-full flex flex-col'>
          <div className='h-[400px] md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
            <Image
              src={'/ominiocoer.png'}
              alt='First project'
              fill
              className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
            />
            <div className='absolute top-3 left-4 text-white'>
              <p className='text-black bg-secondary py-1 px-3 rounded-3xl'>Shipped</p>
            </div>
          </div>
          <div className='text-white mt-3 ml-2'>
            <h3>Ominio</h3>
            <p className='text-gray'>
            E-Learning Platform - Gamification - AI
            </p>
          </div>
        </div>
        <div className='w-full flex flex-col'>
          <div className='h-[400px] md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
            <Image
              src={'/nissan.png'}
              alt='First project'
              fill
              className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
            />
            <div className='absolute top-3 left-4 text-white'>
              <p className='text-black bg-secondary py-1 px-3 rounded-3xl'>Shipped</p>
            </div>
          </div>
          <div className='text-white mt-3 ml-2'>
            <h3>Andanac</h3>
            <p className='text-gray'>Intranet redesign for Nissan</p>
          </div>
        </div>
      </div>
      <div className='w-full h-full flex justify-center mt-4'>
        <Link
          href='/projects'
          className='mt-12 bg-secondary text-black px-8 py-4 rounded-full hover:bg-[#216d34] duration-300'>
          See more
        </Link>
      </div>
    </section>
  )
}

export default Projects
