import Image, { StaticImageData } from "next/image";
import NextLink from "next/link";
import { TransitionLink } from "@/components/curtain/TransitionLink";

function cursorLabelFor(link: string): string {
  if (link.startsWith("/work/")) return "Ver case study";
  if (link.includes("figma.com")) return "Ver en Figma";
  if (link.includes("behance.net")) return "Ver en Behance";
  return "Ver proyecto";
}

export default function Projects({ name, img, alt, link, description }: ProjectsProps) {
  const isExternal = link.startsWith("http");
  const className = "img group inline-block overflow-hidden duration-200 ease-linear hover:rounded-3xl";

  const image = (
    <Image
      className="h-auto w-full duration-700 ease-in-out group-hover:scale-105"
      src={img}
      alt={alt}
      width="800"
      height="600"
    />
  );

  return (
    <div>
      {isExternal ? (
        <NextLink
          target="_blank"
          rel="noreferrer"
          href={link}
          data-cursor={cursorLabelFor(link)}
          className={className}
        >
          {image}
        </NextLink>
      ) : (
        <TransitionLink
          href={link}
          data-cursor={cursorLabelFor(link)}
          className={className}
        >
          {image}
        </TransitionLink>
      )}
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