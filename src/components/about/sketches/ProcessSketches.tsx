import type { ReactNode } from "react";
import {
  cubicArrow,
  curvedArrow,
  handCheck,
  handUnderline,
  roughEllipse,
  roughLine,
  roughRect,
} from "./geometry";
import { Draw, DrawArrow, Fade, Note, precise, type Frame } from "./primitives";
import { InterfaceSketch } from "./InterfaceSketch";
import SketchFrame from "./SketchFrame";

/**
 * One sketch per stage of "From questions to systems". They share a grammar:
 * handwriting is inquiry, 1px geometry is structure. Read in order, the marks
 * move from loose notes to a resolved interface, then back to a question.
 */

const F: Frame = { w: 480, h: 360 };
const CARD: Frame = { w: 306, h: 200 };

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <SketchFrame width={F.w} height={F.h} label={label} className="w-full">
      {children}
    </SketchFrame>
  );
}

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <SketchFrame width={CARD.w} height={CARD.h} label={label} className="w-full">
      {children}
    </SketchFrame>
  );
}

export function QuestionSketch({ label }: { label: string }) {
  return (
    <Panel label={label}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true">
        <g data-tone="muted">
          <Fade>
            <rect x={36} y={28} width={408} height={300} rx={10} {...precise} />
            <line x1={78} y1={28} x2={78} y2={328} {...precise} strokeOpacity={0.4} />
            {[94, 128, 162, 196, 230, 264, 298].map((y) => (
              <line key={y} x1={48} y1={y} x2={432} y2={y} stroke="var(--sk-faint)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
          </Fade>
        </g>
        <Draw d={roughEllipse(196, 156, 116, 27, 41)} delay={150} duration={420} />
        <DrawArrow arrow={curvedArrow([306, 176], [334, 214], 0.3, 43)} delay={500} duration={280} />
      </svg>
      <Note frame={F} x={94} y={112} size={36}>
        Are we solving the
      </Note>
      <Note frame={F} x={94} y={154} size={36}>
        right problem?
      </Note>
      <Note frame={F} x={318} y={238} size={28}>
        for whom?
      </Note>
      <Note frame={F} x={334} y={274} size={24} tone="muted" detail>
        why now?
      </Note>
      <Note frame={F} x={94} y={300} size={29} tone="accent">
        Start with curiosity.
      </Note>
    </Panel>
  );
}

const BUBBLES = [
  { id: "P1", x: 10, y: 8, w: 168, h: 38, r: -1.5, quote: "“I just export it”", size: 14 },
  { id: "P2", x: 16, y: 50, w: 176, h: 38, r: 1.2, quote: "“where’s the status?”", size: 13 },
  { id: "P3", x: 8, y: 92, w: 158, h: 38, r: -0.4, quote: "“I ask someone”", size: 14 },
] as const;

const DOTS: [number, number][] = [
  [214, 24],
  [228, 18],
  [242, 30],
  [256, 20],
  [270, 34],
  [284, 26],
  [224, 42],
  [248, 46],
  [266, 52],
  [286, 48],
];

export function UnderstandSketch({ label }: { label: string }) {
  return (
    <Card label={label}>
      <svg viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
        <g data-tone="muted">
          {BUBBLES.map((bubble) => (
            <Fade key={bubble.id}>
              <rect
                x={bubble.x}
                y={bubble.y}
                width={bubble.w}
                height={bubble.h}
                rx={8}
                {...precise}
                transform={`rotate(${bubble.r} ${bubble.x + bubble.w / 2} ${bubble.y + bubble.h / 2})`}
              />
            </Fade>
          ))}
          <Fade>
            {DOTS.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.2} fill="currentColor" />
            ))}
            <circle cx={270} cy={20} r={2.6} fill="var(--sk-ink)" />
          </Fade>
        </g>
        <Draw d={roughEllipse(270, 20, 12, 10, 47)} delay={180} duration={280} />
        <Draw d={handUnderline(14, 168, 178, 49)} tone="accent" delay={420} duration={260} />
      </svg>
      {BUBBLES.map((bubble) => (
        <span key={bubble.id}>
          <Note frame={CARD} x={bubble.x + 10} y={bubble.y + 12} size={11} tone="muted" rotate={bubble.r}>
            {bubble.id}
          </Note>
          <Note frame={CARD} x={bubble.x + 10} y={bubble.y + 26} size={bubble.size} rotate={bubble.r}>
            {bubble.quote}
          </Note>
        </span>
      ))}
      <Note frame={CARD} x={14} y={186} size={15} tone="accent">
        workarounds = signal
      </Note>
    </Card>
  );
}

