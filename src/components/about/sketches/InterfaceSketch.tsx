import { Fade, precise } from "./primitives";

/**
 * The simplified internal-tool interface every sketch converges on: window,
 * sidebar, a primary action, a table with one status that matters. Regions let
 * the hero emphasise its frame (engineering) or its content (design).
 */
export function InterfaceSketch({
  x,
  y,
  w,
  h,
  sidebar = 72,
  rows = 4,
  appear,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  sidebar?: number;
  rows?: number;
  /** Hold the interface back until the frame plays, starting at this delay (ms). */
  appear?: number;
}) {
  const content = x + sidebar + 16;
  const rowGap = Math.min(26, (h - 86) / rows);
  const names = [70, 56, 76, 62, 50];

  return (
    <>
      <g data-region="engineering" data-tone="muted">
        <Fade appear={appear !== undefined} delay={appear}>
          <rect x={x} y={y} width={w} height={h} rx={6} {...precise} />
          <line x1={x} y1={y + 22} x2={x + w} y2={y + 22} {...precise} />
          {[12, 22, 32].map((dx) => (
            <circle key={dx} cx={x + dx} cy={y + 11} r={2.4} {...precise} />
          ))}
          {sidebar > 0 ? (
            <line x1={x + sidebar} y1={y + 22} x2={x + sidebar} y2={y + h} {...precise} />
          ) : null}
        </Fade>
      </g>
      <g data-region="design" data-tone="muted">
        <Fade appear={appear !== undefined} delay={appear}>
          {sidebar > 0
            ? [44, 36, 40, 30].map((length, index) => (
                <line
                  key={length}
                  x1={x + 12}
                  y1={y + 44 + index * 16}
                  x2={x + 12 + Math.min(length, sidebar - 20)}
                  y2={y + 44 + index * 16}
                  {...precise}
                />
              ))
            : null}
          <rect x={content} y={y + 40} width={Math.min(82, w * 0.3)} height={7} fill="var(--sk-faint)" />
          <rect
            x={x + w - 64}
            y={y + 36}
            width={52}
            height={18}
            rx={9}
            {...precise}
            stroke="var(--sk-accent)"
          />
          <line x1={content} y1={y + 72} x2={x + w - 12} y2={y + 72} {...precise} />
          {Array.from({ length: rows }, (_, index) => {
            const rowY = y + 72 + rowGap * (index + 1);
            return (
              <g key={index}>
                <line x1={content} y1={rowY} x2={x + w - 12} y2={rowY} {...precise} strokeOpacity={0.5} />
                <rect
                  x={content + 4}
                  y={rowY - rowGap / 2 - 3}
                  width={Math.min(names[index] ?? 60, w * 0.24)}
                  height={5}
                  fill="var(--sk-faint)"
                />
                <rect
                  x={x + w - 92}
                  y={rowY - rowGap / 2 - 5.5}
                  width={30}
                  height={11}
                  rx={5.5}
                  {...precise}
                  stroke={index === 1 ? "var(--sk-accent)" : "currentColor"}
                />
                <rect x={x + w - 50} y={rowY - rowGap / 2 - 3} width={36} height={5} fill="var(--sk-faint)" />
              </g>
            );
          })}
        </Fade>
      </g>
    </>
  );
}
