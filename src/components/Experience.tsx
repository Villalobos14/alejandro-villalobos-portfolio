import Image from 'next/image'
import React from 'react'

export default function Experience() {
  return (
    <section className='h-full p-8 pt-12  md:p-20 font-light text-white' id='experience'>
      <h2 className='font-medium text-4xl 2xl:text-6xl'>
        Experience
      </h2>
      <article className='flex flex-col mt-10'>
        <h3 className="flex flex-col items-start text-3xl 2xl:text-5xl text-secondary">
          <span className="text-gray-500 text-lg 2xl:text-3xl text-white">01</span>
          UX/UI Designer, DaCodes (Remote)
        </h3>
        <div className="flex gap-2 mt-3 text-lg 2xl:text-2xl">
          <time dateTime="2024-01">2023</time> -
          <time dateTime="2025-02">Current</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Led the redesign of key workflows, significantly reducing training time and minimizing operational errors.</li>
          <li>Developed and tested interactive prototypes that boosted user satisfaction and streamlined collaboration between design and development teams.</li>
          <li>Designed a scalable design system which accelerated development processes and enhanced consistency across teams.</li>
          <li>Created responsive, multi-platform interfaces that delivered an improved user experience on mobile, tablet, and desktop devices.</li>
          <li>Collaborated with multidisciplinary teams to standardize visual elements, resulting in a cohesive visual identity.</li>
        </ul>
        <hr className="border-t border-gray-300 my-4" />
      </article>
      <article className='flex flex-col mt-10'>
        <h3 className="flex flex-col items-start text-3xl 2xl:text-5xl text-secondary">
          <span className="text-gray-500 text-lg 2xl:text-3xl text-white">02</span>
          Freelance UX/UI Designer & Frontend Developer
        </h3>
        <div className="flex gap-2 mt-3 text-lg 2xl:text-2xl">
          <time dateTime="2021-01">2021</time> -
          <time dateTime="2025-02">Current</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Conceptualized and designed user experiences and interfaces for platforms in industries such as Business & ERP, Education & Mentorship, Artificial Intelligence, and Telemedicine, working directly with real clients.</li>
          <li>Conducted comprehensive user research to identify critical issues and incorporated gamification elements to streamline navigation and enhance user engagement.</li>
          <li>Developed real-time data dashboards for educational platforms, facilitating data-driven decision-making and optimizing operational efficiency.</li>
          <li>Collaborated with developers to ensure seamless frontend integration, resulting in high-performance and visually appealing interfaces.</li>
        </ul>

        <hr className="border-t border-gray-300 my-4" />
      </article>
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
