export default function SkillsSection() {
  const designSkills = [
    "User Experience (UX)",
    "Accessibility (WCAG)",
    "User Interface (UI)",
    "Design Systems",
    "Wireframing",
    "UI Animations",
    "User Research",
    "Information Architecture (IA)",
  ];

  const softSkills = [
    "Cross-functional collaboration",
    "Stakeholder communication",
    "Empathy",
    "Problem-solving",
    "Critical thinking",
    "Creativity",
    "Attention to detail",
  ];

  return (
    <section className="w-full mx-auto md:px-20 p-8 text-white md:pt-16" id="skills">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-medium mb-6">Design Skills</h2>
          <div className="flex flex-wrap gap-3">
            {designSkills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text- border-[0.1px] border-gray-300 rounded-full text-gray"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-medium mb-6 ">Soft Skills</h2>
          <div className="flex flex-wrap gap-3">
            {softSkills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-gray-700 border-[0.1px] border-gray-300 rounded-full text-gray"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
