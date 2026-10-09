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

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <SketchFrame width={F.w} height={F.h} label={label} className="w-full">
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

const CARDS = [
  { id: "P1", x: 28, y: 36, w: 196, h: 96, r: -2, quote: "“I just export it”" },
  { id: "P2", x: 248, y: 28, w: 214, h: 96, r: 1.5, quote: "“where’s the status?”" },
  { id: "P3", x: 44, y: 158, w: 192, h: 92, r: 1, quote: "“I ask someone”" },
] as const;

const DOTS: [number, number][] = [
  [286, 252],
  [304, 238],
  [320, 246],
  [338, 228],
  [356, 236],
  [372, 216],
  [392, 224],
];

export function UnderstandSketch({ label }: { label: string }) {
  return (
    <Panel label={label}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true">
        <g data-tone="muted">
          {CARDS.map((card) => (
            <Fade key={card.id}>
              <rect
                x={card.x}
                y={card.y}
                width={card.w}
                height={card.h}
                rx={4}
                {...precise}
                transform={`rotate(${card.r} ${card.x + card.w / 2} ${card.y + card.h / 2})`}
              />
            </Fade>
          ))}
          <Fade>
            <line x1={270} y1={274} x2={456} y2={274} {...precise} />
            <line x1={270} y1={174} x2={270} y2={274} {...precise} />
            {DOTS.map(([cx, cy]) => (
              <circle key={cx} cx={cx} cy={cy} r={3} fill="currentColor" />
            ))}
            <circle cx={440} cy={186} r={3.2} fill="var(--sk-ink)" />
          </Fade>
        </g>
        <Draw d={roughEllipse(440, 186, 15, 13, 47)} delay={150} duration={320} />
        <Draw d={handUnderline(62, 206, 230, 49)} tone="accent" delay={350} duration={280} />
        <DrawArrow arrow={curvedArrow([150, 290], [138, 246], -0.35, 51)} tone="accent" delay={650} duration={240} width={1.6} />
      </svg>
      {CARDS.map((card) => (
        <span key={card.id}>
          <Note frame={F} x={card.x + 14} y={card.y + 20} variant="label" size={10} tone="muted">
            {card.id}
          </Note>
          <Note frame={F} x={card.x + 14} y={card.y + 56} size={card.id === "P2" ? 24 : 26} rotate={card.r}>
            {card.quote}
          </Note>
        </span>
      ))}
      <Note frame={F} x={270} y={296} variant="label" size={10} tone="muted" detail>
        Time to an answer
      </Note>
      <Note frame={F} x={46} y={312} size={28} tone="accent">
        workarounds = signal
      </Note>
    </Panel>
  );
}

const NODES = [
  { id: "people", label: "People", x: 40, y: 54, w: 120, h: 36 },
  { id: "product", label: "Product", x: 320, y: 40, w: 124, h: 36 },
  { id: "data", label: "Data", x: 344, y: 196, w: 100, h: 36 },
  { id: "constraints", label: "Constraints", x: 30, y: 214, w: 152, h: 36 },
  { id: "technology", label: "Technology", x: 176, y: 296, w: 150, h: 36 },
] as const;

const HUB: [number, number] = [234, 158];

