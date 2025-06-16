import Image from 'next/image'
import React from 'react'

export default function Experience() {
  return (
    <section className='h-full p-8 pt-12 md:p-20 font-light text-white' id='experience'>
      <h2 className='font-medium text-4xl 2xl:text-6xl'>Experience</h2>

      {/* Platinum Mexico */}
      <article className='flex flex-col mt-10'>
        <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
          <span className='text-gray-500 text-lg 2xl:text-3xl'>01</span>
          Lead UX Designer, Platinum Mexico
        </h3>
        <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
          <time dateTime='2024-09'>Sep 2024</time> -
          <time dateTime='2025-05'>May 2025</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Directed UX/UI team for a university operations platform, aligning design with user needs.</li>
          <li>Designed wireframes, prototypes, and a scalable design system for consistent interfaces.</li>
          <li>Conducted research and usability tests to optimize workflows and boost satisfaction.</li>
        </ul>
        <hr className='border-t border-gray-300 my-4' />
      </article>

      {/* DaCodes */}
      <article className='flex flex-col mt-10'>
        <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
          <span className='text-gray-500 text-lg 2xl:text-3xl'>02</span>
          UX/UI Designer, DaCodes (Remote)
        </h3>
        <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
          <time dateTime='2023-03'>Mar 2023</time> -
          <time dateTime='2025-05'>May 2025</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Redesigned key workflows to reduce training time and errors.</li>
          <li>Built interactive prototypes that enhanced team collaboration.</li>
          <li>Created a design system, accelerating development and ensuring consistency.</li>
        </ul>
        <hr className='border-t border-gray-300 my-4' />
      </article>

      {/* Freelance */}
      <article className='flex flex-col mt-10'>
        <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
          <span className='text-gray-500 text-lg 2xl:text-3xl'>03</span>
          Freelance UX/UI Designer & Frontend Developer
        </h3>
        <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
          <time dateTime='2021-01'>Jan 2021</time> -
          <time dateTime='2024-12'>Dec 2024</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Crafted UX/UI solutions for clients in Business, Education, AI, and Telemedicine.</li>
          <li>Led user research and prototyping to improve engagement.</li>
          <li>Delivered real-time dashboards and seamless frontend integrations.</li>
        </ul>
        <hr className='border-t border-gray-300 my-4' />
      </article>

      {/* Certificate Image */}
      <div className='w-full h-[550px] mt-12 relative rounded-2xl overflow-hidden group cursor-pointer'>
        <Image
          src={'/certificate.png'}
          alt='certificate'
          fill
          className='object-cover rounded-2xl duration-1000 group-hover:scale-105'
        />
      </div>
    </section>
  )
}
