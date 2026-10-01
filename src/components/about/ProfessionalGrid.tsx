import {
  experience,
  findSkillGroup,
  profile,
  skillGroups,
} from "@/lib/professional";
import GridBlock from "./GridBlock";

const PRACTICE_SKILLS = findSkillGroup("technical").skills.slice(0, 10);

export default function ProfessionalGrid() {
  return (
    <section
      aria-label="Professional information"
      className="grid w-full grid-cols-1 gap-scale px-[var(--page-gutter)] md:grid-cols-2 lg:grid-cols-8"
    >
      <GridBlock
        label="01 / Profile"
        title={profile.name}
        span="lg:col-span-3"
        text={profile.summary}
        meta={[`Based in ${profile.location}`, profile.availability]}
      />

      <GridBlock
        label="02 / Disciplines"
        title={profile.role}
        span="lg:col-span-5"
        delayMs={120}
      >
        <dl className="grid grid-cols-1 gap-scale sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              <dt className="text-label text-white">{group.title}</dt>
              <dd className="text-body text-gray">
                {group.skills.slice(0, 4).join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </GridBlock>

      <GridBlock
        label="03 / Experience"
        title="Experience"
        span="lg:col-span-5"
      >
        <ol className="flex flex-col gap-scale">
          {experience.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-1 border-t border-gray/30 pt-scale first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-scale"
            >
              <span className="text-label text-white">
                {entry.role}, {entry.company}
              </span>
              <span className="shrink-0 text-body text-gray">
                <time dateTime={entry.start.dateTime}>{entry.start.label}</time>
                {" — "}
                <time dateTime={entry.end.dateTime}>{entry.end.label}</time>
              </span>
            </li>
          ))}
        </ol>
      </GridBlock>

      <GridBlock
        label="04 / Practice"
        title="Practice"
        span="lg:col-span-3"
        delayMs={120}
      >
        <ul className="flex flex-col gap-1 text-body text-gray">
          {PRACTICE_SKILLS.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </GridBlock>
    </section>
  );
}
