"use client";

import { useEffect, useRef, useState } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

const MOTION_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const LARGE_TAIL = ["    +", "  · * ·", " + #*# +", "· #***# ·", " + #*# +", "  · * ·", "    +"];
const LARGE_FIN = ["   + * +", "  · #*# ·", " + #***# +"];
const LARGE_BODY = [
  "        ·        ",
  "     + #*#*# +   ",
  "   · #*******# · ",
  "  + #*********# +",
  " · #***********# ·",
  "+ #*************#+",
  "· #***************# ·",
  "+ #*************#+",
  " · #***********# ·",
  "  + #*********# +",
  "   · #*******# · ",
  "     + #*#*# +   ",
  "        ·        ",
];
const SMALL_TAIL = ["  +", " ·*·", "+#*#+", " ·*·", "  +"];
const SMALL_FIN = [" +*+", "·#*#·"];
const SMALL_BODY = [
  "    ·    ",
  "  + #*# +",
  " · #***# ·",
  "+ #*****#+",
  "· #*******# ·",
  "+ #*****#+",
  " · #***# ·",
  "  + #*# +",
  "    ·    ",
];

type Tone = "gray" | "white" | "green";
type Part = "head" | "body" | "fin" | "peduncle" | "tail" | "wake";
type Mark = "dot" | "cross" | "block";

interface Glyph {
  char: string;
  top: number;
  left: number;
  size: number;
  opacity: number;
  tone: Tone;
  kind: "text" | "block";
}

interface FishGlyph {
  x: number;
  y: number;
  along: number;
  row: number;
  col: number;
  density: number;
  part: Part;
  phase: number;
}

interface FishModel {
  glyphs: FishGlyph[];
  width: number;
  height: number;
  coreStart: number;
  coreEnd: number;
  fontPx: number;
  phase: number;
  omega: number;
  spatial: number;
  driftOmega: number;
  driftX: number;
  driftY: number;
  amp: number;
  tailAmp: number;
  facing: 1 | -1;
  role: "left" | "center" | "right";
  x: number;
  y: number;
}

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface DriftSpeck {
  x: number;
  y: number;
  speed: number;
  phase: number;
  wave: number;
  mark: Mark;
  size: number;
  alpha: number;
  band: number;
}

interface WavePoint {
  u: number;
  phase: number;
  mark: Mark;
  size: number;
  alpha: number;
}

interface WaveBand {
  base: number;
  amp: number;
  speed: number;
  turns: number;
  phase: number;
  points: WavePoint[];
}

interface CrossMember {
  dx: number;
  dy: number;
  phase: number;
}

interface CrossCluster {
  x: number;
  y: number;
  phase: number;
  drift: number;
  members: CrossMember[];
}

const FAMILIES: readonly (readonly string[])[] = [
  [".", "·", "+", "·"],
  ["+", "·", "+", "*"],
  ["*", "+", "*", "*"],
  ["#", "*", "#", "#"],
];

const INK = new Map<string, string>();

function ink(rgb: string, alpha: number): string {
  const bucket = Math.max(0, Math.min(20, Math.round(alpha * 20)));
  const key = rgb + bucket;
  const cached = INK.get(key);
  if (cached) return cached;
  const value = `rgba(${rgb},${bucket / 20})`;
  INK.set(key, value);
  return value;
}

