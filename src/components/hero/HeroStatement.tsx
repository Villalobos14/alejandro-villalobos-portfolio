import type { ReactNode } from "react";
import MaskedLines from "../ui/MaskedLines";
import PetGlyphOrigin from "../pet-world/PetGlyphOrigin";
import { homeHeroContent } from "@/lib/home-hero";

const { statement, petGlyph, annotation } = homeHeroContent;

/** The line with Calcifer's letter in it, or the line unchanged. The text itself is never altered. */
function withPet(line: string): ReactNode {
  const word = line.indexOf(petGlyph.word);
  const letter = word < 0 ? -1 : line.indexOf(petGlyph.letter, word);

  if (letter < 0 || letter >= word + petGlyph.word.length) return line;

  return (
    <>
      {line.slice(0, letter)}
      <PetGlyphOrigin petId="calcifer">{petGlyph.letter}</PetGlyphOrigin>
      {line.slice(letter + 1)}
    </>
  );
}

/*
 * Each line is one MaskedLines line: HeroField reads them (h1 > span > span)
 * to veil the field under the words. Calcifer's teleport rises to about
 * 1.05em above the baseline on a phone, where his scale rounds up to whole
 * device pixels, so the masks bleed 0.24em above the line instead of 0.16em.
 * The larger bottom pull keeps lines 1.12em apart, as with the default mask,
 * and a leading under 0.96 would let ascenders show before the reveal.
 */
export default function HeroStatement({ className = "" }: { className?: string }) {
  const lines = [...statement.lead, ...statement.trail];
  const petLine = lines.findIndex((line) => line.includes(petGlyph.word));
  const last = lines.length - 1;

  return (
    <MaskedLines
      as="h1"
      lines={lines.map((line, index) => (
        <span key={line} className={index < statement.lead.length ? undefined : "text-gray"}>
          {index === petLine ? withPet(line) : line}
          {index === last ? (
            <span aria-hidden="true" className="relative -top-[0.85em] text-[0.4em] text-gray">
              {annotation.marker}
            </span>
          ) : null}
        </span>
      ))}
      className={`text-[clamp(1.75rem,9.6vw,5.75rem)] font-normal leading-[0.96] tracking-tight text-white md:text-[min(9.6vw,11vh,5.75rem)] lg:text-[min(7vw,10vh,8rem)] ${className}`}
      lineClassName="whitespace-nowrap"
      maskClassName="-mb-[0.32em] -mt-[0.24em] py-[0.24em]"
    />
  );
}
