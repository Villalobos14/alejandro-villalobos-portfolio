import { homeHeroContent } from "@/lib/home-hero";
import { heroColumnLabel, heroColumnText } from "./styles";

const { practice } = homeHeroContent;

/**
 * The discipline, and what it draws on set under it: one title over a rule
 * as long as the title, then attributes in a quieter voice, never four
 * titles side by side. Typography only. The title anchors the right column:
 * a secondary heading, still a long way under the statement.
 */
export default function HeroPractice({ className = "" }: { className?: string }) {
  return (
    <div data-hero-enter data-field-quiet className={className}>
      <p className={heroColumnLabel}>{practice.label}</p>
      <p className="mt-4 inline-block border-b border-white/30 pb-3 text-[clamp(1.5rem,2.1vw,2rem)] font-medium leading-[1.1] tracking-[-0.01em] text-white">
        {practice.discipline}
      </p>
      <ul className={`mt-4 leading-[1.6] text-white/70 ${heroColumnText}`}>
        {practice.attributes.map((attribute) => (
          <li key={attribute}>{attribute}</li>
        ))}
      </ul>
    </div>
  );
}