function random(seed: number) {
  let value = seed;

  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function spray(
  seed: number,
  count: number,
  box: { top: number; left: number; bottom: number; right: number },
  chars: string[],
  size: [number, number],
  opacity: [number, number],
  tone: Tone,
  kind: Glyph["kind"] = "text",
): Glyph[] {
  const next = random(seed);
  const glyphs: Glyph[] = [];

  for (let index = 0; index < count; index += 1) {
    const char = chars[Math.floor(next() * chars.length)] ?? "·";

    glyphs.push({
      char,
      kind,
      top: box.top + ((next() + next()) / 2) * (box.bottom - box.top),
      left: box.left + ((next() + next()) / 2) * (box.right - box.left),
      size: size[0] + next() * (size[1] - size[0]),
      opacity: opacity[0] + next() * (opacity[1] - opacity[0]),
      tone,
    });
  }

  return glyphs;
}

function toneClass(tone: Tone): string {
  if (tone === "green") return "fill-secondary";
  if (tone === "white") return "fill-white";
  return "fill-gray";
}

const mobileWater = spray(
  40,
  24,
  { top: 14, left: 8, bottom: 42, right: 96 },
  [".", "·", "+"],
  [7, 11],
  [0.14, 0.26],
  "gray",
);

const staticWater = [
  ...spray(4, 28, { top: 12, left: 2, bottom: 30, right: 98 }, [".", "·", "+"], [8, 12], [0.12, 0.24], "gray"),
  ...spray(18, 22, { top: 76, left: 4, bottom: 98, right: 96 }, [".", "·", "+"], [8, 12], [0.12, 0.22], "gray"),
];

function waveAmp(along: number, tailAmp: number): number {
  if (along < 0.62) return 2.3 + (5.4 - 2.3) * (along / 0.62);
  if (along < 0.82) return 5.4 + (8.2 - 5.4) * ((along - 0.62) / 0.2);
  const u = Math.min(1, (along - 0.82) / 0.28);
  return 8.2 + (tailAmp - 8.2) * u;
}

function holdMix(frac: number): number {
  if (frac < 0.7) return 0;
  const u = (frac - 0.7) / 0.3;
  return u * u * (3 - 2 * u);
}

function wrapGlyph(index: number, length: number): number {
  return ((index % length) + length) % length;
}

function buildFish(
  profile: readonly number[],
  cell: number,
  fontPx: number,
  wakeCount: number,
  spec: Omit<FishModel, "glyphs" | "width" | "height" | "coreStart" | "coreEnd" | "fontPx" | "x" | "y">,
): FishModel {
  const glyphs: FishGlyph[] = [];
  const cols = profile.length;
  let maxRow = 1;

  for (let index = 0; index < profile.length; index += 1) {
    const half = profile[index] ?? 1;
    if (half > maxRow) maxRow = half;
  }

  const mid = (maxRow + 4) * cell;
  const originCol = 6;

  for (let col = 0; col < cols; col += 1) {
    const half = profile[col] ?? 1;
    const fromTail = cols === 1 ? 0 : col / (cols - 1);
    const along = 1 - fromTail;
    const x = (col + originCol) * cell;
    const part: Part = along < 0.16 ? "head" : along > 0.74 ? "peduncle" : "body";

    for (let row = -half; row <= half; row += 1) {
      const dist = half === 0 ? 0 : Math.abs(row) / half;
      let density = 4;
      if (dist > 0.84) density = 1;
      else if (dist > 0.58) density = 2;
      else if (dist > 0.3) density = 3;
      if (col === cols - 3 && row === -1) density = 1;

      glyphs.push({
        x,
        y: mid + row * cell * 0.9,
        along,
        row,
        col,
        density,
        part,
        phase: col * 0.71 + row * 0.97,
      });
    }

    if (col >= 4 && col <= 8) {
      const rise = col === 6 ? 3 : col === 5 || col === 7 ? 2 : 1;
      for (let step = 1; step <= rise; step += 1) {
        glyphs.push({
          x: x - step * cell * 0.18,
          y: mid - (half + step) * cell * 0.9,
          along,
          row: -half - step,
          col,
          density: step === rise ? 1 : 2,
          part: "fin",
          phase: 1.4 + col * 0.45 + step,
        });
      }
    }

    if (col >= 6 && col <= 9) {
      const drop = col === 7 ? 3 : 2;
      for (let step = 1; step <= drop; step += 1) {
        glyphs.push({
          x: x - step * cell * 0.55,
          y: mid + (half * 0.25 + step) * cell * 0.9,
          along: Math.min(1, along + 0.06),
          row: half + step,
          col,
          density: step === drop ? 1 : 2,
          part: "fin",
          phase: 2.2 + col * 0.38 + step,
        });
      }
    }
  }

  glyphs.push({
    x: (cols - 1 + originCol) * cell + cell * 0.85,
    y: mid,
    along: 0,
    row: 0,
    col: cols,
    density: 2,
    part: "head",
    phase: 0.15,
  });

  const tailX = originCol * cell;
  const forks: readonly (readonly [number, number, number])[] = [
    [0, 0, 3],
    [-1, -1, 3],
    [-2, -2, 3],
    [-3, -3, 2],
    [-4, -4, 2],
    [-5, -5, 1],
    [-1, 1, 3],
    [-2, 2, 3],
    [-3, 3, 2],
    [-4, 4, 2],
    [-5, 5, 1],
    [-2, -1, 2],
    [-2, 1, 2],
    [-3, -2, 2],
    [-3, 2, 2],
    [-4, -3, 1],
    [-4, 3, 1],
  ];

  for (let index = 0; index < forks.length; index += 1) {
    const fork = forks[index];
    if (!fork) continue;
    const [dx, dy, density] = fork;
    glyphs.push({
      x: tailX + dx * cell * 0.86,
      y: mid + dy * cell * 0.7,
      along: 0.9 + Math.abs(dx) * 0.035,
      row: dy,
      col: dx,
      density,
      part: "tail",
      phase: 3.1 + index * 0.34,
    });
  }

  for (let index = 0; index < wakeCount; index += 1) {
    glyphs.push({
      x: tailX - (4.6 + index * 0.58) * cell,
      y: mid + Math.sin(index * 1.35) * cell * (0.55 + index * 0.08),
      along: 1.08 + index * 0.04,
      row: index % 5,
      col: -8 - index,
      density: 1,
      part: "wake",
      phase: index * 0.77,
    });
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < glyphs.length; index += 1) {
    const glyph = glyphs[index];
    if (!glyph) continue;
    if (glyph.x < minX) minX = glyph.x;
    if (glyph.y < minY) minY = glyph.y;
    if (glyph.x > maxX) maxX = glyph.x;
    if (glyph.y > maxY) maxY = glyph.y;
  }

  for (let index = 0; index < glyphs.length; index += 1) {
    const glyph = glyphs[index];
    if (!glyph) continue;
    glyph.x -= minX - cell * 0.6;
    glyph.y -= minY - cell * 0.6;
  }

  let coreStart = Number.POSITIVE_INFINITY;
  let coreEnd = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < glyphs.length; index += 1) {
    const glyph = glyphs[index];
    if (!glyph || glyph.part === "wake") continue;
    if (glyph.x < coreStart) coreStart = glyph.x;
    if (glyph.x > coreEnd) coreEnd = glyph.x;
  }

  return {
    ...spec,
    glyphs,
    fontPx,
    width: maxX - minX + cell * 1.8,
    height: maxY - minY + cell * 1.8,
    coreStart,
    coreEnd,
    x: 0,
    y: 0,
  };
}

