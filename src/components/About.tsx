import Image from 'next/image'
import React from 'react'

export default function About() {
  return (
    <section className='h-full p-8 md:p-20 text-white' id='about'>
      <h2 className='text-4xl font-medium '>About me</h2>
      <article className='w-full flex-col md:flex-row flex gap-x-8 gap-y-4 md:gap-y-0 mt-12 '>
        <div className='w-full md:w-1/2 h-[400px]  md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/me-and-friends.png'}
            alt='First project'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
        <div className='flex flex-col md:w-1/2 justify-center'>
          <h3 className='text-3xl font-medium '>
            Beyond Design
          </h3>
          <p className=' mt-4 text-xl font-light text-gray'>
            I&apos;m a naturally curious and self-taught person with a passion for learning. Whether it&apos;s music, drawing, or sports, I&apos;vm always exploring new skills and diving into tutorials to improve. Resilient and empathetic, I thrive on challenges and enjoy leading and collaborating with others to bring ideas to life.
          </p>
        </div>
      </article>
      <article className='w-full flex-col-reverse md:flex-row flex gap-x-8 gap-y-4 md:gap-y-0 mt-12 '>
        <div className='flex flex-col md:w-1/2 justify-center'>
          <h3 className='text-3xl font-medium '>
            Sharing Knowledge
          </h3>
          <p className=' mt-4 text-xl font-light text-gray'>
            Teaching UX/UI workshops has shown me how rewarding it is to guide others in their learning journey. I believe that knowledge becomes more valuable when shared, and I enjoy creating spaces where people can exchange ideas, ask questions, and develop their skills. Seeing others succeed and improve because of something I taught is one of the most fulfilling experiences for me.
          </p>
        </div>
        <div className='w-full md:w-1/2 h-[400px]  md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/sharing-knowledge.png'}
            alt='sharing knowledge'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
      </article>
      <article className='w-full flex-col md:flex-row flex gap-x-8 gap-y-4 md:gap-y-0 mt-12 '>
        <div className='w-full md:w-1/2 h-[400px]  md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/storytelling.png'}
            alt='storytelling'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
        <div className='flex flex-col md:w-1/2 justify-center'>
          <h3 className='text-3xl font-medium '>
            Storytelling
          </h3>
          <p className=' mt-4 text-xl font-light text-gray'>
            I enjoy speaking, presenting ideas, and bringing projects to life through storytelling. Whether it&apos;s pitching an idea, leading a workshop, or explaining complex concepts in a simple way, I thrive in environments where I can communicate and connect with others. I believe that a great presentation is not just about information, but about engaging the audience and making ideas resonate.
          </p>
        </div>
      </article>
      <article className='w-full flex-col-reverse md:flex-row flex gap-x-8 gap-y-4 md:gap-y-0 mt-12 '>
        <div className='flex flex-col md:w-1/2 justify-center'>
          <h3 className='text-3xl font-medium '>
            Leadership Experiences
          </h3>
          <p className=' mt-4 text-xl font-light text-gray'>
            I actively participate in hackathons, taking on leadership roles to guide teams, drive UX/UI design, I thrive in fast-paced environments where creativity, collaboration, and problem-solving come together. Through these competitions, I&apos;ve had the opportunity to lead winning projects, and refine my skills in both design and development. For me, hackathons are more than just competitions—they&apos;re a space to innovate, learn, and turn ideas into impactful solutions.
          </p>
        </div>
        <div className='w-full md:w-1/2 h-[400px]  md:mt-8 relative rounded-2xl overflow-hidden group cursor-pointer'>
          <Image
            src={'/leadership.png'}
            alt='leadership'
            fill
            className='object-cover rounded-2xl duration-1000 group-hover:scale-110'
          />
        </div>
      </article>
    </section>
  )
}
