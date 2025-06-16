import React from 'react'

function Hero() {
  return (
    <main className='h-screen flex flex-col px-8 xl:px-16 pt-10 text-white' id='home'>

      {/* Hero Text Block */}
      <div className='flex flex-col  max-w-5xl items-start'>

        <p className='text-4xl xl:text-7xl font-medium leading-tight'>
          I&apos;m Alejandro Villalobos, a 
          <span className='text-secondary'> UX | UI designer </span>
          crafting efficient and aesthetic digital products.
          <br />
          Currently building solutions across 
          <span className='text-secondary'> AI</span>, 
          <span className='text-secondary'> education</span>, and 
          <span className='text-secondary'> business platforms</span>.
        </p>

        {/* Skill Badges */}
        <div className='flex flex-wrap gap-2 mt-8'>
          <span className='px-4 py-1 border border-white rounded-full text-sm'>Product Design</span>
          <span className='px-4 py-1 border border-white rounded-full text-sm'>UX Research</span>
          <span className='px-4 py-1 border border-white rounded-full text-sm'>Prototyping</span>
          <span className='px-4 py-1 border border-white rounded-full text-sm'>Frontend Dev</span>
        </div>

      </div>

      {/* Footer Line */}
      <div className='flex justify-between items-center w-full px-0 border-t text-[#7b7b7b] border-gray-700 py-4 mt-8 text-gray-400 text-xl'>
        <p>Based in México</p>
        <p className='flex items-center gap-1 text-[#d2cfcf] text-xl'>
          See Selected Works <span>↓</span>
        </p>
      </div>

    </main>
  )
}

export default Hero
