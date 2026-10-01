import MaskedLines from "@/components/ui/MaskedLines";
import Reveal from "@/components/ui/Reveal";
import AboutSubNav, { type AboutView } from "./AboutSubNav";

interface PageIntroProps {
  label: string;
  lines: [string, string];
  presentation: string;
  active: AboutView;
}

export default function PageIntro({
  label,
  lines,
  presentation,
  active,
}: PageIntroProps) {
  return (
    <header className="flex w-full flex-col gap-scale px-[var(--page-gutter)] pt-scale text-white">
      <p className="text-body uppercase tracking-[0.2em] text-gray">{label}</p>
      <MaskedLines
        as="h1"
        lines={lines}
        className="text-[clamp(2.5rem,11vw,9rem)] font-medium leading-[0.95] tracking-tight"
      />
      <Reveal className="flex flex-col gap-scale border-t border-gray/40 pt-scale md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-body-lg text-gray">{presentation}</p>
        <AboutSubNav active={active} />
      </Reveal>
    </header>
  );
}
