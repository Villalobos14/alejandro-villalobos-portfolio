import { HANGING_DOT, sectionDotForLabel } from "./palette";

/** The pop dot before a numbered section label; its colour follows the section number. */
export default function SectionDot({ label }: { label: string }) {
  return <span aria-hidden="true" className={`${HANGING_DOT} ${sectionDotForLabel(label)}`} />;
}
