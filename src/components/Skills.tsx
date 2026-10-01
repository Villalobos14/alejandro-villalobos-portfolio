import SkillPill from "./ui/SkillPill";
import { skillGroups } from "@/lib/professional";

export default function SkillsSection() {
  return (
    <section className="w-full px-[var(--page-gutter)] py-8 text-white md:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillGroups.map((group) => (
          <div key={group.id}>
            <h2 className="text-4xl font-medium mb-6">{group.title}</h2>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <SkillPill key={skill} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
