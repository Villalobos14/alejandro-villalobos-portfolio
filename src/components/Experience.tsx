import Image from 'next/image'
import { experience } from "@/lib/professional";

export default function Experience() {
  return (
    <section className="h-full w-full px-[var(--page-gutter)] pb-8 pt-12 font-light text-white md:py-20">
      <h1 className='font-medium text-4xl 2xl:text-6xl'>Experience</h1>

      {experience.map((entry) => (
        <article key={entry.id} className='flex flex-col mt-10'>
          <h3 className='flex flex-col items-start text-3xl 2xl:text-5xl text-secondary'>
            <span className='text-gray-500 text-lg 2xl:text-3xl'>{entry.id}</span>
            {entry.role}, {entry.company}
          </h3>
          <div className='flex gap-2 mt-3 text-lg 2xl:text-2xl'>
            <time dateTime={entry.start.dateTime}>{entry.start.label}</time> -
            <time dateTime={entry.end.dateTime}>{entry.end.label}</time>
          </div>
          <ul className='mt-3 list-disc ml-4 2xl:text-xl'>
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <hr className='border-t border-gray-300 my-4' />
        </article>
      ))}

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
