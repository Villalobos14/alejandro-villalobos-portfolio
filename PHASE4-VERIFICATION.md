# Fase 4 — inventario previo a la eliminación

Se revisaron referencias con `rg -n -F` y se siguieron imports desde las rutas de `src/app`. Las referencias entre archivos huérfanos no equivalen a montaje en una página.

| Archivo | Referencias importadoras actuales | Decisión |
|---|---|---|
| `src/lib/og.tsx` | `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/fine-pointer.ts` | `src/components/HeroHoverText.tsx`, `src/components/hero/HeroField.tsx`, `src/components/pet-world/PetWorldProvider.tsx`, `src/components/CustomCursor.tsx`, `src/components/pet-world/world/pointer.ts`, `src/components/home/HomePersonal.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/professional.ts` | `src/lib/about.ts`, `src/lib/home-hero.ts`, `src/components/Skills.tsx`, `src/components/Experience.tsx`, `src/components/about/ProfessionalGrid.tsx`, `src/components/about/ProfessionalThinking.tsx`, `src/components/about/ProfessionalHero.tsx`, `src/components/about/ProfessionalExperience.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/media.ts` | `src/lib/fun.ts`, `src/lib/personal.ts`, `src/components/media/Lightbox.tsx`, `src/components/media/PhotoButton.tsx`, `src/components/media/LightboxProvider.tsx`, `src/components/case-study/CaseVisual.tsx`, `src/components/fun/HorizontalGallery.tsx`, `src/content/case-studies/mlstoolbox.ts` | Conservar: alcanzable desde las rutas. |
| `src/lib/home-narrative.ts` | `src/components/home/HomePersonal.tsx`, `src/components/home/MarkerSentence.tsx`, `src/components/home/HomeTimeline.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/fun.ts` | `src/components/fun/FunCta.tsx`, `src/components/fun/CameraRoll.tsx`, `src/components/fun/FunHero.tsx`, `src/components/fun/EverydayNotes.tsx`, `src/app/fun/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/links.ts` | `src/components/Footer.tsx`, `src/components/home/HomeDock.tsx`, `src/components/projects/ProjectsLog.tsx`, `src/components/about/ProfessionalClosing.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/about.ts` | `src/app/about/page.tsx`, `src/components/about/BeyondJob.tsx`, `src/components/about/AboutHeader.tsx`, `src/components/about/ProfessionalThinking.tsx`, `src/components/about/ProfessionalHero.tsx`, `src/components/about/ProfessionalExperience.tsx`, `src/components/about/ProfessionalCapabilities.tsx`, `src/components/about/ProfessionalClosing.tsx`, `src/components/about/AboutExperience.tsx`, `src/components/about/HowIWork.tsx`, `src/components/about/AboutCta.tsx`, `src/components/about/AboutToolkit.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/home-hero.ts` | `src/components/hero/HeroStatement.tsx`, `src/components/hero/HeroPractice.tsx`, `src/components/Hero.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/case-studies.ts` | `src/components/case-study/CaseStudySpyNav.tsx`, `src/components/case-study/CaseStudyHero.tsx`, `src/components/case-study/mdx-components.tsx`, `src/components/case-study/CaseStudyLayout.tsx`, `src/components/case-study/SeeNext.tsx`, `src/app/work/[slug]/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/motion.ts` | `src/components/media/Lightbox.tsx`, `src/components/media/VideoMedia.tsx`, `src/components/case-study/CaseStudySpyNav.tsx`, `src/components/case-study/system/ChapterNav.tsx`, `src/components/case-study/system/MlsCaseStudy.tsx`, `src/components/case-study/system/CaseAnchor.tsx`, `src/components/hero/HeroField.tsx`, `src/components/hero/HeroComposition.tsx`, `src/components/pet-world/world/world.ts`, `src/components/home/MarkerSentence.tsx`, `src/components/home/HomeNarrative.tsx`, `src/components/home/HomeDock.tsx`, `src/components/home/desktop-motion.ts`, `src/components/fun/HorizontalGallery.tsx`, `src/components/fun/CameraRoll.tsx`, `src/components/fun/EverydayNotes.tsx`, `src/components/ui/BackToTop.tsx`, `src/components/ui/HashScroll.tsx`, `src/components/about/BeyondJob.tsx`, `src/components/projects/ProfessionalWork.tsx`, `src/components/projects/StackedProjects.tsx`, `src/components/projects/SideProjectsLog.tsx`, `src/components/ui/AnchorLink.tsx`, `src/components/about/AboutExperience.tsx`, `src/components/ui/RevealHeading.tsx`, `src/components/about/HowIWork.tsx`, `src/components/ui/MaskedLines.tsx`, `src/components/ui/Reveal.tsx`, `src/components/about/AboutToolkit.tsx`, `src/components/about/sketches/SketchFrame.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/site.ts` | `src/lib/og.tsx`, `src/app/page.tsx`, `src/app/fun/page.tsx`, `src/app/layout.tsx`, `src/app/projects/page.tsx`, `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/side-projects.ts` | `src/components/projects/SideProjectsLog.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/cv.ts` | `src/components/Footer.tsx`, `src/app/resume/route.ts`, `src/components/about/AboutCta.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/projects.ts` | `src/components/case-study/system/MlsCaseStudy.tsx`, `src/components/case-study/CaseStudyHero.tsx`, `src/components/Hero.tsx`, `src/components/Projects.tsx`, `src/components/home/HomeDock.tsx`, `src/components/projects/ProjectCard.tsx`, `src/components/projects/ProfessionalWork.tsx`, `src/components/projects/StackedProjects.tsx`, `src/components/about/ProfessionalClosing.tsx` | Conservar: alcanzable desde las rutas. |
| `src/lib/personal.ts` | `src/components/fun/Collage.tsx`, `src/components/fun/PersonalBlocks.tsx`, `src/components/fun/FunHeroLegacy.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/FunCta.tsx` | `src/app/fun/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/fun/HorizontalGallery.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/ScrollDepth.tsx` | `src/components/fun/Collage.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/FunClosing.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/Collage.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/PersonalBlocks.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/CameraRoll.tsx` | `src/app/fun/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/fun/motion.ts` | `src/components/fun/Collage.tsx`, `src/components/fun/PersonalBlocks.tsx`, `src/components/fun/CameraRoll.tsx`, `src/components/fun/FunHeroLegacy.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/fun/FunHero.tsx` | `src/app/fun/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/fun/FunHeroLegacy.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/fun/EverydayNotes.tsx` | `src/app/fun/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/curtain/TransitionLink.tsx` | `src/components/case-study/system/editorial.tsx`, `src/components/case-study/system/MlsCaseStudy.tsx`, `src/components/case-study/CaseStudyHero.tsx`, `src/components/case-study/SeeNext.tsx`, `src/components/system/AboutSwitch.tsx`, `src/components/Hero.tsx`, `src/components/Projects.tsx`, `src/components/home/HomePersonal.tsx`, `src/components/home/HomeTimeline.tsx`, `src/components/home/HomeDock.tsx`, `src/components/fun/FunCta.tsx`, `src/components/fun/FunClosing.tsx`, `src/components/ui/Projects.tsx`, `src/components/projects/ProjectCard.tsx`, `src/components/about/AboutSubNav.tsx`, `src/components/projects/ProfessionalWork.tsx`, `src/components/about/ClosingBlock.tsx`, `src/components/about/ProfessionalHero.tsx`, `src/components/about/ProfessionalExperience.tsx`, `src/components/about/ProfessionalClosing.tsx`, `src/components/about/AboutCta.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/curtain/CurtainPanel.tsx` | `src/components/curtain/CurtainProvider.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/curtain/timing.ts` | `src/components/curtain/CurtainPanel.tsx`, `src/components/curtain/CurtainProvider.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/curtain/CurtainProvider.tsx` | `src/components/curtain/TransitionLink.tsx`, `src/app/layout.tsx` | Conservar: alcanzable desde las rutas. |
| `src/app/fonts/SF-Medium.woff` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/app/fonts/SF-Regular.woff` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/app/fonts/SF-Bold.woff` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/AboutSubNav.tsx` | `src/components/fun/FunHeroLegacy.tsx`, `src/components/about/ProfessionalHero.tsx`, `src/components/about/PageIntro.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/Accordion.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/ProSection.tsx` | `src/components/fun/FunCta.tsx`, `src/components/fun/CameraRoll.tsx`, `src/components/fun/EverydayNotes.tsx`, `src/components/about/BeyondJob.tsx`, `src/components/projects/ProjectSection.tsx`, `src/components/about/AboutExperience.tsx`, `src/components/about/HowIWork.tsx`, `src/components/about/AboutCta.tsx`, `src/components/about/AboutToolkit.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/BeyondJob.tsx` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/ProfessionalGrid.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/ClosingBlock.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/SectionHead.tsx` | `src/components/about/ProfessionalThinking.tsx`, `src/components/about/ProfessionalExperience.tsx`, `src/components/about/ProfessionalCapabilities.tsx`, `src/components/about/ProfessionalClosing.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/tone.ts` | `src/components/about/SectionHead.tsx`, `src/components/about/ProfessionalThinking.tsx`, `src/components/about/ProfessionalHero.tsx`, `src/components/about/ProfessionalExperience.tsx`, `src/components/about/ProfessionalCapabilities.tsx`, `src/components/about/Responsibilities.tsx`, `src/components/about/ProfessionalClosing.tsx`, `src/components/about/AboutCta.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/AboutHeader.tsx` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/ProfessionalThinking.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/ProfessionalHero.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/GridBlock.tsx` | `src/components/about/ProfessionalGrid.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/ProfessionalExperience.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/ProfessionalCapabilities.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/Responsibilities.tsx` | `src/components/about/ProfessionalExperience.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/ProfessionalClosing.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/AboutExperience.tsx` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/PageIntro.tsx` | Ninguna | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/HowIWork.tsx` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/AboutCta.tsx` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/AboutToolkit.tsx` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/ProcessSketches.tsx` | `src/components/about/ProfessionalThinking.tsx`, `src/components/about/HowIWork.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/Marks.tsx` | `src/components/about/ProfessionalExperience.tsx`, `src/components/about/ProfessionalClosing.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/sketches/sketch.module.css` | `src/components/about/sketches/SketchFrame.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/InterfaceSketch.tsx` | `src/components/about/sketches/ProcessSketches.tsx`, `src/components/about/sketches/ThinkingDiagram.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/primitives.tsx` | `src/components/about/ProfessionalCapabilities.tsx`, `src/components/about/sketches/ProcessSketches.tsx`, `src/components/about/sketches/Marks.tsx`, `src/components/about/sketches/InterfaceSketch.tsx`, `src/components/about/sketches/ThinkingDiagram.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/geometry.ts` | `src/components/about/ProfessionalCapabilities.tsx`, `src/components/about/sketches/ProcessSketches.tsx`, `src/components/about/sketches/Marks.tsx`, `src/components/about/sketches/primitives.tsx`, `src/components/about/sketches/ThinkingDiagram.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/hand-font.ts` | `src/app/about/page.tsx` | Conservar: alcanzable desde las rutas. |
| `src/components/about/sketches/ThinkingDiagram.tsx` | `src/components/about/ProfessionalHero.tsx` | Eliminar: sin montaje; sus importadores también son huérfanos. |
| `src/components/about/sketches/SketchFrame.tsx` | `src/components/about/ProfessionalCapabilities.tsx`, `src/components/about/sketches/ProcessSketches.tsx`, `src/components/about/sketches/Marks.tsx`, `src/components/about/sketches/ThinkingDiagram.tsx` | Conservar: alcanzable desde las rutas. |

