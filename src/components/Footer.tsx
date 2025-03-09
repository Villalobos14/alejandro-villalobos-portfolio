import Link from "next/link";
import { FooterTitle } from "../components/ui/FooterTitle";

export default function Footer() {
  const links = [
    {
      id: 1,
      href: "https://www.behance.net/Villalobos14",
      label: "Behance",
    },
    {
      id: 2,
      href: "https://github.com/Villalobos14",
      label: "Github",
    },
    {
      id: 3,
      href: "https://www.linkedin.com/in/joshua-alejandro-villalobos-estrada-60194b224/",
      label: "LinkedIn",
    },
    {
      id: 4,
      href: "https://dribbble.com/Villaalobos14",
      label: "Dribbble",
    },
    {
      id: 5,
      href: "https://www.instagram.com/villaalobos14/",
      label: "Instagram",
    },
    {
      id: 6,
      href: "https://drive.google.com/file/d/1LsBpwTRqWjsmC26jEOBiApvok9ws_uG1/view?usp=drive_link",
      label: "Resumé",
    },
  ];

  return (
    <footer className="mt-32 mb-16 sm:mb-0 text-gray mx-16">
      <div className="border-b border-b-dim-gray pb-6">
        <span className="sr-only">VILLALOBOS</span>
        <FooterTitle />
      </div>
      <div className="flex flex-col gap-y-12 gap-x-2 md:flex-row items-start justify-between pt-6 pb-10 text-text">
        <div className="gap-y-4 b-8 flex flex-col text-base xl:text-h6 2xl:text-h5">

          <div className="flex w-56 gap-x-1 xl:w-96 ">
            <span className="w-fit flex-nowrap whitespace-nowrap">
              Made by{" "}
            </span>
            <Link
              className="font-bold relative overflow-y-hidden w-full group h-fit"
              target="_blank"
              href="https://www.villaalobos.com"
            >
              <span className="flex group-hover:-translate-y-5 group-hover:opacity-0 transition-all ease-in-out-circ duration-500">
                Villalobos
              </span>
              <span className="absolute inset-0 group-hover:translate-y-0 translate-y-5 xl:translate-y-8 transition-all ease-in-out-circ duration-500 underline flex-nowrap whitespace-nowrap">
              Villalobos :)
              </span>
            </Link>
          </div>
        </div>
        <ul className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid xl:grid-cols-3 gap-x-8 gap-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex w-fit group text-base xl:text-h7 2xl:text-h6"
            >
              {link.id === 2 || link.id === 4 ? (
                <Link
                  className="group"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </Link>
              ) : (
                <Link 
                className="group" 
                 target="_blank"
                href={link.href}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
