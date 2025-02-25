import Image from 'next/image'
import React from 'react'

export default function Experience() {
  return (
    <section className='h-full p-8 pt-12  md:p-20 text-black/75 font-light'>
      <h2 className='font-medium text-4xl'>
        Work Experience
      </h2>
      <article className='flex flex-col mt-10'>
        <h3 className="flex flex-col items-start text-3xl">
          <span className="text-gray-500 text-lg">01</span>
          UX/UI Designer, DaCodes (Remote)
        </h3>
        <div className="flex gap-2 mt-3 text-lg">
          <time dateTime="2024-01">Jan 2024</time> -
          <time dateTime="2025-02">Current</time>
        </div>
        <p className='mt-3'>Led the redesign of key workflows, reducing training time by 25% and decreasing operational errors by 15%.
          Developedandtestedinteractiveprototypesthatcontributedtoa20%increaseinusersatisfactionandoptimized
          the feedback loop between design and development teams. Designed a scalable design system that reduced development time by 20% and improved cross-functional consistency. Created responsive, device-agnostic interfaces that enhanced the user experience on mobile, tablet, and desktop platforms. Collaborated with multidisciplinary teams to standardize visual elements, resulting in a 30% improvement in overall visual consistency.</p>
        <hr className="border-t border-gray-300 my-4" />
      </article>

      <article className='flex flex-col mt-10'>
        <h3 className="flex flex-col items-start text-3xl">
          <span className="text-gray-500 text-lg">02</span>
          Freelance UX/UI Designer & Frontend Developer
        </h3>
        <div className="flex gap-2 mt-3 text-lg">
          <time dateTime="2021-01">Jan 2021</time> -
          <time dateTime="2025-02">Current</time>
        </div>
        <p className='mt-3'>Led the redesign of key workflows, reducing training time by 25% and decreasing operational errors by 15%.
          Developedandtestedinteractiveprototypesthatcontributedtoa20%increaseinusersatisfactionandoptimized
          the feedback loop between design and development teams. Designed a scalable design system that reduced development time by 20% and improved cross-functional consistency. Created responsive, device-agnostic interfaces that enhanced the user experience on mobile, tablet, and desktop platforms. Collaborated with multidisciplinary teams to standardize visual elements, resulting in a 30% improvement in overall visual consistency.</p>
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
