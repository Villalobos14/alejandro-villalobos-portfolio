import Link from "next/link";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { FooterTitle } from "../components/ui/FooterTitle";
import BackToTop from "./ui/BackToTop";
import { siteLinks } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="mb-16 mt-32 w-full px-[var(--page-gutter)] text-gray sm:mb-0">
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
              data-cursor="Abrir web"
            >
              <span className="flex group-hover:-translate-y-5 group-hover:opacity-0 transition-all ease-in-out-circ duration-500">
                Villalobos
              </span>
              <span className="absolute inset-0 group-hover:translate-y-0 translate-y-5 xl:translate-y-8 transition-all ease-in-out-circ duration-500 underline flex-nowrap whitespace-nowrap">
              Villalobos :)
              </span>
            </Link>
          </div>
          <BackToTop />
        </div>
        <ul className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid xl:grid-cols-3 gap-x-8 gap-y-3">
          {siteLinks.map((link) => (
            <li
              key={link.id}
              className="flex w-fit group text-base xl:text-h7 2xl:text-h6"
            >
              {link.href.startsWith("/") ? (
                <TransitionLink
                  className="group"
                  href={link.href}
                  data-cursor={`Abrir ${link.label}`}
                >
                  {link.label}
                </TransitionLink>
              ) : (
                <Link
                  className="group"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor={`Abrir ${link.label}`}
                >
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