## Tipografía que se conserva

`text-label`: CaseStudyHero y componentes MDX. `text-display`: Impact y encabezados MDX. `text-body-lg`: Note y encabezados MDX. Las tres tienen usos, por lo que no se eliminan sus definiciones. Caveat está importada por `about/sketches/hand-font.ts` y se conserva.

## Evidencia de búsqueda de los candidatos retirados

### src/lib/personal.ts

```text
src/lib/home-narrative.ts:161:  personalStatement: {
src/lib/home-narrative.ts:170:  personalMeme: {
src/lib/home-narrative.ts:174:  personalPreview: [
src/lib/fun.ts:3:/** Phase 3e copy from the supplied brief. Legacy copy stays in personal.ts. */
src/lib/personal.ts:124:export const personalBlocks: PersonalBlock[] = [
src/components/pet-world/world/config.ts:33:  /** Base length of each timed state; personality stretches it. */
src/components/pet-world/world/pet.ts:240:  const length = pet.rng.range(range) * (0.75 + 0.25 * pet.def.personality.movementSpeed);
src/components/pet-world/world/pet.ts:289:  pet.until = now + (step?.ms ? pet.rng.range(step.ms) : durationFor(behavior, pet.def.personality, pet.rng));
src/components/pet-world/world/pet.ts:357:    personality: pet.def.personality,
src/components/pet-world/world/pet.ts:445:      const speed = base * pet.scale * pet.def.personality.movementSpeed * currentStride(pet.anim, pet.def.sprite);
src/components/home/HomePersonal.tsx:17:  const { src, alt } = homeNarrativeContent.personalMeme;
src/components/home/HomePersonal.tsx:191:        segments={homeNarrativeContent.personalStatement.segments}
src/components/home/HomePersonal.tsx:196:        {homeNarrativeContent.personalPreview.map((item) => (
src/components/home/HomePersonal.tsx:208:          See the personal side
src/components/pet-world/world/machine.ts:69:  personality: PetPersonality;
src/components/pet-world/world/machine.ts:102:  const p = ctx.personality;
src/components/pet-world/world/machine.ts:126:/** Picks the next state from `from`'s transitions, weighted by personality. */
src/components/pet-world/world/machine.ts:135:/** How long a timed state lasts, stretched by personality. Untimed states end on their own. */
src/components/home/NarrativeProvider.tsx:5:export type NarrativePanel = "professional" | "personal";
src/components/pet-world/world/types.ts:153:  personality: PetPersonality;
src/components/home/HomeNarrative.tsx:14:  { id: "personal", label: "Fun" },
src/components/home/HomeNarrative.tsx:24:    const next: NarrativePanel = event.key === "ArrowRight" ? "personal" : "professional";
src/components/home/HomeNarrative.tsx:94:        id="home-panel-personal"
src/components/home/HomeNarrative.tsx:95:        aria-labelledby="home-tab-personal"
src/components/home/HomeNarrative.tsx:96:        hidden={panel !== "personal"}
src/components/home/HomeNarrative.tsx:98:        {panel === "personal" ? <HomePersonal /> : null}
src/components/home/HomeNarrative.tsx:106:    <section id="home-narrative" aria-label="Practice and personal notes" className="w-full min-w-0">
src/components/pet-world/world/pets.ts:20:    personality: { curiosity: 0.85, energy: 0.6, shyness: 0.15, sleepiness: 0.35, movementSpeed: 1 },
src/components/pet-world/world/pets.ts:59:    personality: { curiosity: 0.45, energy: 0.3, shyness: 0.55, sleepiness: 0.7, movementSpeed: 0.7 },
src/components/pet-world/world/pets.ts:76:    personality: { curiosity: 0.6, energy: 0.4, shyness: 0.9, sleepiness: 0.4, movementSpeed: 0.8 },
src/components/about/ProfessionalClosing.tsx:88:            <span className="text-accent">02 — The personal side</span>
src/components/fun/FunHeroLegacy.tsx:5:import { funIntro, heroPhotos } from "@/lib/personal";
src/components/fun/FunHeroLegacy.tsx:21:            02 — The personal side
src/components/fun/PersonalBlocks.tsx:8:  personalBlocks,
src/components/fun/PersonalBlocks.tsx:11:} from "@/lib/personal";
src/components/fun/PersonalBlocks.tsx:13:const blockPhotos: Photo[] = personalBlocks
src/components/fun/PersonalBlocks.tsx:172:  if (personalBlocks.length === 0 && IS_PRODUCTION) return null;
src/components/fun/PersonalBlocks.tsx:175:  const pair = personalBlocks.filter((block) => pairIds.includes(block.id));
src/components/fun/PersonalBlocks.tsx:176:  const pairAt = personalBlocks.findIndex((block) => block.id === pairIds[0]);
src/components/fun/PersonalBlocks.tsx:183:      {personalBlocks.map((block, position) => {
src/components/fun/Collage.tsx:3:import { collagePhotos } from "@/lib/personal";
```

