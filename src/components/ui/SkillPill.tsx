export default function SkillPill({ skill }: { skill: string }) {
  return (
    <span className="group relative overflow-hidden rounded-full border-[0.1px] border-gray-300 px-4 py-2 text-gray-300 transition-colors duration-700 hover:text-black">
      <span className="absolute inset-x-0 bottom-0 h-0 bg-secondary transition-all duration-700 ease-in-out group-hover:h-full" />
      <span className="relative z-10">{skill}</span>
    </span>
  );
}
