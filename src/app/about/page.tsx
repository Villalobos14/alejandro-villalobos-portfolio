import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";
import AboutHeader from "@/components/about/AboutHeader";
import HowIWork from "@/components/about/HowIWork";
import ProfessionalCapabilities from "@/components/about/ProfessionalCapabilities";
import ProfessionalClosing from "@/components/about/ProfessionalClosing";
import { handFont } from "@/components/about/sketches/hand-font";
import PageShell from "@/components/system/PageShell";
import { professionalHeader } from "@/lib/about";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About · Professional | Alejandro Villalobos",
  description: professionalHeader.deck,
  path: "/about",
});

/* Sketch strokes are server-rendered "armed" (undrawn). Without scripts they never play, so show them drawn. */
const NO_SCRIPT_SKETCHES = `[data-sketch="armed"] [data-draw]{opacity:1!important;stroke-dashoffset:0!important}[data-sketch="armed"] [data-appear]{opacity:1!important}[data-sketch="armed"] [data-dim]{opacity:.3!important}[data-sketch="armed"] [data-underline]{-webkit-mask-size:100% .32em!important;mask-size:100% .32em!important}`;

export default function AboutPage() {
  return (
    <PageShell>
      <div className={handFont.variable}>
        <noscript>
          <style>{NO_SCRIPT_SKETCHES}</style>
        </noscript>
        <div className="page-container">
          <AboutHeader />
          <HowIWork />
          <AboutExperience />
        </div>
        <ProfessionalCapabilities />
        <ProfessionalClosing />
      </div>
    </PageShell>
  );
}