export function ConnectSketch({ label }: { label: string }) {
  return (
    <Panel label={label}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true">
        <g data-tone="muted">
          <Fade>
            {/* The notes from the last stage, now grouped under People. */}
            {[48, 66, 84].map((x, index) => (
              <rect key={x} x={x} y={100 + (index % 2) * 3} width={14} height={11} rx={1.5} {...precise} strokeOpacity={0.6} />
            ))}
          </Fade>
          <Fade>
            {NODES.map((node) => {
              const cx = node.x + node.w / 2;
              const cy = node.y + node.h / 2;
              return <line key={node.id} x1={cx} y1={cy} x2={HUB[0]} y2={HUB[1]} {...precise} strokeOpacity={0.7} />;
            })}
            <circle cx={HUB[0]} cy={HUB[1]} r={13} {...precise} />
          </Fade>
          {/* Filled so the connections stop at each node's edge. */}
          {NODES.map((node) => (
            <Fade key={node.id}>
              <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={18} {...precise} fill="#0C0D0E" />
            </Fade>
          ))}
        </g>
        <Fade>
          <circle cx={HUB[0]} cy={HUB[1]} r={5} fill="var(--sk-accent)" />
        </Fade>
        <DrawArrow arrow={curvedArrow([190, 152], [214, 156], 0.1, 53)} tone="accent" delay={300} duration={240} width={1.6} />
        <DrawArrow arrow={curvedArrow([84, 256], [62, 292], 0.35, 55)} delay={550} duration={280} width={1.5} />
      </svg>
      {NODES.map((node) => (
        <Note
          key={node.id}
          frame={F}
          x={node.x + node.w / 2}
          y={node.y + node.h / 2}
          variant="label"
          size={12}
          align="center"
        >
          {node.label}
        </Note>
      ))}
      <Note frame={F} x={40} y={154} size={26} tone="accent">
        decided here
      </Note>
      <Note frame={F} x={28} y={312} size={23} tone="muted">
        back to 01?
      </Note>
    </Panel>
  );
}

export function MakeSketch({ label }: { label: string }) {
  const x = 40;
  const y = 36;
  const w = 400;
  const h = 270;

  return (
    <Panel label={label}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true">
        {/* v0: drawn by hand, then it steps back. */}
        <g data-dim="" style={{ ["--dim" as string]: "850ms" }}>
          <Draw d={roughRect(x, y, w, h, 61)} duration={420} />
          <Draw d={roughLine([x, y + 24], [x + w, y + 24], 62, 0.008)} delay={280} duration={160} />
          <Draw d={roughRect(x + 12, y + 38, 72, h - 52, 63)} delay={340} duration={260} />
          <Draw d={roughRect(x + w - 74, y + 36, 60, 20, 64)} delay={460} duration={180} />
          {[92, 124, 156, 188, 220].map((dy, index) => (
            <Draw
              key={dy}
              d={handUnderline(x + 104, x + 104 + 120 + (index % 3) * 34, y + dy, 70 + index)}
              delay={520 + index * 50}
              duration={150}
              width={1.5}
            />
          ))}
          <Draw d={roughLine([x + 100, y + 70], [x + w - 14, y + 72], 66, 0.01)} delay={500} duration={160} width={1.4} />
        </g>
        {/* v1: the same structure, decided. */}
        <InterfaceSketch x={x} y={y} w={w} h={h} sidebar={96} rows={5} appear={850} />
      </svg>
      <Note frame={F} x={440} y={334} size={24} tone="muted" align="right">
        rough → resolved
      </Note>
    </Panel>
  );
}

const CHECKS = ["Usability", "Clarity", "Feasibility"] as const;

export function ChallengeSketch({ label }: { label: string }) {
  const loop = cubicArrow([390, 238], [392, 352], [8, 372], [30, 64]);

  return (
    <Panel label={label}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true">
        <InterfaceSketch x={84} y={40} w={222} h={190} sidebar={56} rows={4} />
        {CHECKS.map((check, index) => (
          <Draw
            key={check}
            d={handCheck(322, 76 + index * 42, 17)}
            tone="accent"
            delay={100 + index * 150}
            duration={200}
            width={2}
          />
        ))}
        <Draw d={roughEllipse(331, 200, 9, 10, 71)} delay={500} duration={240} width={1.6} />
        <DrawArrow arrow={loop} tone="accent" delay={650} duration={600} width={1.8} />
      </svg>
      {CHECKS.map((check, index) => (
        <Note key={check} frame={F} x={348} y={70 + index * 42} size={27}>
          {check}
        </Note>
      ))}
      <Note frame={F} x={348} y={196} size={27}>
        Evidence?
      </Note>
      <Note frame={F} x={12} y={22} size={21} tone="muted" detail>
        back to 01
      </Note>
      <Note frame={F} x={214} y={340} size={29} tone="accent" align="center">
        Keep improving.
      </Note>
    </Panel>
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
