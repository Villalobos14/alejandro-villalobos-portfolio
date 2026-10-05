import { FAMILIES, GLYPHS, HERO_FIELD_CONFIG as CONFIG, SEQUENCE, type EntityConfig, type ModeConfig } from "./config";
import { clamp, random, smoothstep, TAU } from "./math";
import { alignByRole, canonical, morphGlyph, stampTiming, type MorphGlyph, type MorphPoint } from "./morph";
import { MOTIFS } from "./motifs";
import { createFlightPath, type FlightPath } from "./paths";
import { depthMotion, depthOpacity, depthThin, type Pose } from "./space";
import type { Anchor, MotifDefinition, MotifFrame, Motion } from "./types";

/**
 * One creature travelling through the hero: a fixed set of glyph identities
 * that wear each motif of the sequence in turn, plus its own place in the
 * world, its orientation and its own morph timeline. Geometry is built once;
 * every frame only fills the typed output arrays, so nothing is allocated
 * while animating.
 */
export interface Organism {
  entity: EntityConfig;
  /** Position in the entity list; staggers the intro. */
  index: number;
  count: number;
  /** Motif anchors in SEQUENCE order, aligned by anatomy: `shapes[k][i]` is what glyph `i` is in motif `k`. */
  shapes: readonly (readonly Anchor[])[];
  motifs: readonly MotifDefinition[];
  phase: Float32Array;
  speed: Float32Array;
  /** Angular rate of the rare green pulse; 0 for glyphs that never turn green. */
  greenRate: Float32Array;
  /** Order in which glyphs of the same importance are thinned as detail drops, spread evenly around the body. */
  rank: Float32Array;
  rng: () => number;
  /** Seconds added to this creature's clock so no two move in step. */
  offset: number;

  /** Index into SEQUENCE it is wearing, and the one it is becoming while morphing. */
  current: number;
  next: number;
  /** Seconds since it last finished morphing, and how long it holds before the next morph. */
  clock: number;
  hold: number;
  morphLength: number;
  /** −1 while holding, 0 → 1 through a morph. */
  progress: number;
  /** Eased share of the next motif's behaviour, 0 → 1 across a morph. */
  blend: number;
  /** Direction the matter swirls during this morph, ±1. */
  swirl: number;

  paths: FlightPath[];
  path: number;
  /** Fraction of the current path's length travelled. */
  along: number;
  cx: number;
  cy: number;
  /** 0 near, 1 far. */
  depth: number;
  /** Level of detail at this depth, 0–1, read against each glyph's importance. */
  detail: number;
  /** Glyphs drawn last frame, counting fades; glyph size follows the spacing it implies. */
  drawn: number;
  slope: number;
  /** Radius in px before depth, and as projected now. */
  base: number;
  radius: number;
  /** Smoothed screen velocity in px/s. */
  vx: number;
  vy: number;
  /** The same velocity followed with the motif's inertia, for parts that trail behind. */
  lagX: number;
  lagY: number;
  /** Travel speed in radii per second. */
  pace: number;
  /** Direction of travel in the screen plane, unwrapped so it never jumps. */
  heading: number;
  /** Smoothed heading change in rad/s. */
  turn: number;
  /** Upright spin nearest the heading, so a lily never turns more than half a circle to become a manta. */
  spinBase: number;
  oriented: boolean;
  pose: Pose;
  matrix: Float32Array;
  fontKey: number;
  /** Fonts by size bucket (3) × depth relief (3). */
  fonts: string[];
  /** Reduced motion: placed once and drawn still. */
  still: boolean;
  /** Within reach of the hero this frame; offscreen creatures skip their glyph work. */
  visible: boolean;
  /** Some glyph actually landed on the canvas last frame. */
  seen: boolean;
  /** Mean unformedness this frame, used to pull nearby background specks in. */
  flow: number;

  x: Float32Array;
  y: Float32Array;
  a1: Float32Array;
  a2: Float32Array;
  c1: Uint8Array;
  c2: Uint8Array;
  bucket: Uint8Array;
  glow: Float32Array;
  pushX: Float32Array;
  pushY: Float32Array;
  velX: Float32Array;
  velY: Float32Array;
  springing: boolean;
}

