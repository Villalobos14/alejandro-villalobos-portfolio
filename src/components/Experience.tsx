import Image from 'next/image'
import React from 'react'

export default function Experience() {
  return (
    <section className='h-full p-8 pt-12 md:p-20 font-light text-white' id='experience'>
      <h2 className='font-medium text-4xl 2xl:text-6xl'>Experience</h2>

      {/* HSBC */}
      <article className='flex flex-col mt-10'>
        <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
          <span className='text-gray-500 text-lg 2xl:text-3xl'>01</span>
          UX Researcher, HSBC
        </h3>
        <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
          <time dateTime='2025-08'>Aug 2025</time> -
          <time dateTime='present'>Present</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Support mixed-methods UX research across digital banking services, internal tools, and customer-facing journeys.</li>
          <li>Analyze survey data, conversation logs, UX metrics, and open-ended feedback to identify friction points and opportunity areas.</li>
          <li>Translate research findings into actionable recommendations that help product, design, business, data, and technology teams make clearer experience decisions.</li>
        </ul>
        <hr className='border-t border-gray-300 my-4' />
      </article>

      {/* Orium */}
      <article className='flex flex-col mt-10'>
        <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
          <span className='text-gray-500 text-lg 2xl:text-3xl'>02</span>
          UX Designer, Orium
        </h3>
        <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
          <time dateTime='2023-06'>Jun 2023</time> -
          <time dateTime='2024-06'>Jun 2024</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Designed end-to-end product experiences for consumer-facing digital platforms, including user flows, interfaces, prototypes, and interaction patterns.</li>
          <li>Created high-fidelity designs and functional prototypes to validate concepts, clarify edge cases, and reduce ambiguity before implementation.</li>
          <li>Designed scalable design system components and reusable interface patterns to improve consistency, usability, and cohesion across product experiences.</li>
        </ul>
        <hr className='border-t border-gray-300 my-4' />
      </article>

      {/* DaCodes */}
      <article className='flex flex-col mt-10'>
        <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
          <span className='text-gray-500 text-lg 2xl:text-3xl'>03</span>
          UX Designer, DaCodes
        </h3>
        <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
          <time dateTime='2021-06'>Jun 2021</time> -
          <time dateTime='2023-05'>May 2023</time>
        </div>
        <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
          <li>Designed user flows, information architecture, wireframes, and interactive prototypes for SaaS products and customer-facing digital platforms.</li>
          <li>Translated product requirements, user needs, stakeholder input, and technical constraints into clearer interaction models and usable product experiences.</li>
          <li>Collaborated with product managers, engineers, and business stakeholders to present design rationale, incorporate feedback, and improve handoff quality.</li>
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