const NODES = [
  { id: "people", label: "People", x: 12, y: 10, w: 74, h: 24 },
  { id: "product", label: "Product", x: 214, y: 8, w: 78, h: 24 },
  { id: "constraints", label: "Constraints", x: 8, y: 70, w: 104, h: 24 },
  { id: "data", label: "Data", x: 228, y: 64, w: 64, h: 24 },
  { id: "technology", label: "Technology", x: 104, y: 128, w: 104, h: 24 },
] as const;

const HUB: [number, number] = [168, 58];

export function ConnectSketch({ label }: { label: string }) {
  return (
    <Card label={label}>
      <svg viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
        <g data-tone="muted">
          <Fade>
            {NODES.map((node) => {
              const cx = node.x + node.w / 2;
              const cy = node.y + node.h / 2;
              return <line key={node.id} x1={cx} y1={cy} x2={HUB[0]} y2={HUB[1]} {...precise} strokeOpacity={0.7} />;
            })}
            <circle cx={HUB[0]} cy={HUB[1]} r={10} {...precise} />
          </Fade>
          {NODES.map((node) => (
            <Fade key={node.id}>
              <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={12} {...precise} fill="var(--sk-paper)" />
            </Fade>
          ))}
        </g>
        <Fade>
          <circle cx={HUB[0]} cy={HUB[1]} r={3.5} fill="var(--sk-accent)" />
        </Fade>
        <DrawArrow arrow={curvedArrow([132, 86], [158, 66], 0.2, 53, 7)} tone="accent" delay={280} duration={220} width={1.5} />
        <DrawArrow arrow={curvedArrow([70, 156], [36, 176], 0.3, 55, 7)} delay={520} duration={240} width={1.4} />
      </svg>
      {NODES.map((node) => (
        <Note
          key={node.id}
          frame={CARD}
          x={node.x + node.w / 2}
          y={node.y + node.h / 2}
          size={13}
          align="center"
        >
          {node.label}
        </Note>
      ))}
      <Note frame={CARD} x={86} y={100} size={15} tone="accent">
        decided here
      </Note>
      <Note frame={CARD} x={12} y={186} size={12} tone="muted">
        back to 01?
      </Note>
    </Card>
  );
}

export function MakeSketch({ label }: { label: string }) {
  const x = 22;
  const y = 12;
  const w = 196;
  const h = 140;

  return (
    <Card label={label}>
      <svg viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
        <g data-dim="" style={{ ["--dim" as string]: "720ms" }}>
          <Draw d={roughRect(x, y, w, h, 61)} duration={380} />
          <Draw d={roughLine([x, y + 18], [x + w, y + 18], 62, 0.01)} delay={240} duration={140} />
          <Draw d={roughRect(x + 8, y + 28, 36, h - 40, 63)} delay={320} duration={200} />
          <Draw d={roughLine([x + 54, y + 42], [x + w - 12, y + 42], 64, 0.012)} delay={420} duration={120} width={1.4} />
          <Draw d={roughLine([x + 54, y + 64], [x + w - 28, y + 66], 65, 0.012)} delay={480} duration={120} width={1.4} />
          <Draw d={roughLine([x + 54, y + 86], [x + w - 18, y + 84], 66, 0.012)} delay={540} duration={120} width={1.4} />
          <Draw d={roughLine([x + 54, y + 108], [x + w - 36, y + 110], 67, 0.01)} delay={600} duration={120} width={1.4} />
        </g>
        <InterfaceSketch x={x} y={y} w={w} h={h} sidebar={44} rows={3} appear={720} />
      </svg>
      <Note frame={CARD} x={290} y={184} size={14} align="right">
        rough → resolved
      </Note>
    </Card>
  );
}

