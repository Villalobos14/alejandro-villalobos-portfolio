import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export default function Projects({ name, img, alt, link, description }: ProjectsProps) {
  return (
    <div>
      <Link
        target="_blank"
        rel="noreferrer"
        href={link}
        className="img group inline-block overflow-hidden duration-200 ease-linear hover:rounded-3xl"
      >
        <Image
          className="w-screen duration-700 ease-in-out group-hover:scale-105"
          src={img}
          alt={alt}
          width="800"
          height="600"
        />
      </Link>
      <div className='text-white mt-3 ml-2'>
        <h3>
          {name}
        </h3>
        <p className='text-gray'>
          {description}
        </p>
      </div>
    </div>
  );
}

interface ProjectsProps {
  name: string;
  img: StaticImageData
  alt: string;
  link: string;
  description: string;
}