const FISHES: FishModel[] = [
  buildFish([1, 2, 3, 4, 5, 5, 6, 6, 5, 5, 4, 3, 2, 2, 1], 12, 13, 14, {
    phase: 0.35,
    omega: (Math.PI * 2) / 8.2,
    spatial: 5.3,
    driftOmega: (Math.PI * 2) / 20,
    driftX: 16,
    driftY: 4,
    amp: 1,
    tailAmp: 13,
    facing: 1,
    role: "left",
  }),
  buildFish([1, 2, 3, 3, 3, 2, 1], 9, 10, 8, {
    phase: 2.45,
    omega: (Math.PI * 2) / 5.1,
    spatial: 7.4,
    driftOmega: (Math.PI * 2) / 13,
    driftX: -13,
    driftY: 7,
    amp: 0.74,
    tailAmp: 9,
    facing: 1,
    role: "center",
  }),
  buildFish([1, 2, 3, 4, 5, 5, 6, 6, 5, 5, 4, 3, 2, 2, 1], 12, 13, 16, {
    phase: 4.55,
    omega: (Math.PI * 2) / 6.7,
    spatial: 4.3,
    driftOmega: (Math.PI * 2) / 17,
    driftX: -22,
    driftY: 5,
    amp: 0.92,
    tailAmp: 12,
    facing: -1,
    role: "right",
  }),
];