const CHECKS = [
  { label: "Usability", y: 36 },
  { label: "Clarity", y: 68 },
  { label: "Feasibility", y: 100 },
] as const;

export function ChallengeSketch({ label }: { label: string }) {
  return (
    <Card label={label}>
      <svg viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
        {CHECKS.map((check, index) => (
          <Draw
            key={check.label}
            d={handCheck(28, check.y, 14)}
            tone="accent"
            delay={80 + index * 140}
            duration={180}
            width={1.8}
          />
        ))}
        <Draw d={roughEllipse(36, 136, 8, 8, 71)} delay={520} duration={220} width={1.5} />
      </svg>
      {CHECKS.map((check) => (
        <Note key={check.label} frame={CARD} x={56} y={check.y - 2} size={14}>
          {check.label}
        </Note>
      ))}
      <Note frame={CARD} x={56} y={132} size={14}>
        Evidence?
      </Note>
      <Note frame={CARD} x={28} y={176} size={16} tone="accent">
        Keep improving.
      </Note>
    </Card>
  );
}

/** Where a stage sits in the loop; stages 03 and 05 show the way back. */
export function ProcessRail({ current, loopBack = false }: { current: number; loopBack?: boolean }) {
  const frame: Frame = { w: 300, h: 64 };
  const xs = [20, 85, 150, 215, 280];
  const from = xs[current - 1] ?? 20;

  return (
    <SketchFrame width={frame.w} height={frame.h} className="w-[min(300px,80%)]">
      <svg viewBox={`0 0 ${frame.w} ${frame.h}`} aria-hidden="true">
        <g data-tone="muted">
          <line x1={xs[0]} y1={34} x2={xs[4]} y2={34} {...precise} />
        </g>
        {xs.map((x, index) => (
          <circle
            key={x}
            cx={x}
            cy={34}
            r={index + 1 === current ? 5 : 3}
            fill={index + 1 === current ? "var(--sk-accent)" : index + 1 < current ? "var(--sk-ink)" : "var(--sk-muted)"}
          />
        ))}
        {loopBack ? (
          <DrawArrow
            arrow={cubicArrow([from - 2, 26], [from - 30, -4], [xs[0] + 24, -4], [xs[0] + 2, 24], 8)}
            tone="accent"
            delay={150}
            duration={500}
            width={1.6}
          />
        ) : null}
      </svg>
      {xs.map((x, index) => (
        <Note
          key={x}
          frame={frame}
          x={x}
          y={56}
          variant="label"
          size={10}
          align="center"
          tone={index + 1 === current ? "accent" : "muted"}
        >
          {String(index + 1).padStart(2, "0")}
        </Note>
      ))}
    </SketchFrame>
  );
}

/** A hand-drawn link from one stage to the next. */
export function StageConnector({ from, to }: { from: "left" | "right"; to: "left" | "right" }) {
  const wide: Frame = { w: 1200, h: 80 };
  const x1 = from === "right" ? 860 : 340;
  const x2 = to === "right" ? 860 : 340;
  const arrow = cubicArrow([x1, 4], [x1, 52], [x2, 24], [x2, 74], 10);
  const tall: Frame = { w: 40, h: 60 };

  return (
    <>
      <SketchFrame width={wide.w} height={wide.h} className="hidden w-full lg:block">
        <svg viewBox={`0 0 ${wide.w} ${wide.h}`} aria-hidden="true">
          <g data-tone="muted">
            <DrawArrow arrow={arrow} duration={650} width={1.4} />
          </g>
        </svg>
      </SketchFrame>
      <SketchFrame width={tall.w} height={tall.h} className="w-8 lg:hidden">
        <svg viewBox={`0 0 ${tall.w} ${tall.h}`} aria-hidden="true">
          <g data-tone="muted">
            <DrawArrow arrow={cubicArrow([20, 4], [10, 22], [30, 34], [20, 55], 8)} duration={420} width={1.5} />
          </g>
        </svg>
      </SketchFrame>
    </>
  );
}
