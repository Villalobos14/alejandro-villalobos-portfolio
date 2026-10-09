/**
 * Deterministic "hand-drawn" geometry. Every mark is generated from a seed, so
 * the server and the client render the same path and a sketch never changes
 * between renders. The wobble is small on purpose: confident, not messy.
 */

export type Point = readonly [number, number];

function random(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value: number) => Math.round(value * 10) / 10;
const pt = ([x, y]: Point) => `${round(x)} ${round(y)}`;

/** Catmull-Rom through the points, written as cubic Béziers. */
function smooth(points: Point[]): string {
  if (points.length < 2) return "";

  let path = `M ${pt(points[0])}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += ` C ${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }

  return path;
}

/** A loop that overshoots its start, the way a circle drawn in one stroke does. */
export function roughEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed = 1,
  turns = 1.1,
): string {
  const rand = random(seed);
  const start = -2.5 + rand() * 0.7;
  const tilt = (rand() - 0.5) * 0.12;
  const phaseA = rand() * Math.PI * 2;
  const phaseB = rand() * Math.PI * 2;
  const steps = Math.round(30 * turns);
  const points: Point[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    const angle = start + progress * Math.PI * 2 * turns;
    const grow = 1 + 0.06 * progress;
    const wobble = 1 + 0.028 * Math.sin(2 * angle + phaseA) + 0.016 * Math.sin(5 * angle + phaseB);
    const x = rx * grow * wobble * Math.cos(angle);
    const y = ry * grow * wobble * Math.sin(angle);
    points.push([
      cx + x * Math.cos(tilt) - y * Math.sin(tilt),
      cy + x * Math.sin(tilt) + y * Math.cos(tilt),
    ]);
  }

  return smooth(points);
}

/** A straight-ish stroke that bows slightly, like a ruler-less line. */
export function roughLine(a: Point, b: Point, seed = 1, bow = 0.025): string {
  const rand = random(seed);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const o1 = (rand() * 2 - 1) * bow * length;
  const o2 = (rand() * 2 - 1) * bow * length;
  const c1: Point = [a[0] + dx / 3 + nx * o1, a[1] + dy / 3 + ny * o1];
  const c2: Point = [a[0] + (2 * dx) / 3 + nx * o2, a[1] + (2 * dy) / 3 + ny * o2];

  return `M ${pt(a)} C ${pt(c1)} ${pt(c2)} ${pt(b)}`;
}

/** A box drawn as four strokes that overshoot at the corners. */
export function roughRect(x: number, y: number, w: number, h: number, seed = 1): string {
  const rand = random(seed);
  const o = () => (rand() - 0.3) * 3;
  const corners: Point[] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];

  return corners
    .map((corner, index) => {
      const next = corners[(index + 1) % 4];
      const dx = Math.sign(next[0] - corner[0]);
      const dy = Math.sign(next[1] - corner[1]);
      const from: Point = [corner[0] - dx * 2 + o(), corner[1] - dy * 2 + o()];
      const to: Point = [next[0] + dx * 3 + o(), next[1] + dy * 3 + o()];
      return roughLine(from, to, seed * 7 + index, 0.012);
    })
    .join(" ");
}

export interface Arrow {
  shaft: string;
  head: string;
}

/**
 * A curved arrow: one stroke for the shaft, a second, quicker one for the head.
 * `bend` is the sideways pull of the curve as a share of its length.
 */
export function curvedArrow(a: Point, b: Point, bend = 0.2, seed = 1, headSize = 11): Arrow {
  const rand = random(seed);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy) || 1;
  const control: Point = [
    (a[0] + b[0]) / 2 + (-dy / length) * bend * length,
    (a[1] + b[1]) / 2 + (dx / length) * bend * length,
  ];
  const angle = Math.atan2(b[1] - control[1], b[0] - control[0]);
  const left = angle + Math.PI - 0.42 - rand() * 0.08;
  const right = angle + Math.PI + 0.5 + rand() * 0.08;
  const leftPoint: Point = [b[0] + Math.cos(left) * headSize, b[1] + Math.sin(left) * headSize];
  const rightPoint: Point = [
    b[0] + Math.cos(right) * headSize * 0.85,
    b[1] + Math.sin(right) * headSize * 0.85,
  ];

  return {
    shaft: `M ${pt(a)} Q ${pt(control)} ${pt(b)}`,
    head: `M ${pt(leftPoint)} L ${pt(b)} L ${pt(rightPoint)}`,
  };
}

/** An underline that drifts a little and flicks up at the end. */
export function handUnderline(x1: number, x2: number, y: number, seed = 1): string {
  const rand = random(seed);
  const steps = 6;
  const points: Point[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    points.push([x1 + (x2 - x1) * progress, y + (rand() - 0.5) * 2.2 + progress * 1.5]);
  }

  const last = points[points.length - 1];
  points.push([last[0] + 6, last[1] - 5]);

  return smooth(points);
}

/** A tick drawn in one movement: short down-stroke, long up-stroke. */
export function handCheck(x: number, y: number, size = 16): string {
  return `M ${pt([x, y])} Q ${pt([x + size * 0.18, y + size * 0.2])} ${pt([
    x + size * 0.36,
    y + size * 0.42,
  ])} Q ${pt([x + size * 0.6, y - size * 0.15])} ${pt([x + size, y - size * 0.55])}`;
}

/** A square bracket drawn down the side of a block. */
export function handBracket(x: number, y1: number, y2: number, depth = 8, seed = 1): string {
  return [
    roughLine([x + depth, y1], [x, y1 + 2], seed, 0.05),
    roughLine([x, y1 + 2], [x - 1, y2 - 2], seed + 1, 0.01),
    roughLine([x - 1, y2 - 2], [x + depth, y2], seed + 2, 0.05),
  ].join(" ");
}

/** An arrow along a cubic, for loops a single bend cannot make. */
export function cubicArrow(a: Point, c1: Point, c2: Point, b: Point, headSize = 11): Arrow {
  const angle = Math.atan2(b[1] - c2[1], b[0] - c2[0]);
  const left = angle + Math.PI - 0.45;
  const right = angle + Math.PI + 0.52;

  return {
    shaft: `M ${pt(a)} C ${pt(c1)} ${pt(c2)} ${pt(b)}`,
    head: `M ${pt([b[0] + Math.cos(left) * headSize, b[1] + Math.sin(left) * headSize])} L ${pt(b)} L ${pt([
      b[0] + Math.cos(right) * headSize * 0.85,
      b[1] + Math.sin(right) * headSize * 0.85,
    ])}`,
  };
}
