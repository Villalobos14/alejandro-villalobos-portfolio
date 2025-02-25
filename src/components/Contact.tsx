import Image from 'next/image'
import React from 'react'

export default function Contact() {
  return (
    <footer className='h-full p-20'>
      <h2 className='text-4xl font-medium text-black/75'>Contact</h2>
      <div className='flex justify-center mt-10 items-center space-x-14'>
        <Image
          src={"/behance.png"}
          alt="Behance"
          width={80}
          height={80}
          className='cursor-pointer'
        />
        <Image
          src={"/dribbbble.png"}
          alt="Dribbble"
          width={90}
          height={90}
          className='cursor-pointer'
        />
        <Image
          src={"/linkedin.png"}
          alt="LinkedIn"
          width={80}
          height={80}
          className='cursor-pointer'
        />
        <span
          className="px-4 py-2 text-black/85 border border-black/75 rounded-full text-base cursor-pointer"
        >
          Resume
        </span>
      </div>
      <div className='mt-12'>
        <p className="flex flex-col items-center text-center text-gray-500">
          <span>2025 Alejandro Villalobos</span>
          Made With Figma & Next.js
        </p>
      </div>
    </footer>
  )
}
