import type { ReactNode } from "react";
import MaskedLines from "../ui/MaskedLines";
import PetGlyphOrigin from "../pet-world/PetGlyphOrigin";
import { homeHeroContent } from "@/lib/home-hero";

const { statement, role, petGlyph } = homeHeroContent;

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
 * The three titular lines are the h1. Calcifer sits in the first "O" of
 * PRODUCT, so that role line keeps the taller mask: his teleport rises to
 * about 1.05em above the baseline on a phone.
 */
export default function HeroStatement({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <MaskedLines
        as="h1"
        lines={[...statement.lines]}
        className="text-display-xl text-ink"
      />
      <p className="mt-6 flex flex-wrap items-baseline gap-y-1 sm:mt-8">
        <span className="text-h3 text-ink">{role.lead} </span>
        <MaskedLines
          as="span"
          lines={[withPet(role.title)]}
          className="w-max max-w-full shrink-0 text-display-l text-ink sm:ml-3"
          lineClassName="whitespace-nowrap"
          maskClassName="-mb-[0.32em] -mt-[0.24em] py-[0.24em]"
        />
      </p>
    </div>
  );
}
