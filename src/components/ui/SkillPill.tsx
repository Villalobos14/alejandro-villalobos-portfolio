export default function SkillPill({ skill }: { skill: string }) {
  return (
    <span className="group relative overflow-hidden rounded-full border border-border px-4 py-2 text-ink-muted transition-colors duration-700 hover:text-white">
      <span className="absolute inset-x-0 bottom-0 h-0 bg-accent transition-all duration-700 ease-in-out group-hover:h-full" />
      <span className="relative z-10">{skill}</span>
    </span>
  );
}
