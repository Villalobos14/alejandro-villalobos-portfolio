import type { ReactNode } from "react";
import MaskedLines from "../ui/MaskedLines";
import PetGlyphOrigin from "../pet-world/PetGlyphOrigin";
import { homeHeroContent } from "@/lib/home-hero";

const { role, petGlyph } = homeHeroContent;

/** The line with Calcifer's letter in it, or the line unchanged. The text itself is never altered. */
function withPet(line: string): ReactNode {
  const word = line.indexOf(petGlyph.word);
  const letter = word < 0 ? -1 : line.indexOf(petGlyph.letter, word);

  if (letter < 0 || letter >= word + petGlyph.word.length) return line;

  return (
    <>
      {line.slice(0, letter)}
      <PetGlyphOrigin petId="calcifer" perch>
        {petGlyph.letter}
      </PetGlyphOrigin>
      {line.slice(letter + 1)}
    </>
  );
}

/*
 * PRODUCT DESIGNER is the h1, left-aligned with "I’m a". Calcifer sits in the
 * "G" of DESIGNER, perched on top of it, so that line keeps the taller mask:
 * its top bleed (0.9em, offset by the same negative margin) holds his whole body.
 */
export default function HeroStatement({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-[24px] leading-none text-ink-secondary">{role.lead}</p>
      <MaskedLines
        as="h1"
        lines={[withPet(role.title)]}
        className="max-w-full text-[clamp(44px,14.5vw,64px)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink md:text-[clamp(2.5rem,6.667vw,96px)]"
        maskClassName="py-[0.08em] md:-mb-[0.32em] md:-mt-[0.9em] md:pb-[0.24em] md:pt-[0.9em]"
      />
    </div>
  );
}