### src/components/fun/HorizontalGallery.tsx

```text
src/components/fun/HorizontalGallery.tsx:10:interface HorizontalGalleryProps {
src/components/fun/HorizontalGallery.tsx:20:export default function HorizontalGallery({
src/components/fun/HorizontalGallery.tsx:23:}: HorizontalGalleryProps) {
```

### src/components/fun/ScrollDepth.tsx

```text
src/components/fun/ScrollDepth.tsx:9:interface ScrollDepthProps {
src/components/fun/ScrollDepth.tsx:21:export default function ScrollDepth({ children, className }: ScrollDepthProps) {
src/components/fun/Collage.tsx:5:import ScrollDepth from "./ScrollDepth";
src/components/fun/Collage.tsx:78:      <ScrollDepth className="mx-auto flex max-w-[34rem] flex-col gap-12 md:max-w-xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
src/components/fun/Collage.tsx:114:      </ScrollDepth>
```

### src/components/fun/FunClosing.tsx

```text
src/components/fun/FunClosing.tsx:6:export default function FunClosing() {
```

### src/components/fun/Collage.tsx

```text
src/components/home/HomeTimeline.tsx:112:function CollageFrame({
src/components/home/HomeTimeline.tsx:611:          <CollageFrame
src/components/home/HomeTimeline.tsx:619:        <CollageFrame
src/components/fun/Collage.tsx:72:export default function Collage() {
```

