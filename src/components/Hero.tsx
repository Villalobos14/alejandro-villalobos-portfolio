import { Fragment } from "react";
import MaskedLines from "./ui/MaskedLines";
import HeroField from "./hero/HeroField";
import PetGlyphOrigin from "./pet-world/PetGlyphOrigin";
import { profile } from "@/lib/professional";

/*
 * Below md the hero is deliberately shorter than the viewport, so the headline
 * sits well above the fold instead of at the bottom edge, and the section ends
 * clear of the dock without reserving room for it. From md up it fills the
 * viewport and reserves that room itself.
 */
export default function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative -mt-[var(--site-header-h)] flex min-h-[clamp(26rem,66svh,34rem)] w-full flex-col px-[var(--page-gutter)] pb-[clamp(1.5rem,4vh,2.5rem)] pt-[calc(var(--site-header-h)+1rem)] text-white md:min-h-[100dvh] md:pb-[calc(var(--dock-clearance)+clamp(0.5rem,3vh,2rem))]"
    >
      <HeroField />

      <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-gray/40 pb-scale text-body uppercase tracking-[0.2em] text-gray">
        <span>Based in {profile.location}</span>
        <span>{profile.availability}</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end lg:justify-center">
        <MaskedLines
          as="h1"
          lines={[
            <span key="name" className="font-medium">
              Alejandro Villalobos
            </span>,
            // Calcifer starts life as the "o". The text is still "Product".
            <Fragment key="role">
              Pr<PetGlyphOrigin petId="calcifer">o</PetGlyphOrigin>duct Designer creating
            </Fragment>,
            "AI products for people.",
          ]}
          className="w-full text-[clamp(1.55rem,7vw,9rem)] font-normal leading-[0.92] tracking-tight"
          lineClassName="whitespace-nowrap"
        />
      </div>
    </section>
  );
}
