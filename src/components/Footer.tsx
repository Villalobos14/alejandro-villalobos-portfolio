import Link from "next/link";
import MaskedLines from "@/components/ui/MaskedLines";
import { FooterTitle } from "../components/ui/FooterTitle";
import { contactEmail, siteLinks } from "@/lib/links";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const MAT_NUMBERS = Array.from({ length: 24 }, (_, index) => index * 5);

const linkClass = `text-body-s text-ink transition-colors duration-300 fine:hover:text-accent active:text-accent ${focusStyles}`;

function siteHref(id: string): string {
  return siteLinks.find((link) => link.id === id)?.href ?? "#";
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
      <div className="page-container relative pb-10 pt-16">
        <p className="text-mono-s text-ink-muted">Say hi</p>
        <MaskedLines
          as="h2"
          lines={["Working on something complex?", "Let’s talk."]}
          className="mt-3 max-w-[12em] text-display-l text-ink"
        />
        <ul className="mt-8 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <li>
            <a href={`mailto:${contactEmail}`} className={`inline-flex min-h-11 items-center ${linkClass}`}>
              Email me ↗
            </a>
          </li>
          <li>
            <Link
              href={siteHref("linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center ${linkClass}`}
            >
              LinkedIn ↗
            </Link>
          </li>
          <li>
            <Link
              href={siteHref("github")}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center ${linkClass}`}
            >
              GitHub ↗
            </Link>
          </li>
          <li>
            {/* TODO(content): public/cv.pdf is not in the repo yet. */}
            <a href="/cv.pdf" download className={`inline-flex min-h-11 items-center ${linkClass}`}>
              CV (PDF) ↓
            </a>
          </li>
        </ul>
        <p className="mt-10 max-w-3xl text-body-s text-ink-secondary">
          Also on{" "}
          <Link href={siteHref("behance")} target="_blank" rel="noopener noreferrer" className={focusStyles}>
            Behance
          </Link>
          {" · "}
          <Link href={siteHref("dribbble")} target="_blank" rel="noopener noreferrer" className={focusStyles}>
            Dribbble
          </Link>
          {" · "}
          <Link href={siteHref("instagram")} target="_blank" rel="noopener noreferrer" className={focusStyles}>
            Instagram
          </Link>
          {"   ·   "}
          © 2026 Alejandro Villalobos · Built with Next.js
        </p>
        <div className="mt-10 border-t border-border pt-6">
          <span className="sr-only">Villalobos</span>
          <FooterTitle />
        </div>
      </div>
    </footer>
  );
}