### src/components/fun/PersonalBlocks.tsx

```text
src/components/fun/PersonalBlocks.tsx:171:export default function PersonalBlocks() {
```

### src/components/fun/FunHeroLegacy.tsx

```text
src/components/fun/FunHeroLegacy.tsx:14:export default function FunHeroLegacy() {
```

### src/app/fonts/SF-Medium.woff

```text

```

### src/app/fonts/SF-Regular.woff

```text

```

### src/app/fonts/SF-Bold.woff

```text

```

### src/components/about/AboutSubNav.tsx

```text
src/components/fun/FunHeroLegacy.tsx:1:import AboutSubNav from "@/components/about/AboutSubNav";
src/components/fun/FunHeroLegacy.tsx:38:            <AboutSubNav active="fun" />
src/components/about/ProfessionalHero.tsx:5:import AboutSubNav from "./AboutSubNav";
src/components/about/ProfessionalHero.tsx:63:            <AboutSubNav active="professional" />
src/components/about/AboutSubNav.tsx:5:interface AboutSubNavProps {
src/components/about/AboutSubNav.tsx:14:export default function AboutSubNav({ active }: AboutSubNavProps) {
src/components/about/PageIntro.tsx:3:import AboutSubNav, { type AboutView } from "./AboutSubNav";
src/components/about/PageIntro.tsx:28:        <AboutSubNav active={active} />
```

