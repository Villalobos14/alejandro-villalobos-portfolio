import Reveal from "@/components/ui/Reveal";
import { toolkitSection } from "@/lib/about";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import ProSection from "./ProSection";

/** 03 — Toolkit. The label sits above the value until the row is wide enough. */
export default function AboutToolkit() {
  return (
    <ProSection
      id="about-toolkit"
      eyebrow={toolkitSection.eyebrow}
      title={toolkitSection.title}
      hairline="toolkit"
      className="frame:min-h-[674px] frame:pt-[128px]"
    >
      <ul className="mt-8 frame:mt-8">
        {toolkitSection.rows.map((row, index) => (
          <li key={row.label}>
            <Reveal delayMs={index * REVEAL_STAGGER_MS}>
              <div
                data-hairline="toolkit-row"
                className={`grid grid-cols-1 gap-y-2 border-t border-border py-5 frame:grid-cols-[168px_1fr] frame:items-center frame:gap-x-6 frame:py-0 ${
                  "tall" in row && row.tall ? "frame:min-h-[107px]" : "frame:min-h-[76px]"
                }`}
              >
                <p className="text-mono text-ink-muted">{row.label}</p>
                <p className="text-[20px] leading-[28px] text-ink">{row.value}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </ProSection>
  );
}
