import Reveal from "@/components/ui/Reveal";
import { beyondSection } from "@/lib/about";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import ProSection from "./ProSection";

/** 04 — Beyond the job. Photos remain omitted until the assets exist. */
export default function BeyondJob() {
  return (
    <ProSection
      id="about-beyond"
      eyebrow={beyondSection.eyebrow}
      title={beyondSection.title}
      hairline="beyond"
      className="pb-16 frame:min-h-[741px] frame:pb-0 frame:pt-[128px]"
    >
      <ul className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-6 xl:grid-cols-3 frame:mt-10 frame:grid-cols-3 frame:gap-x-6">
        {beyondSection.columns.map((column, index) => (
          <li key={column.title} className="min-w-0">
            <Reveal delayMs={index * REVEAL_STAGGER_MS}>
              {/*
                TODO(content): photos for Teaching, Speaking and Hackathons. Each goes in a
                <figure data-cursor="pill" data-cursor-title={column.photo.caption}> with an
                sr-only <figcaption>{column.photo.caption}</figcaption>, so the caption is not cursor-only.
              */}
              <h3 className="mt-3 text-[20px] font-medium leading-[28px] text-ink">{column.title}</h3>
              <p className="mt-3 text-[15px] leading-[22px] text-ink-secondary">{column.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </ProSection>
  );
}
