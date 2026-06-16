export default function SkillsSection() {
  const uxDesignSkills = [
    "User Experience Design",
    "Interaction Design",
    "Product Design",
    "User Flows",
    "Information Architecture",
    "Wireframing",
    "Prototyping",
    "High-Fidelity Design",
    "Component Design",
    "Design Systems",
    "Responsive Web Design",
    "Mobile Design",
    "Design Handoff",
    "Accessibility (WCAG)",
  ];

  const researchSkills = [
    "Mixed-Methods Research",
    "Evaluative Research",
    "Usability Testing",
    "User Interviews",
    "Contextual Inquiry",
    "Surveys",
    "Heuristic Evaluation",
    "Journey Mapping",
    "Research Synthesis",
    "Thematic Analysis",
    "Product Discovery",
  ];

  const technicalSkills = [
    "Technical UX",
    "AI-Assisted Tools",
    "AI/ML Workflows",
    "Developer Workflows",
    "Internal Tools",
    "Technical Audiences",
    "LLM Concepts",
    "Agentic AI Concepts",
    "Generative AI Tools",
    "Prompt Engineering",
    "Python",
    "Pandas",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Git",
    "GitHub",
  ];

  const softSkills = [
    "Cross-functional Collaboration",
    "Stakeholder Communication",
    "Design Rationale",
    "Design Critiques",
    "Strategic Alignment",
    "Workshop Facilitation",
    "Agile Workflows",
    "Problem-solving",
    "Critical Thinking",
    "Empathy",
    "Documentation",
  ];

  const SkillPill = ({ skill }: { skill: string }) => (
    <span className="group relative overflow-hidden rounded-full border-[0.1px] border-gray-300 px-4 py-2 text-gray-300 transition-colors duration-700 hover:text-black">
      <span className="absolute inset-x-0 bottom-0 h-0 bg-secondary transition-all duration-700 ease-in-out group-hover:h-full" />
      <span className="relative z-10">{skill}</span>
    </span>
  );

  return (
    <section className="w-full mx-auto md:px-20 p-8 text-white md:pt-16" id="skills">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-medium mb-6">UX Design</h2>
          <div className="flex flex-wrap gap-3">
            {uxDesignSkills.map((skill) => (
              <SkillPill key={skill} skill={skill} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-medium mb-6">Research</h2>
          <div className="flex flex-wrap gap-3">
            {researchSkills.map((skill) => (
              <SkillPill key={skill} skill={skill} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-medium mb-6">Technical</h2>
          <div className="flex flex-wrap gap-3">
            {technicalSkills.map((skill) => (
              <SkillPill key={skill} skill={skill} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-medium mb-6">Soft Skills</h2>
          <div className="flex flex-wrap gap-3">
            {softSkills.map((skill) => (
              <SkillPill key={skill} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}