function buildDrifts(): DriftSpeck[] {
  const next = random(11);
  const bands: readonly { y: number; count: number; speed: number; wave: number; mark: Mark; alpha: number }[] = [
    { y: 0.06, count: 64, speed: 0.014, wave: 3.2, mark: "dot", alpha: 0.34 },
    { y: 0.11, count: 28, speed: -0.01, wave: 4.2, mark: "cross", alpha: 0.28 },
    { y: 0.17, count: 48, speed: 0.018, wave: 2.6, mark: "dot", alpha: 0.26 },
    { y: 0.23, count: 18, speed: -0.012, wave: 3, mark: "block", alpha: 0.22 },
    { y: 0.76, count: 56, speed: 0.016, wave: 3.4, mark: "dot", alpha: 0.3 },
    { y: 0.83, count: 24, speed: -0.013, wave: 4, mark: "cross", alpha: 0.26 },
    { y: 0.9, count: 52, speed: 0.011, wave: 2.8, mark: "dot", alpha: 0.28 },
    { y: 0.96, count: 20, speed: -0.009, wave: 2.2, mark: "block", alpha: 0.22 },
  ];
  const specks: DriftSpeck[] = [];

  for (let band = 0; band < bands.length; band += 1) {
    const row = bands[band];
    if (!row) continue;
    for (let index = 0; index < row.count; index += 1) {
      specks.push({
        x: (index + 0.5) / row.count + (next() - 0.5) * 0.004,
        y: row.y + (next() - 0.5) * 0.004,
        speed: row.speed,
        phase: next() * Math.PI * 2,
        wave: row.wave,
        mark: row.mark,
        size: row.mark === "block" ? 4 + next() * 2.5 : 13,
        alpha: row.alpha,
        band,
      });
    }
  }

  return specks;
}

function buildWaves(): WaveBand[] {
  const bands: readonly { base: number; amp: number; speed: number; turns: number; phase: number; count: number; mark: Mark }[] = [
    { base: 0.14, amp: 16, speed: 0.42, turns: 1.5, phase: 0.4, count: 54, mark: "dot" },
    { base: 0.8, amp: 18, speed: -0.33, turns: 1.2, phase: 2.1, count: 48, mark: "cross" },
    { base: 0.93, amp: 10, speed: 0.5, turns: 1.7, phase: 3.4, count: 40, mark: "dot" },
  ];

  return bands.map((band) => {
    const points: WavePoint[] = [];
    for (let index = 0; index < band.count; index += 1) {
      points.push({
        u: index / (band.count - 1),
        phase: index * 0.35,
        mark: index % 9 === 0 ? "block" : band.mark,
        size: index % 9 === 0 ? 3.5 : 11,
        alpha: 0.2 + (index % 5) * 0.025,
      });
    }
    return { ...band, points };
  });
}

function buildClusters(): CrossCluster[] {
  const seeds = [
    { x: 0.08, y: 0.18, phase: 0.2, drift: 0.006 },
    { x: 0.18, y: 0.84, phase: 1.4, drift: -0.008 },
    { x: 0.62, y: 0.9, phase: 2.6, drift: 0.01 },
    { x: 0.9, y: 0.22, phase: 3.8, drift: -0.007 },
    { x: 0.84, y: 0.72, phase: 5.1, drift: 0.009 },
  ];

  return seeds.map((seed, index) => {
    const members: CrossMember[] = [];
    const next = random(80 + index * 17);
    for (let member = 0; member < 7; member += 1) {
      const angle = next() * Math.PI * 2;
      const radius = 8 + next() * 18;
      members.push({
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius * 0.65,
        phase: next() * Math.PI * 2,
      });
    }
    return { ...seed, members };
  });
}

