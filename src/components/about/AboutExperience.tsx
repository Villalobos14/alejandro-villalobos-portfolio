import Reveal from "@/components/ui/Reveal";
import { experienceSection } from "@/lib/about";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import ProSection from "./ProSection";

/** 02 — Experience. Below the frame, date and role stack above the description. */
export default function AboutExperience() {
  return (
    <ProSection
      id="about-experience"
      eyebrow={experienceSection.eyebrow}
      title={experienceSection.title}
      hairline="experience"
      className="frame:min-h-[819px] frame:pt-[128px]"
    >
      <ol className="mt-8 frame:mt-8">
        {experienceSection.roles.map((role, index) => (
          <li key={role.company}>
            <Reveal delayMs={index * REVEAL_STAGGER_MS}>
              <div
                data-hairline="experience-row"
                className="grid grid-cols-1 gap-y-2 border-t border-border py-6 md:grid-cols-2 md:gap-x-6 md:py-5 frame:h-[118px] frame:grid-cols-[168px_428px_700px] frame:items-center frame:gap-x-0 frame:py-0"
              >
                <p className="text-mono text-ink-muted md:col-start-1 frame:col-start-1">{role.dates}</p>
                <div className="md:col-start-1 frame:col-start-2 frame:pl-20">
                  <p className="text-[26px] font-medium leading-[32px] text-ink">{role.company}</p>
                  <p className="mt-1.5 text-[15px] leading-[22px] text-ink-secondary">{role.role}</p>
                </div>
                <p className="text-[17px] leading-[27px] text-ink-secondary md:col-start-2 md:row-span-2 md:row-start-1 frame:col-span-1 frame:col-start-3 frame:row-span-1">
                  {role.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <div
        data-hairline="education"
        className="grid grid-cols-1 gap-y-6 border-t border-border py-6 md:grid-cols-2 md:gap-x-6 frame:h-[84px] frame:grid-cols-[660px_1fr] frame:gap-x-0 frame:py-0 frame:pl-14 frame:pt-[29px]"
      >
        {experienceSection.education.map((item) => (
          <div key={item.title}>
            <p className="text-[20px] font-medium leading-[28px] text-ink">{item.title}</p>
            <p className="mt-1 text-[15px] leading-[22px] text-ink-secondary">{item.detail}</p>
          </div>
        ))}
      </div>
    </ProSection>
  );
}