### src/components/about/Accordion.tsx

```text
src/components/about/Accordion.tsx:6:export interface AccordionItem {
src/components/about/Accordion.tsx:12:interface AccordionProps {
src/components/about/Accordion.tsx:13:  items: AccordionItem[];
src/components/about/Accordion.tsx:17:export default function Accordion({ items, label }: AccordionProps) {
```

### src/components/about/ProfessionalGrid.tsx

```text
src/components/about/ProfessionalGrid.tsx:11:export default function ProfessionalGrid() {
```

### src/components/about/ClosingBlock.tsx

```text
src/components/about/ClosingBlock.tsx:5:interface ClosingBlockProps {
src/components/about/ClosingBlock.tsx:11:export default function ClosingBlock({ label, title, href }: ClosingBlockProps) {
```

### src/components/about/SectionHead.tsx

```text
src/components/system/SectionHeader.tsx:3:export interface SectionHeaderProps {
src/components/system/SectionHeader.tsx:10:export default function SectionHeader({
src/components/system/SectionHeader.tsx:15:}: SectionHeaderProps) {
src/components/about/SectionHead.tsx:4:interface SectionHeadProps {
src/components/about/SectionHead.tsx:12:export default function SectionHead({ index, title, children }: SectionHeadProps) {
src/components/about/ProfessionalThinking.tsx:3:import SectionHead from "./SectionHead";
src/components/about/ProfessionalThinking.tsx:65:      <SectionHead index="02 — How I think" title={["From questions", "to systems."]}>
src/components/about/ProfessionalThinking.tsx:67:      </SectionHead>
src/components/about/ProfessionalExperience.tsx:6:import SectionHead from "./SectionHead";
src/components/about/ProfessionalExperience.tsx:77:      <SectionHead index="03 — Experience" title={["A career", "in layers."]}>
src/components/about/ProfessionalExperience.tsx:79:      </SectionHead>
src/components/about/ProfessionalCapabilities.tsx:2:import SectionHead from "./SectionHead";
src/components/about/ProfessionalCapabilities.tsx:94:      <SectionHead index="04 — Capabilities" title={["Tools are part", "of the process."]}>
src/components/about/ProfessionalCapabilities.tsx:99:      </SectionHead>
src/components/about/ProfessionalClosing.tsx:6:import SectionHead from "./SectionHead";
src/components/about/ProfessionalClosing.tsx:16:      <SectionHead index="05 — Direction" title={["The problems", "I want to solve."]} />
src/components/ui/SectionHeading.tsx:4:interface SectionHeadingProps {
src/components/ui/SectionHeading.tsx:12:export default function SectionHeading({
src/components/ui/SectionHeading.tsx:18:}: SectionHeadingProps) {
```