const DRIFTS = buildDrifts();
const WAVES = buildWaves();
const CLUSTERS = buildClusters();

const TEXT_BOXES: Box[] = [
  { left: 0, top: 0, right: 0, bottom: 0 },
  { left: 0, top: 0, right: 0, bottom: 0 },
  { left: 0, top: 0, right: 0, bottom: 0 },
];

function textFade(x: number, y: number, count: number): number {
  let fade = 1;

  for (let index = 0; index < count; index += 1) {
    const box = TEXT_BOXES[index];
    if (!box) continue;
    const dx = x < box.left ? box.left - x : x > box.right ? x - box.right : 0;
    const dy = y < box.top ? box.top - y : y > box.bottom ? y - box.bottom : 0;
    if (dx === 0 && dy === 0) return 0.07;
    const distance = Math.hypot(dx, dy);
    if (distance < 32) fade = Math.min(fade, 0.07 + (distance / 32) * 0.93);
  }

  return fade;
}

function bodyLeftOf(fish: FishModel): number {
  if (fish.facing === 1) return fish.coreStart;
  return fish.width - fish.coreEnd;
}

function layoutFishes(width: number, height: number, textCount: number) {
  let lowest = height * 0.58;
  let rightmost = width * 0.7;

  for (let index = 0; index < textCount; index += 1) {
    const box = TEXT_BOXES[index];
    if (!box) continue;
    if (box.bottom > lowest) lowest = box.bottom;
    if (box.right > rightmost) rightmost = box.right;
  }

  const pad = 32;

  for (let index = 0; index < FISHES.length; index += 1) {
    const fish = FISHES[index];
    if (!fish) continue;
    const coreWidth = fish.coreEnd - fish.coreStart;
    let bodyLeft = 72;
    let top = height * 0.66;

    if (fish.role === "left") {
      bodyLeft = 64;
      top = Math.max(height * 0.64, lowest + pad);
    } else if (fish.role === "center") {
      bodyLeft = width * 0.4;
      top = Math.max(height * 0.76, lowest + pad + 18);
    } else if (width - (rightmost + pad) > coreWidth + 24) {
      bodyLeft = Math.max(width * 0.73, rightmost + pad);
      top = Math.max(88, height * 0.42);
    } else {
      bodyLeft = Math.max(16, width - coreWidth - 16);
      top = lowest + pad;
    }

    fish.x = bodyLeft - bodyLeftOf(fish);
    fish.y = top;
    if (fish.y + fish.height > height - 22) fish.y = Math.max(72, height - fish.height - 22);
  }
}

function Rows({
  lines,
  className,
}: {
  lines: string[];
  className: string;
}) {
  return (
    <div>
      {lines.map((line, index) => (
        <div key={index} className={`whitespace-pre font-mono leading-[0.82] ${className}`}>
          {line}
        </div>
      ))}
    </div>
  );
}