export interface FrameEnv {
  time: number;
  dt: number;
  width: number;
  height: number;
  timing: ModeConfig["timing"];
  motion: number;
  rotation: number;
  intro: boolean;
  /** Smoothed pointer position in −1…1, for depth parallax. */
  parallaxX: number;
  parallaxY: number;
  pointer: boolean;
  pointerX: number;
  pointerY: number;
  /** Dimming behind the headline at a canvas point. */
  veil: (x: number, y: number) => number;
  /** The viewer's eye level, as a fraction of the hero height. */
  horizon: number;
}

/** Van der Corput sequence: neighbouring indices get far-apart ranks, so thinning by rank stays even. */
function spread(index: number): number {
  let value = 0;
  let base = 0.5;
  for (let n = index + 1; n > 0; n >>= 1, base /= 2) if (n & 1) value += base;
  return value;
}

export function createOrganism(entity: EntityConfig, index: number, seed: number, mode: ModeConfig): Organism {
  const count = entity.glyphs;
  // Built once: the first motif in canonical order, the others aligned to it part for part.
  const built = SEQUENCE.map((type, order) => MOTIFS[type].build(count, seed + order * 101));
  const reference = canonical(built[0] ?? []);
  const shapes = built.map((shape, order) => (order === 0 ? reference : alignByRole(reference, shape)));
  shapes.forEach((shape, order) => stampTiming(shape, seed + order * 7));
  const rng = random(seed * 31 + 5);
  const phase = new Float32Array(count);
  const speed = new Float32Array(count);
  const greenRate = new Float32Array(count);
  const rank = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    phase[i] = rng() * TAU;
    speed[i] = 0.85 + rng() * 0.3;
    rank[i] = spread(i);
  }

  const { every, minPeriod, maxPeriod } = CONFIG.green;
  const greens = Math.max(1, Math.round(count / every));
  for (let i = 0; i < greens; i += 1) {
    greenRate[Math.floor(rng() * count)] = TAU / (minPeriod + rng() * (maxPeriod - minPeriod));
  }

  const motif = entity.motif % SEQUENCE.length;

  return {
    entity,
    index,
    count,
    shapes,
    motifs: SEQUENCE.map((type) => MOTIFS[type]),
    phase,
    speed,
    greenRate,
    rank,
    rng,
    offset: rng() * 40,
    current: motif,
    next: motif,
    clock: 0,
    hold: entity.firstMorph,
    morphLength: mode.timing.morph[0],
    progress: -1,
    blend: 0,
    swirl: 1,
    paths: entity.paths.map(createFlightPath),
    path: 0,
    along: entity.start,
    cx: -9999,
    cy: -9999,
    depth: 0.5,
    detail: 1,
    drawn: count,
    slope: 0,
    base: 0,
    radius: 0,
    vx: 0,
    vy: 0,
    lagX: 0,
    lagY: 0,
    pace: 0,
    heading: 0,
    turn: 0,
    spinBase: 0,
    oriented: false,
    pose: { spin: 0, tiltX: 0, tiltY: 0 },
    matrix: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
    fontKey: -1,
    fonts: ["", "", "", "", "", "", "", "", ""],
    still: false,
    visible: false,
    seen: false,
    flow: 0,
    x: new Float32Array(count),
    y: new Float32Array(count),
    a1: new Float32Array(count),
    a2: new Float32Array(count),
    c1: new Uint8Array(count),
    c2: new Uint8Array(count),
    bucket: new Uint8Array(count),
    glow: new Float32Array(count),
    pushX: new Float32Array(count),
    pushY: new Float32Array(count),
    velX: new Float32Array(count),
    velY: new Float32Array(count),
    springing: false,
  };
}

const from: Motion = { dx: 0, dy: 0, dz: 0, density: 0, alpha: 1 };
const into: Motion = { dx: 0, dy: 0, dz: 0, density: 0, alpha: 1 };
const point: MorphPoint = { x: 0, y: 0, z: 0, density: 1, alpha: 1, weight: 0, settle: 0, flow: 0 };
const glyph: MorphGlyph = { phase: 0, speed: 1, swirl: 1, amp: 1, cloudX: 1, cloudY: 1, sink: 0, leadX: 0, leadY: 0 };
const sourceFrame: MotifFrame = { time: 0, vigor: 1, turn: 0, speed: 0, flowX: 0, flowY: 0, flowZ: 0, viewX: 0, viewY: 0, viewZ: 1 };
const targetFrame: MotifFrame = { time: 0, vigor: 1, turn: 0, speed: 0, flowX: 0, flowY: 0, flowZ: 0, viewX: 0, viewY: 0, viewZ: 1 };
const tone = new Float32Array(5);