### src/components/about/ProfessionalThinking.tsx

```text
src/components/about/ProfessionalThinking.tsx:62:export default function ProfessionalThinking() {
```

### src/components/about/ProfessionalHero.tsx

```text
src/components/about/ProfessionalHero.tsx:35:export default function ProfessionalHero() {
```

### src/components/about/GridBlock.tsx

```text
src/components/about/ProfessionalGrid.tsx:7:import GridBlock from "./GridBlock";
src/components/about/ProfessionalGrid.tsx:17:      <GridBlock
src/components/about/ProfessionalGrid.tsx:25:      <GridBlock
src/components/about/ProfessionalGrid.tsx:41:      </GridBlock>
src/components/about/ProfessionalGrid.tsx:43:      <GridBlock
src/components/about/ProfessionalGrid.tsx:65:      </GridBlock>
src/components/about/ProfessionalGrid.tsx:67:      <GridBlock
src/components/about/ProfessionalGrid.tsx:78:      </GridBlock>
src/components/about/GridBlock.tsx:4:interface GridBlockProps {
src/components/about/GridBlock.tsx:14:export default function GridBlock({
src/components/about/GridBlock.tsx:22:}: GridBlockProps) {
```

### src/components/about/ProfessionalExperience.tsx

```text
src/components/about/ProfessionalExperience.tsx:74:export default function ProfessionalExperience() {
```

### src/components/about/ProfessionalCapabilities.tsx

```text
src/components/about/ProfessionalCapabilities.tsx:91:export default function ProfessionalCapabilities() {
```

### src/components/about/Responsibilities.tsx

```text
src/components/about/ProfessionalExperience.tsx:5:import Responsibilities from "./Responsibilities";
src/components/about/ProfessionalExperience.tsx:47:        <Responsibilities items={rest} />
src/components/about/Responsibilities.tsx:10:export default function Responsibilities({ items }: { items: string[] }) {
```

### src/components/about/ProfessionalClosing.tsx

```text
src/components/about/ProfessionalClosing.tsx:13:export default function ProfessionalClosing() {
```

### src/components/about/PageIntro.tsx

```text
src/components/about/PageIntro.tsx:5:interface PageIntroProps {
src/components/about/PageIntro.tsx:12:export default function PageIntro({
src/components/about/PageIntro.tsx:17:}: PageIntroProps) {
```

### src/components/about/sketches/Marks.tsx

```text
src/components/about/ProfessionalExperience.tsx:7:import { CircledWord, MarginNote } from "./sketches/Marks";
src/components/about/sketches/Marks.tsx:7: * Marks that sit on real text rather than inside a diagram: a margin note, a
src/components/about/ProfessionalClosing.tsx:7:import { UnderlinedPhrase } from "./sketches/Marks";
```

### src/components/about/sketches/ThinkingDiagram.tsx

```text
src/components/about/ProfessionalHero.tsx:6:import { HeroDiagram, HeroDiagramCompact } from "./sketches/ThinkingDiagram";
```

## Segunda pasada: usos por exportación

El grafo inicial era conservador: `about.ts` importaba `professional.ts`, pero solamente para exportaciones antiguas que ninguna ruta consume. La página actual usa `experienceSection` y `toolkitSection` con datos propios. `home-hero.ts` además importa `profile`: ese dato debe conservarse.

| Candidato | Usos antes de retirarlo |
|---|---|
| `src/components/About.tsx` | Ningún importador ni montaje; solo su definición. |
| `src/components/Experience.tsx` | Ningún importador tras retirar la página vieja `/resume`. |
| `src/components/Skills.tsx` | Ningún importador tras retirar la página vieja `/resume`. |
| `src/lib/professional.ts` | `profile` sigue importado por `home-hero.ts` y se conserva. Las demás exportaciones solo tenían consumidores antiguos. |
| Bloque anterior de `src/lib/about.ts` | `aboutHero`, `thinkingLead`, `experienceLead`, `thinkingStages`, `careerLayers`, `capabilityGroups`, `workingWith`, `closing` y sus tipos/auxiliares: cero usos externos tras retirar los componentes antiguos. |

Se retiran los tres componentes, el bloque antiguo de `about.ts` y las exportaciones sin uso de `professional.ts`; se preserva todo el copy PF27 actual.

Búsqueda individual de exportaciones fuera de `about.ts`:

```text
aboutHero: 0 coincidencias externas
thinkingLead: 0 coincidencias externas
experienceLead: 0 coincidencias externas
thinkingStages: 0 coincidencias externas
careerLayers: 0 coincidencias externas
capabilityGroups: 0 coincidencias externas
workingWith: 0 coincidencias externas
closing: 0 coincidencias externas
ThinkingStage: 0 coincidencias externas
CareerEntry: 0 coincidencias externas
CapabilityGroup: 0 coincidencias externas
```

### Exportaciones de professional.ts

Se conserva `profile`, usado en `home-hero.ts:38–40`. Se buscan individualmente las otras exportaciones antes de retirarlas:

```text
ExperienceEntry: 0 coincidencias externas
SkillGroup: 0 coincidencias externas
focusCopy: 0 coincidencias externas
collaborationCopy: 0 coincidencias externas
education: src/lib/home-narrative.ts:68:      id: "education",
src/lib/home-narrative.ts:73:        "A placeholder for education, early experiments and the moment interfaces started becoming a language.",
src/lib/home-narrative.ts:130:    education: [
src/lib/about.ts:82:  education: [
src/components/Works.tsx:50:              alt="Two Good Actions screens: a landing page headed “Transforming education with GoodActions” with a sign-up-with-wallet button, and a dark profile page showing a token wallet balance and a transaction list"
src/components/about/AboutExperience.tsx:38:        data-hairline="education"
src/components/about/AboutExperience.tsx:41:        {experienceSection.education.map((item) => (
experience: src/lib/home-hero.ts:54:      "I may not have 8 years of experience,",
src/lib/side-projects.ts:25:      body: "Web3 manga and comics publishing where creators keep ownership and get paid through transparent smart-contract royalties — with a reader experience that still feels familiar.",
src/components/case-study/system/diagrams.tsx:21:        <Step index="05" label="The same results experience, whichever analyzer produced the finding" />
src/components/about/AboutExperience.tsx:10:      id="about-experience"
src/components/about/AboutExperience.tsx:13:      hairline="experience"
src/components/about/AboutExperience.tsx:21:                data-hairline="experience-row"
src/content/case-studies/mlstoolbox.ts:31:  part: "The assessment experience end to end, and the ML cohesion metrics the principal researcher defined — implemented in Python, Flask and Angular. I didn’t create MLSToolbox or CodeAssessment from zero.",
src/content/case-studies/mlstoolbox.ts:52:  title: "Four decisions that changed the experience.",
researchContract: 0 coincidencias externas
skillGroups: 0 coincidencias externas
findSkillGroup: 0 coincidencias externas
```
Las coincidencias de palabras genéricas como “experience” o “education” son copy o propiedades independientes, no imports del módulo.

## Rutas internas y CV

- Eliminados `src/app/system/page.tsx` y `src/middleware.ts`: el middleware solo reescribía `/_system` a `/system` y no tenía otro uso.
- Eliminada la página anterior `src/app/resume/page.tsx`; sustituida por un route handler estático que responde 404 sin PDF y 308 con `Location: /cv.pdf` cuando existe.
- `Footer` y `AboutCta` usan la misma comprobación de archivo del servidor. Añadir `public/cv.pdf` y reconstruir/desplegar basta para activar ambas cosas. No se envía código de filesystem al navegador.
- Prueba con archivo temporal local: `/cv.pdf` 200; `/resume` 308 hacia `/cv.pdf`; un enlace al PDF en Home y dos en About. El archivo temporal se eliminó antes del build final y no se incluye en Git.

## Contraste

