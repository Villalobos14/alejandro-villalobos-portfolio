import type { Metadata } from "next";
import Link from "next/link";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import Accordion, { type AccordionItem } from "@/components/about/Accordion";
import ClosingBlock from "@/components/about/ClosingBlock";
import PageIntro from "@/components/about/PageIntro";
import ProfessionalGrid from "@/components/about/ProfessionalGrid";
import Reveal from "@/components/ui/Reveal";
import SkillPill from "@/components/ui/SkillPill";
import { siteLinks } from "@/lib/links";
import {
  collaborationCopy,
  education,
  focusCopy,
  profile,
  skillGroups,
} from "@/lib/professional";

export const metadata: Metadata = {
  title: "About · Professional | Alejandro Villalobos",
  description:
    "Product Designer working across design, software engineering, and UX research.",
};

const linkStyles =
  "text-label text-gray transition-colors duration-300 fine:hover:text-secondary focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const items: AccordionItem[] = [
  {
    id: "focus",
    title: "Focus",
    content: (
      <div className="flex max-w-3xl flex-col gap-6">
        {focusCopy.map((paragraph) => (
          <p key={paragraph} className="text-body-lg text-gray">
            {paragraph}
          </p>
        ))}
      </div>
    ),
  },
  {
    id: "collaboration",
    title: "Collaboration",
    content: (
      <div className="flex max-w-3xl flex-col gap-6">
        {collaborationCopy.map((paragraph) => (
          <p key={paragraph} className="text-body-lg text-gray">
            {paragraph}
          </p>
        ))}
      </div>
    ),
  },
  {
    id: "tools",
    title: "Tools and capabilities",
    content: (
      <div className="flex flex-col gap-scale">
        {skillGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-3">
            <h4 className="text-label text-white">{group.title}</h4>
            <div className="flex flex-wrap gap-3 text-white">
              {group.skills.map((skill) => (
                <SkillPill key={skill} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "education-contact",
    title: "Education and contact",
    content: (
      <div className="flex flex-col gap-scale">
        <ul className="flex flex-col gap-scale">
          {education.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-1">
              <p className="text-label text-white">{entry.title}</p>
              <p className="text-body text-gray">{entry.detail}</p>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {siteLinks.map((link) => (
            <li key={link.id}>
              {link.href.startsWith("/") ? (
                <TransitionLink
                  href={link.href}
                  data-cursor={`Abrir ${link.label}`}
                  className={linkStyles}
                >
                  {link.label}
                </TransitionLink>
              ) : (
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor={`Abrir ${link.label}`}
                  className={linkStyles}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="01 — Professional"
        lines={["About", "professional"]}
        presentation={profile.summary}
        active="professional"
      />
      <ProfessionalGrid />
      <Reveal className="w-full px-[var(--page-gutter)]">
        <Accordion items={items} label="Additional professional information" />
      </Reveal>
      <ClosingBlock label="Next" title="Fun" href="/fun" />
    </>
  );
}