function rest(motion: Motion): void {
  motion.dx = 0;
  motion.dy = 0;
  motion.dz = 0;
  motion.density = 0;
  motion.alpha = 1;
}

/**
 * How much of a glyph shows from the current viewpoint: marks on the back or
 * the belly only when that side faces the camera, and thin surfaces less when
 * seen edge-on, where their glyphs crowd into a line.
 */
function facing(anchor: Anchor, sheet: boolean, back: number, edge: number): number {
  const f = CONFIG.face;
  const side = anchor.face === 0 ? 1 : smoothstep(f.from, f.to, anchor.face * back);
  return sheet ? side * edge : side;
}

/** How much of a class of glyphs of this importance is drawn at this level of detail. */
function share(importance: number, detail: number): number {
  const l = CONFIG.lod;
  return clamp((detail - (l.reach * (1 - importance) - l.offset)) / l.width, 0, 1);
}

/** Holds a glyph for most of its step, then cross-fades into the next one. */
function holdMix(fraction: number): number {
  if (fraction < 0.7) return 0;
  const u = (fraction - 0.7) / 0.3;
  return u * u * (3 - 2 * u);
}

/**
 * Animates each glyph in motif space, morphs it if the organism is changing,
 * then rotates it by the organism's pose and projects it with perspective.
 */