function Fish({
  body,
  tail,
  fin,
  mirror = false,
  className,
  textClass,
}: {
  body: string[];
  tail: string[];
  fin: string[];
  mirror?: boolean;
  className: string;
  textClass: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className={mirror ? "-scale-x-100" : undefined}>
        <div className="flex items-center">
          <Rows lines={tail} className={`${textClass} text-gray/70`} />
          <div>
            <Rows lines={fin} className={`${textClass} text-white/35`} />
            <Rows lines={body} className={`${textClass} text-white/55`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Glyphs({ glyphs }: { glyphs: Glyph[] }) {
  return (
    <svg className="h-full w-full">
      {glyphs.map((glyph, index) =>
        glyph.kind === "block" ? (
          <rect
            key={index}
            x={`${glyph.left}%`}
            y={`${glyph.top}%`}
            width={glyph.size}
            height={glyph.size}
            opacity={glyph.opacity}
            className={toneClass(glyph.tone)}
          />
        ) : (
          <text
            key={index}
            x={`${glyph.left}%`}
            y={`${glyph.top}%`}
            fontSize={glyph.size}
            opacity={glyph.opacity}
            className={`font-mono ${toneClass(glyph.tone)}`}
          >
            {glyph.char}
          </text>
        ),
      )}
    </svg>
  );
}

function paintMark(
  ctx: CanvasRenderingContext2D,
  mark: Mark,
  x: number,
  y: number,
  size: number,
  phase: number,
  time: number,
) {
  if (mark === "block") {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    return;
  }

  const family = mark === "cross" ? FAMILIES[1] : FAMILIES[0];
  const index = Math.floor(time * 0.22 + phase);
  ctx.fillText(family[wrapGlyph(index, family.length)] ?? "·", x, y);
}

export default function HeroField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [motionOn, setMotionOn] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOTION_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setMotionOn(query.matches && !reduced.matches);

    sync();
    query.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!motionOn) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx = context;

    let frame = 0;
    let onScreen = true;
    let textCount = 0;
    let stopped = false;
    let width = 0;
    let height = 0;
    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      cx: -9999,
      cy: -9999,
      last: 0,
    };

    const measureText = () => {
      const section = canvas.closest("section");
      const origin = canvas.getBoundingClientRect();
      textCount = 0;
      if (!section) return;

      const lines = section.querySelectorAll("h1 > span > span");
      for (let index = 0; index < lines.length && textCount < TEXT_BOXES.length; index += 1) {
        const node = lines[index];
        const box = TEXT_BOXES[textCount];
        if (!(node instanceof HTMLElement) || !box) continue;

        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        let shiftY = 0;
        const transform = window.getComputedStyle(node).transform;
        if (transform && transform !== "none") shiftY = new DOMMatrix(transform).m42;

        box.left = rect.left - origin.left;
        box.top = rect.top - origin.top - shiftY;
        box.right = rect.right - origin.left;
        box.bottom = rect.bottom - origin.top - shiftY;
        textCount += 1;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bufferWidth = Math.floor(width * dpr);
      const bufferHeight = Math.floor(height * dpr);
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measureText();
      layoutFishes(width, height, textCount);
    };

    const drawFish = (fish: FishModel, time: number) => {
      const driftX = Math.sin(time * fish.driftOmega + fish.phase) * fish.driftX;
      const driftY = Math.sin(time * fish.driftOmega * 0.77 + fish.phase * 1.3) * fish.driftY;
      ctx.font = `${fish.fontPx}px ${MONO}`;

      for (let index = 0; index < fish.glyphs.length; index += 1) {
        const glyph = fish.glyphs[index];
        if (!glyph) continue;

        const alongWave =
          Math.sin(time * fish.omega + glyph.along * fish.spatial + fish.phase) * 0.72 +
          Math.sin(time * fish.omega * 0.53 + glyph.along * 2.1 + glyph.row * 0.62 + fish.phase) * 0.28;
        const amp =
          glyph.along < 0.8 ? waveAmp(glyph.along, fish.tailAmp) * fish.amp : waveAmp(glyph.along, fish.tailAmp);
        let offsetX = alongWave * amp;
        let offsetY =
          Math.sin(time * fish.omega * 0.71 + glyph.col * 0.36 + glyph.row * 0.48 + fish.phase) *
          (1.5 + glyph.along * 3.1) *
          fish.amp;

        if (glyph.part === "head") {
          offsetX *= 0.32;
          offsetY *= 0.38;
        } else if (glyph.part === "peduncle") {
          offsetX *= 1.12;
        } else if (glyph.part === "tail") {
          offsetX = Math.sin(time * fish.omega * 1.18 + fish.phase + glyph.row * 0.55) * fish.tailAmp;
          offsetY = Math.sin(time * fish.omega * 0.94 + fish.phase + glyph.row * 0.28) * glyph.row * 1.05;
        } else if (glyph.part === "fin") {
          offsetX += Math.sin(time * fish.omega + glyph.phase) * 3.4 * fish.amp;
          offsetY += Math.sin(time * fish.omega * 1.32 + fish.phase + 1.1) * 5.2 * fish.amp;
        } else if (glyph.part === "wake") {
          const lag = glyph.along * 1.7;
          offsetX = Math.sin(time * fish.omega + fish.spatial + fish.phase - lag) * fish.tailAmp;
          offsetY = Math.sin(time * fish.omega * 0.8 + fish.phase - lag + glyph.phase) * (5 + glyph.along * 2);
        }

        const localX = fish.facing === 1 ? glyph.x : fish.width - glyph.x;
        const x = fish.x + localX + driftX + offsetX;
        const y = fish.y + glyph.y + driftY + offsetY;
        if (textFade(x, y, textCount) < 0.9) continue;

        let density = glyph.density;
        if (density <= 2) {
          const edge = Math.sin(time * fish.omega * 0.62 + glyph.along * fish.spatial + glyph.row * 0.74 + fish.phase);
          if (edge > 0.48) density += 1;
          else if (edge < -0.48 && density > 1) density -= 1;
        }

        const family = FAMILIES[density - 1] ?? FAMILIES[0];
        const pos = time * 0.4 + glyph.phase * 1.6;
        const step = Math.floor(pos);
        const mix = holdMix(pos - step);
        const current = family[wrapGlyph(step, family.length)] ?? "·";
        const next = family[wrapGlyph(step + 1, family.length)] ?? "·";
        const breathe = 0.86 + 0.14 * Math.sin(time * 0.45 + glyph.phase);
        const alpha =
          (density >= 4 ? 0.72 : density === 3 ? 0.52 : density === 2 ? 0.34 : 0.22) * breathe;
        const rgb = glyph.part === "tail" || glyph.part === "wake" ? "176,176,176" : "255,255,255";

        ctx.fillStyle = ink(rgb, alpha * (1 - mix));
        ctx.fillText(current, x, y);
        if (mix > 0.02) {
          ctx.fillStyle = ink(rgb, alpha * mix);
          ctx.fillText(next, x, y);
        }
      }
    };

    const draw = (now: number) => {
      if (width < 2 || height < 2) return;
      const time = now / 1000;

      if (now - pointer.last > 160) {
        pointer.targetX += (0 - pointer.targetX) * 0.08;
        pointer.targetY += (0 - pointer.targetY) * 0.08;
      }
      pointer.x += (pointer.targetX - pointer.x) * 0.07;
      pointer.y += (pointer.targetY - pointer.y) * 0.07;
      const fieldX = pointer.x * 2.5;
      const fieldY = pointer.y * 2.2;

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `11px ${MONO}`;

      for (let index = 0; index < WAVES.length; index += 1) {
        const band = WAVES[index];
        if (!band) continue;
        for (let pointIndex = 0; pointIndex < band.points.length; pointIndex += 1) {
          const point = band.points[pointIndex];
          if (!point) continue;
          const x = point.u * width + fieldX;
          const y =
            band.base * height +
            Math.sin(point.u * Math.PI * 2 * band.turns + time * band.speed + band.phase) * band.amp +
            fieldY;
          const fade = textFade(x, y, textCount);
          const pulse = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(time * 0.31 + band.phase + point.phase));
          ctx.fillStyle = ink("140,140,140", point.alpha * fade * pulse);
          paintMark(ctx, point.mark, x, y, point.size, point.phase, time);
        }
      }

      for (let index = 0; index < DRIFTS.length; index += 1) {
        const speck = DRIFTS[index];
        if (!speck) continue;
        const nx = speck.x + time * speck.speed;
        const wrapped = nx - Math.floor(nx);
        let edge = 1;
        if (wrapped < 0.035) edge = wrapped / 0.035;
        else if (wrapped > 0.965) edge = (1 - wrapped) / 0.035;
        const x = wrapped * width + fieldX;
        const y =
          speck.y * height +
          Math.sin(time * 0.45 + speck.phase + speck.band) * speck.wave +
          fieldY;
        let pushX = 0;
        let pushY = 0;
        const cdx = x - pointer.cx;
        const cdy = y - pointer.cy;
        const distance = Math.hypot(cdx, cdy);
        if (distance > 1 && distance < 150) {
          const push = (1 - distance / 150) * 5;
          pushX = (cdx / distance) * push;
          pushY = (cdy / distance) * push;
        }
        const fade = textFade(x, y, textCount);
        const group = 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(time * 0.27 + speck.band * 1.7 + speck.x * 6));
        ctx.fillStyle = ink("140,140,140", speck.alpha * fade * edge * group);
        paintMark(ctx, speck.mark, x + pushX, y + pushY, speck.size, speck.phase, time);
      }

      for (let index = 0; index < CLUSTERS.length; index += 1) {
        const cluster = CLUSTERS[index];
        if (!cluster) continue;
        const nx = cluster.x + time * cluster.drift;
        const wrapped = nx - Math.floor(nx);
        const cx = wrapped * width + fieldX;
        const cy = cluster.y * height + Math.sin(time * 0.36 + cluster.phase) * 5 + fieldY;
        for (let memberIndex = 0; memberIndex < cluster.members.length; memberIndex += 1) {
          const member = cluster.members[memberIndex];
          if (!member) continue;
          const x = cx + member.dx + Math.sin(time * 0.5 + member.phase) * 7;
          const y = cy + member.dy + Math.cos(time * 0.44 + member.phase) * 5;
          const fade = textFade(x, y, textCount);
          ctx.fillStyle = ink("168,168,168", 0.2 * fade);
          ctx.fillText("+", x, y);
        }
      }

      for (let index = 0; index < FISHES.length; index += 1) {
        const fish = FISHES[index];
        if (fish) drawFish(fish, time);
      }
    };

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);
      draw(now);
    };

    const start = () => {
      if (frame !== 0 || document.visibilityState !== "visible" || !onScreen) return;
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointer = (event: PointerEvent) => {
      const viewportWidth = window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;
      const origin = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX / viewportWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / viewportHeight - 0.5) * 2;
      pointer.cx = event.clientX - origin.left;
      pointer.cy = event.clientY - origin.top;
      pointer.last = performance.now();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (onScreen) start();
      else stop();
    });

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resize();
    observer.observe(root);
    resizeObserver.observe(root);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    void document.fonts.ready.then(() => {
      if (stopped) return;
      measureText();
      layoutFishes(width, height, textCount);
    });
    start();

    return () => {
      stopped = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionOn]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className={motionOn ? "absolute inset-0 h-full w-full" : "hidden"} />

      <div className={motionOn ? "hidden" : "absolute inset-0 hidden lg:block"}>
        <Glyphs glyphs={staticWater} />
        <Fish body={LARGE_BODY} tail={LARGE_TAIL} fin={LARGE_FIN} textClass="text-[15px]" className="bottom-[4%] left-[1%]" />
        <Fish
          body={SMALL_BODY}
          tail={SMALL_TAIL}
          fin={SMALL_FIN}
          textClass="text-[11px]"
          className="bottom-[3%] left-[42%]"
        />
        <Fish
          body={LARGE_BODY}
          tail={LARGE_TAIL}
          fin={LARGE_FIN}
          mirror
          textClass="text-[15px]"
          className="bottom-[20%] right-[2%]"
        />
      </div>

      <div className="absolute inset-0 lg:hidden">
        <Glyphs glyphs={mobileWater} />
        <Fish body={LARGE_BODY} tail={LARGE_TAIL} fin={LARGE_FIN} textClass="text-[8px]" className="left-[2%] top-[16%]" />
        <Fish
          body={SMALL_BODY}
          tail={SMALL_TAIL}
          fin={SMALL_FIN}
          textClass="text-[7px]"
          className="left-[36%] top-[30%]"
        />
        <Fish
          body={LARGE_BODY}
          tail={LARGE_TAIL}
          fin={LARGE_FIN}
          mirror
          textClass="text-[8px]"
          className="right-[1%] top-[14%]"
        />
      </div>
    </div>
  );
}
