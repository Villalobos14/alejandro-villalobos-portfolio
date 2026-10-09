import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ProfessionalCapabilities from "@/components/about/ProfessionalCapabilities";
import ProfessionalClosing from "@/components/about/ProfessionalClosing";
import ProfessionalExperience from "@/components/about/ProfessionalExperience";
import ProfessionalHero from "@/components/about/ProfessionalHero";
import ProfessionalThinking from "@/components/about/ProfessionalThinking";
import { handFont } from "@/components/about/sketches/hand-font";

export const metadata: Metadata = pageMetadata({
  title: "About · Professional | Alejandro Villalobos",
  description:
    "Product Designer working across design, software engineering, and UX research.",
  path: "/about",
});

/* Sketch strokes are server-rendered "armed" (undrawn). Without scripts they never play, so show them drawn. */
const NO_SCRIPT_SKETCHES = `[data-sketch="armed"] [data-draw]{opacity:1!important;stroke-dashoffset:0!important}[data-sketch="armed"] [data-appear]{opacity:1!important}[data-sketch="armed"] [data-dim]{opacity:.3!important}[data-sketch="armed"] [data-underline]{background-size:100% .32em!important}`;

export default function AboutPage() {
  return (
    <div className={`${handFont.variable} contents`}>
      <noscript>
        <style>{NO_SCRIPT_SKETCHES}</style>
      </noscript>
      <ProfessionalHero />
      <div className="contents [&>section]:mt-4 lg:[&>section]:mt-12">
        <ProfessionalThinking />
        <ProfessionalExperience />
        <ProfessionalCapabilities />
        <ProfessionalClosing />
      </div>
    </div>
  );
}