export function stepGlyphs(o: Organism, env: FrameEnv): void {
  if (!o.visible) {
    o.flow = 0;
    o.seen = false;
    return;
  }

  const fromIndex = o.current;
  let toIndex = o.next;
  let progress = o.progress;
  let reveal = 1;
  let intro = false;

  if (env.intro) {
    const u = (env.time - CONFIG.intro.delay - o.index * CONFIG.intro.stagger) / env.timing.intro;
    if (u < 1) {
      const start = CONFIG.morph.introFrom;
      toIndex = fromIndex;
      progress = start + (1 - start) * clamp(u, 0, 1);
      reveal = smoothstep(0, 0.45, u);
      intro = true;
    }
  }

  const source = o.shapes[fromIndex] ?? [];
  const target = o.shapes[toIndex] ?? source;
  const sourceMotif = o.motifs[fromIndex];
  const targetMotif = o.motifs[toIndex] ?? sourceMotif;
  if (!sourceMotif || !targetMotif) return;

  const m = o.matrix;
  const radius = o.radius;
  // Travel velocity in the motif's own axes, followed with inertia, so tentacles and tails trail it late.
  const inverse = 1 / Math.max(1, radius);
  const flowX = (m[0] * o.lagX + m[3] * o.lagY) * inverse;
  const flowY = (m[1] * o.lagX + m[4] * o.lagY) * inverse;
  const flowZ = (m[2] * o.lagX + m[5] * o.lagY) * inverse;
  const time = env.time + o.offset;
  sourceFrame.flowX = flowX;
  sourceFrame.flowY = flowY;
  sourceFrame.flowZ = flowZ;
  targetFrame.flowX = flowX;
  targetFrame.flowY = flowY;
  targetFrame.flowZ = flowZ;
  sourceFrame.viewX = targetFrame.viewX = m[6] ?? 0;
  sourceFrame.viewY = targetFrame.viewY = m[7] ?? 0;
  sourceFrame.viewZ = targetFrame.viewZ = m[8] ?? 1;
  sourceFrame.time = time;
  sourceFrame.vigor = intro ? 1 : 1 - o.blend;
  sourceFrame.turn = o.turn;
  sourceFrame.speed = o.pace;
  targetFrame.time = time;
  targetFrame.vigor = intro ? 1 : o.blend;
  targetFrame.turn = o.turn;
  targetFrame.speed = o.pace;

  const amp = env.motion * depthMotion(o.depth);
  const thin = depthThin(o.depth);
  depthOpacity(o.depth, tone);
  const cloud = CONFIG.morph.cloud[targetMotif.type];
  glyph.swirl = o.swirl;
  glyph.amp = amp;
  glyph.cloudX = cloud[0];
  glyph.cloudY = cloud[1];
  glyph.sink = cloud[2];
  glyph.leadX = cloud[3];
  glyph.leadY = cloud[4];

  // Which side faces the camera: 1 the back, −1 the belly. Edge-on, thin surfaces dim.
  const back = m[8];
  const edge = CONFIG.sheet.floor + (1 - CONFIG.sheet.floor) * Math.abs(back);
  const detail = o.detail;
  const fade = CONFIG.lod.fade;
  let drawn = 0;

  const parallax = CONFIG.depth.parallax[0] + CONFIG.depth.parallax[1] * (1 - o.depth);
  const originX = o.cx + env.parallaxX * parallax;
  const originY = o.cy + env.parallaxY * parallax;
  const distance = CONFIG.camera.distance;
  const relief = CONFIG.relief;
  const look = CONFIG.glyph;

  const p = CONFIG.pointer;
  const near = env.pointer && Math.hypot(env.pointerX - originX, env.pointerY - originY) < radius * 1.6 + p.radius;
  const springs = near || o.springing;
  const frames = Math.min(3, env.dt * 60);
  const stiffness = p.stiffness * frames;
  const damping = Math.pow(p.damping, frames);
  let restless = 0;
  let flowSum = 0;
  let seen = false;

  for (let i = 0; i < o.count; i += 1) {
    const a = source[i];
    if (!a) continue;
    const b = progress >= 0 ? target[i] : undefined;

    // Level of detail: at this depth only part of each importance class is drawn, silhouette first.
    const kept = share(b ? Math.max(a.importance, b.importance) : a.importance, detail) - o.rank[i];
    if (kept <= 0) {
      o.a1[i] = 0;
      o.a2[i] = 0;
      o.glow[i] = 0;
      continue;
    }
    const thinning = Math.min(1, kept / fade);
    drawn += thinning;

    const phase = o.phase[i];
    rest(from);
    sourceMotif.animate(a, sourceFrame, phase, from);

    let x: number;
    let y: number;
    let z: number;
    let density: number;
    let alpha: number;
    let weight: number;
    let size = a.size;
    let shown = facing(a, sourceMotif.sheet, back, edge);

    if (b) {
      rest(into);
      targetMotif.animate(b, targetFrame, phase, into);
      glyph.phase = phase;
      glyph.speed = o.speed[i];
      morphGlyph(a, from, b, into, progress, time, glyph, point);
      x = point.x;
      y = point.y;
      z = point.z;
      density = point.density;
      alpha = point.alpha;
      weight = point.weight;
      if (point.settle > 0.5) size = b.size;
      shown += (facing(b, targetMotif.sheet, back, edge) - shown) * point.settle;
      flowSum += point.flow;
    } else {
      x = a.x + from.dx * amp;
      y = a.y + from.dy * amp;
      z = a.z + from.dz * amp;
      density = a.density + from.density;
      alpha = from.alpha;
      weight = a.weight;
    }

    const rx = m[0] * x + m[1] * y + m[2] * z;
    const ry = m[3] * x + m[4] * y + m[5] * z;
    const rz = m[6] * x + m[7] * y + m[8] * z;
    const scale = distance / (distance + rz);
    let px = originX + rx * scale * radius;
    let py = originY + ry * scale * radius;

    if (springs) {
      let tx = 0;
      let ty = 0;
      if (near) {
        const dx = px - env.pointerX;
        const dy = py - env.pointerY;
        const d2 = dx * dx + dy * dy;
        if (d2 < p.radius * p.radius && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = 1 - d / p.radius;
          tx = (dx / d) * f * f * p.push;
          ty = (dy / d) * f * f * p.push;
        }
      }
      const vx = (o.velX[i] + (tx - o.pushX[i]) * stiffness) * damping;
      const vy = (o.velY[i] + (ty - o.pushY[i]) * stiffness) * damping;
      const sx = o.pushX[i] + vx;
      const sy = o.pushY[i] + vy;
      o.velX[i] = vx;
      o.velY[i] = vy;
      o.pushX[i] = sx;
      o.pushY[i] = sy;
      restless = Math.max(restless, Math.abs(sx) + Math.abs(sy) + Math.abs(vx) + Math.abs(vy));
      px += sx;
      py += sy;
    }

    o.x[i] = px;
    o.y[i] = py;
    if (!seen && px > -8 && px < env.width + 8 && py > -8 && py < env.height + 8) seen = true;
    o.bucket[i] = size * 3 + (scale > 1 + relief.step ? 2 : scale < 1 - relief.step ? 0 : 1);

    const level = clamp(density - thin, 1, 5);
    const lower = Math.min(4, Math.floor(level));
    const frac = level - lower;
    const low = tone[lower - 1] ?? 0;
    const shade = low + ((tone[lower] ?? low) - low) * frac;
    const cue = 1 + relief.alpha * clamp((scale - 1) / (relief.step * 2), -1, 1);
    const breathe = 1 - look.breathe + look.breathe * Math.sin(time * 0.45 + phase);
    const visible =
      Math.min(look.maxAlpha, shade * alpha * (0.85 + 0.15 * weight) * breathe * cue * shown) *
      thinning *
      reveal *
      env.veil(px, py);

    const lowFamily = FAMILIES[lower - 1] ?? FAMILIES[0] ?? [];
    const highFamily = FAMILIES[lower] ?? lowFamily;
    const blend = smoothstep(0.3, 0.7, frac);
    const pos = time * look.cycle * o.speed[i] + phase * 1.6;
    const step = Math.floor(pos);

    if (blend > 0.02 && blend < 0.98) {
      o.c1[i] = lowFamily[step & 3] ?? 0;
      o.a1[i] = visible * (1 - blend);
      o.c2[i] = highFamily[step & 3] ?? 0;
      o.a2[i] = visible * blend;
    } else {
      const family = blend >= 0.98 ? highFamily : lowFamily;
      const mix = holdMix(pos - step);
      o.c1[i] = family[step & 3] ?? 0;
      o.a1[i] = visible * (1 - mix);
      o.c2[i] = family[(step + 1) & 3] ?? 0;
      o.a2[i] = visible * mix;
    }

    const rate = o.greenRate[i];
    o.glow[i] = rate > 0 ? Math.pow(Math.max(0, Math.sin(time * rate + phase * 5)), CONFIG.green.sharpness) : 0;
  }

  o.springing = restless > 0.02;
  o.seen = seen;
  o.drawn = drawn;
  o.flow = progress >= 0 && !intro ? flowSum / Math.max(1, o.count) : 0;
}

