import Link from "next/link";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { FooterTitle } from "../components/ui/FooterTitle";
import BackToTop from "./ui/BackToTop";
import { contactEmail, siteLinks, type SiteLink } from "@/lib/links";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const MAT_NUMBERS = Array.from({ length: 24 }, (_, index) => index * 5);

function footerLink(link: SiteLink): { href: string; label: string; download: boolean } {
  if (link.id === "resume") {
    // TODO(content): public/cv.pdf is not in the repo yet.
    return { href: "/cv.pdf", label: "CV", download: true };
  }

  return { href: link.href, label: link.label, download: false };
}

export default function Footer() {
  return (
    <footer className="relative mt-32 w-full overflow-hidden bg-bg text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--mat-major))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--mat-major))_1px,transparent_1px),linear-gradient(to_right,rgb(var(--mat-minor))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--mat-minor))_1px,transparent_1px)] [background-size:5rem_5rem,5rem_5rem,1rem_1rem,1rem_1rem]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-2 flex" aria-hidden="true">
        {MAT_NUMBERS.map((number) => (
          <span key={number} className="w-20 shrink-0 text-mono-s text-mat-number">
            {number}
          </span>
        ))}
      </div>
      <div className="relative px-[var(--page-gutter)] pb-10 pt-10">
        <div className="pb-6">
          <span className="sr-only">Villalobos</span>
          <FooterTitle />
        </div>
        <div className="flex flex-col items-start justify-between gap-x-2 gap-y-12 border-t border-border pt-6 md:flex-row">
          <div className="flex flex-col gap-y-4 text-body-s text-ink-secondary">
            <div className="flex w-56 gap-x-1 xl:w-96">
              <span className="w-fit flex-nowrap whitespace-nowrap">Made by </span>
              <Link
                className="group relative h-fit w-full overflow-y-hidden font-bold focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                target="_blank"
                href="https://www.villaalobos.com"
                data-cursor="Abrir web"
              >
                <span className="flex transition-all duration-500 ease-in-out-circ group-hover:-translate-y-5 group-hover:opacity-0">
                  Villalobos
                </span>
                <span className="absolute inset-0 flex translate-y-5 flex-nowrap whitespace-nowrap underline transition-all duration-500 ease-in-out-circ group-hover:translate-y-0 xl:translate-y-8">
                  Villalobos :)
                </span>
              </Link>
            </div>
            <BackToTop />
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 lg:grid-cols-3">
            <li>
              <a
                href={`mailto:${contactEmail}`}
                className={`text-mono text-ink-secondary transition-colors duration-300 fine:hover:text-ink active:text-ink ${focusStyles}`}
              >
                Email
              </a>
            </li>
            {siteLinks.map((link) => {
              const item = footerLink(link);

              return (
                <li key={link.id}>
                  {item.download ? (
                    <a
                      href={item.href}
                      download
                      className={`text-mono text-ink-secondary transition-colors duration-300 fine:hover:text-ink active:text-ink ${focusStyles}`}
                    >
                      {item.label}
                    </a>
                  ) : item.href.startsWith("/") ? (
                    <TransitionLink
                      href={item.href}
                      className={`text-mono text-ink-secondary transition-colors duration-300 fine:hover:text-ink active:text-ink ${focusStyles}`}
                      data-cursor={`Abrir ${item.label}`}
                    >
                      {item.label}
                    </TransitionLink>
                  ) : (
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-mono text-ink-secondary transition-colors duration-300 fine:hover:text-ink active:text-ink ${focusStyles}`}
                      data-cursor={`Abrir ${item.label}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
