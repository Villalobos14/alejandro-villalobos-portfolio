import { curvedArrow, handUnderline, roughEllipse } from "./geometry";
import { InterfaceSketch } from "./InterfaceSketch";
import { Draw, DrawArrow, Fade, Note, precise, type Frame } from "./primitives";
import SketchFrame from "./SketchFrame";

/**
 * Hero sketch: a question becomes an observation, and three kinds of input
 * (people, product, system) converge on one interface. Freehand ink is the
 * inquiry; 1px geometry is the structure it turns into.
 */

const DESCRIPTION =
  "Sketch: the question “What are we really solving?” leads to a research note about user behavior. User behavior, product decisions and technical constraints all connect to one simplified interface. A green note reads “Make complexity understandable.”";

const WIDE: Frame = { w: 640, h: 630 };

export function HeroDiagram({ className = "" }: { className?: string }) {
  const f = WIDE;
  const wx = 292;
  const wy = 226;
  const ww = 318;
  const wh = 206;

  return (
    <SketchFrame
      width={f.w}
      height={f.h}
      label={DESCRIPTION}
      trigger="load"
      interactive
      className={className}
    >
      <svg viewBox={`0 0 ${f.w} ${f.h}`} aria-hidden="true">
        {/* Hit areas for region emphasis (fine pointers only). */}
        <rect data-hit="research" x={0} y={0} width={276} height={380} fill="transparent" />
        <rect data-hit="design" x={276} y={96} width={364} height={344} fill="transparent" />
        <rect data-hit="engineering" x={276} y={440} width={364} height={150} fill="transparent" />

        {/* Inquiry: question → observation. */}
        <g data-region="research">
          <Draw d={handUnderline(30, 324, 76, 3)} delay={500} duration={280} />
          <DrawArrow arrow={curvedArrow([176, 96], [98, 196], 0.32, 5)} delay={150} duration={420} />
          <Fade>
            <rect
              x={24}
              y={206}
              width={226}
              height={136}
              rx={6}
              {...precise}
              transform="rotate(-2 137 274)"
            />
          </Fade>
          <Fade>
            <line x1={44} y1={318} x2={226} y2={318} {...precise} />
            {[56, 74, 88, 112, 124, 146].map((cx) => (
              <circle key={cx} cx={cx} cy={318} r={3} fill="var(--sk-muted)" />
            ))}
            <circle cx={208} cy={318} r={3} fill="currentColor" />
          </Fade>
          <Draw d={roughEllipse(208, 318, 15, 12, 9)} delay={500} duration={350} />
          <DrawArrow arrow={curvedArrow([252, 300], [300, 356], -0.3, 11)} delay={350} duration={350} />
        </g>

        <InterfaceSketch x={wx} y={wy} w={ww} h={wh} />

        {/* Engineering: a constructed connection, not a drawn one. */}
        <g data-region="engineering" data-tone="muted">
          <Fade>
            <line x1={wx} y1={wy - 16} x2={wx + ww} y2={wy - 16} {...precise} strokeDasharray="2 4" />
            <line x1={wx} y1={wy - 21} x2={wx} y2={wy - 11} {...precise} />
            <line x1={wx + ww} y1={wy - 21} x2={wx + ww} y2={wy - 11} {...precise} />
            {[
              [wx - 12, wy + wh + 12],
              [wx + ww + 12, wy + wh + 12],
            ].map(([cx, cy]) => (
              <g key={`${cx}-${cy}`}>
                <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} {...precise} />
                <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} {...precise} />
              </g>
            ))}
            <line x1={470} y1={wy + wh} x2={470} y2={466} {...precise} />
            <circle cx={470} cy={wy + wh} r={3} fill="currentColor" />
            <path d="M 466 460 L 470 467 L 474 460" {...precise} />
          </Fade>
        </g>

        {/* Design: decisions point at the interface. */}
        <g data-region="design">
          <DrawArrow arrow={curvedArrow([528, 178], [574, 254], -0.28, 13)} delay={450} duration={350} />
        </g>

        {/* The point of it all. */}
        <g data-region="research design engineering">
          <Draw d={roughEllipse(478, 352, 116, 32, 21)} tone="accent" delay={600} duration={420} />
          <DrawArrow
            arrow={curvedArrow([250, 560], [372, 380], -0.22, 23)}
            tone="accent"
            delay={850}
            duration={300}
          />
          <Draw d={handUnderline(30, 300, 606, 29)} tone="accent" delay={1100} duration={260} />
        </g>
      </svg>

      <Note frame={f} x={30} y={46} size={36} region="research" hit="research">
        What are we really solving?
      </Note>
      <Note frame={f} x={44} y={232} variant="label" size={12} region="research" hit="research">
        User behavior
      </Note>
      <Note frame={f} x={44} y={272} size={27} region="research" hit="research">
        “I just export it…”
      </Note>
      <Note frame={f} x={352} y={128} variant="label" size={12} region="design" hit="design">
        Product decisions
      </Note>
      <Note frame={f} x={352} y={164} size={26} region="design" hit="design">
        what do we show first?
      </Note>
      <Note frame={f} x={404} y={482} variant="label" size={12} region="engineering" hit="engineering">
        Technical constraints
      </Note>
      <Note frame={f} x={404} y={514} size={25} region="engineering" hit="engineering">
        latency? data shape?
      </Note>
      <Note
        frame={f}
        x={30}
        y={580}
        size={34}
        tone="accent"
        region="research design engineering"
      >
        Make complexity understandable.
      </Note>
    </SketchFrame>
  );
}