export function drawOrganism(ctx: CanvasRenderingContext2D, o: Organism): void {
  if (!o.visible) return;

  for (let bucket = 0; bucket < o.fonts.length; bucket += 1) {
    ctx.font = o.fonts[bucket] ?? "";
    for (let i = 0; i < o.count; i += 1) {
      if (o.bucket[i] !== bucket) continue;
      const keep = 1 - o.glow[i];
      const x = o.x[i];
      const y = o.y[i];
      const a1 = o.a1[i] * keep;
      const a2 = o.a2[i] * keep;
      if (a1 > 0.004) {
        ctx.globalAlpha = a1;
        ctx.fillText(GLYPHS[o.c1[i]] ?? "·", x, y);
      }
      if (a2 > 0.004) {
        ctx.globalAlpha = a2;
        ctx.fillText(GLYPHS[o.c2[i]] ?? "·", x, y);
      }
    }
  }

  const green = CONFIG.green;
  let tinted = false;
  for (let i = 0; i < o.count; i += 1) {
    const glow = o.glow[i];
    if (glow < 0.01) continue;
    if (!tinted) {
      ctx.fillStyle = green.color;
      tinted = true;
    }
    ctx.font = o.fonts[o.bucket[i]] ?? "";
    ctx.globalAlpha = Math.min(green.maxAlpha, (o.a1[i] + o.a2[i]) * glow * green.gain);
    ctx.fillText(GLYPHS[o.c1[i]] ?? "·", o.x[i], o.y[i]);
  }
  if (tinted) ctx.fillStyle = "#ffffff";
}