La fórmula de luminancia relativa da 4.5422249596:1 para `#767676` sobre blanco. Pasa AA para texto normal (umbral 4.5:1) y grande (3:1), sin redondear para decidir. Referencia: [WCAG 2.2, Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Los fallos encontrados estaban sobre otros fondos:

| Estado anterior | Relación | Cambio |
|---|---:|---|
| Contador del filtro activo, 14 px, gris sobre `#121212` | 4.1243:1 | `on-ink-secondary`: 7.1123:1 |
| Etiquetas móviles Type/Built with/Result, 10 px, acordeón abierto sobre `#F5F5F5` | 4.1663:1 | `ink-secondary`: 6.3261:1 |
| Home: eyebrow MLS, cifras anteriores de 20 px y nota de validación de 11/15 px sobre gris | 4.1663:1 | `ink-secondary`: 6.3261:1 |
| Fun: “photos coming”, 11 px sobre gris | 4.1663:1 | `ink-secondary`: 6.3261:1 |
| MLS: rótulos de visuales de 12/11 px y etiqueta “A decision I dropped”, 11 px sobre gris | 4.1663:1 | `ink-secondary`: 6.3261:1 |
| About: tres rótulos de fotos pendientes sobre gris | 4.1663:1 | Se retiraron los placeholders fuera del caso de estudio; se conservan títulos y copy. |

`--ink-muted` se conserva: el token sobre blanco ya cumplía. Las correcciones son específicas para superficies distintas.

## Metadatos

OG y Twitter comparten `renderSiteOgImage`: fondo `#FFFFFF`, texto `#121212`, acento `#1F6B4A`, texto secundario `#767676`. La imagen generada de 1200 × 630 se inspeccionó visualmente. El archivo `opengraph-image.tsx` ya delegaba en esta función y no necesitó cambios propios.

Se unifica el título base como Product Designer. Los casos ahora incluyen canonical, Open Graph y Twitter específicos; Ominio y Andanac reutilizan los resúmenes existentes de `featuredProjects`, sin inventar copy.

| Ruta | Title | Description |
|---|---|---|
| `/` | Alejandro Villalobos — Product Designer | Selected product design and UX by Alejandro Villalobos. |
| `/about` | About · Professional · Alejandro Villalobos | I’m a product designer with a software-engineering degree and a UX-research job at HSBC. I make complex products easier to understand, use and build — and I’m happiest where research, design and code meet. |
| `/fun` | About · Fun · Alejandro Villalobos | Music most of the time. Cities when I can get to them. Photos and short video of whatever I don’t want to forget. |
| `/projects` | Projects · Alejandro Villalobos | Selected product design and UX work by Alejandro Villalobos. |
| `/work/mlstoolbox` | MLSToolbox — CodeAssessment · Alejandro Villalobos | I redesigned CodeAssessment and built its new assessment flow inside MLSToolbox, so ML engineers can review a pipeline and act on prioritized, file-level issues instead of a single cohesion score. |
| `/work/ominio` | Ominio · Alejandro Villalobos | A gamified, AI-driven soft-skills app for students and early-career professionals. |
| `/work/andanac` | Andanac · Alejandro Villalobos | An internal intranet redesign: workflows, a design system and ~150–200 responsive screens. |

## Verificación final

Build de producción local, sin PDF de prueba:

| URL | Código |
|---|---:|
| `/_system` | 404 |
| `/system` | 404 |
| `/resume` | 404 |
| `/cv.pdf` | 404 |

Las siete páginas públicas responden 200. Ninguna contiene enlaces a `/cv.pdf` o `/resume` mientras falta el PDF. No hay texto “Pendiente” en Home, About, Fun, Projects, Ominio ni Andanac; quedan siete marcadores de visuales en MLS, permitidos por el alcance. El copy aún pendiente de los disclosures de MLS se conserva.

Teclado real mediante Chrome headless/CDP, a 1440 y 375 px:

- Dock: orden Home → Work → About → Fun → Say hi; foco visible de 2 px. No se activó el enlace de correo.
- Filtros: Tab recorre All → Hackathons → Open source → Team → Visual. Enter/Espacio cambian `aria-pressed` y producen 5/2/1/1/1 resultados respectivamente.
- Los cinco acordeones de Projects, los tres de investigación de Home en móvil y los dos disclosures de MLS alternan con Enter y Espacio. El foco permanece en el botón. Los paneles cerrados de Projects no incluyen sus enlaces en el recorrido de Tab.
- Se corrigió la exposición del contenido cerrado de MLS con `aria-hidden` y `visibility`, manteniendo la animación.
- Sin `tabindex` positivo ni interactivos recorridos sin foco visible. Se revisan estilos computados de outline/box-shadow, no solamente la existencia de clases en el código.
- Auditoría de `ink-muted` en las siete páginas a ambos anchos: cero fallos tras los ajustes. Esto es una comprobación del alcance solicitado, no una certificación WCAG completa del sitio.

`npm run build`, `npm run lint` y `git diff --check`: correctos. Se mantienen dos avisos previos de `@next/next/no-img-element` en HomePersonal y HomeTimeline; no hay errores de lint ni de TypeScript. El build también informa de la base Browserslist antigua, sin bloquearlo.

Se retiró además la excepción temporal PF27 en `.cursor/rules/modification-policy.mdc`, tal como indicaba su instrucción “retirar en la Fase 4”.