const TALL: Frame = { w: 340, h: 440 };

/** Mobile: fewer marks, larger words, the same idea. */
export function HeroDiagramCompact({ className = "" }: { className?: string }) {
  const f = TALL;
  const rows: [string, string, number][] = [
    ["User behavior", "how people actually work", 130],
    ["Product decisions", "what to show first", 196],
    ["Technical constraints", "what the system allows", 262],
  ];

  return (
    <SketchFrame width={f.w} height={f.h} label={DESCRIPTION} trigger="view" className={className}>
      <svg viewBox={`0 0 ${f.w} ${f.h}`} aria-hidden="true">
        <Draw d={handUnderline(10, 236, 50, 3)} delay={450} duration={240} />
        <DrawArrow arrow={curvedArrow([96, 60], [36, 104], 0.3, 5)} delay={150} duration={360} />
        <InterfaceSketch x={232} y={112} w={100} h={190} sidebar={0} rows={4} />
        {rows.map(([, , y], index) => (
          <DrawArrow
            key={y}
            arrow={curvedArrow([196, y + 2], [226, 150 + index * 50], -0.2, 31 + index)}
            delay={200 + index * 100}
            duration={300}
            width={1.6}
          />
        ))}
        <Draw d={roughEllipse(280, 230, 48, 28, 21)} tone="accent" delay={550} duration={420} />
        <Draw d={handUnderline(10, 282, 386, 29)} tone="accent" delay={1000} duration={240} />
        <DrawArrow
          arrow={curvedArrow([236, 352], [258, 266], 0.25, 23)}
          tone="accent"
          delay={850}
          duration={300}
          width={1.6}
        />
      </svg>

      <Note frame={f} x={10} y={26} size={28}>
        What are we really solving?
      </Note>
      {rows.map(([label, note, y]) => (
        <span key={label}>
          <Note frame={f} x={14} y={y} variant="label" size={10.5}>
            {label}
          </Note>
          <Note frame={f} x={14} y={y + 26} size={21}>
            {note}
          </Note>
        </span>
      ))}
      <Note frame={f} x={10} y={366} size={27} tone="accent">
        Make complexity understandable.
      </Note>
    </SketchFrame>
  );
}
