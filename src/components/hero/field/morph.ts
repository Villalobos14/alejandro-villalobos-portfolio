import { ROLES } from "./anatomy";
import { HERO_FIELD_CONFIG } from "./config";
import { clamp, random, smootherstep, smoothstep } from "./math";
import type { Anchor, Motion } from "./types";

const angleOf = (anchor: Anchor) => Math.atan2(anchor.y, anchor.x);

/**
 * Canonical order for the reference motif: by angle around the centre, then
 * inner to outer inside small angular blocks, so neighbouring indices are
 * neighbours in space and thinning by index stays even.
 */
export function canonical(anchors: readonly Anchor[]): Anchor[] {
  const keyed = anchors.map((anchor) => ({ anchor, angle: angleOf(anchor), radius: Math.hypot(anchor.x, anchor.y) }));
  keyed.sort((a, b) => a.angle - b.angle);
  const block = Math.max(4, Math.round(anchors.length / 18));
  const ordered: Anchor[] = [];
  for (let start = 0; start < keyed.length; start += block) {
    for (const { anchor } of keyed.slice(start, start + block).sort((a, b) => a.radius - b.radius)) ordered.push(anchor);
  }
  return ordered;
}

/** Root to tip, and around the centre within each band of similar reach, so pairs run root to root and tip to tip. */
function anatomical<T>(items: T[], anchorOf: (item: T) => Anchor): T[] {
  items.sort((a, b) => anchorOf(a).reach - anchorOf(b).reach);
  const block = Math.max(4, Math.round(items.length / 10));
  const out: T[] = [];
  for (let start = 0; start < items.length; start += block) {
    for (const item of items.slice(start, start + block).sort((a, b) => angleOf(anchorOf(a)) - angleOf(anchorOf(b)))) {
      out.push(item);
    }
  }
  return out;
}

/** Which of `length` sorted items to keep so that `count` of them are spread evenly along it. */
function spreadPicks(length: number, count: number): boolean[] {
  const picks = new Array<boolean>(length).fill(false);
  for (let i = 0; i < count; i += 1) picks[Math.floor(((i + 0.5) * length) / count)] = true;
  return picks;
}

/**
 * Reorders `shape` so that `result[i]` is the part `reference[i]` becomes:
 * body to core, each wing to its own side, tail to the main tentacle, wing
 * edges to the margin and fine filaments. Roles whose counts don't match keep
 * an even spread and hand the rest to a shared pool, paired by angle.
 */
export function alignByRole(reference: readonly Anchor[], shape: readonly Anchor[]): Anchor[] {
  const result: Anchor[] = new Array<Anchor>(reference.length);
  const spareIndices: number[] = [];
  const spareAnchors: Anchor[] = [];

  for (let role = 0; role < ROLES; role += 1) {
    const indices = anatomical(
      reference.flatMap((anchor, index) => (anchor.role === role ? [index] : [])),
      (index) => reference[index] as Anchor,
    );
    const anchors = anatomical(
      shape.filter((anchor) => anchor.role === role),
      (anchor) => anchor,
    );
    const pairs = Math.min(indices.length, anchors.length);
    const keepIndex = spreadPicks(indices.length, pairs);
    const keepAnchor = spreadPicks(anchors.length, pairs);
    const kept: Anchor[] = [];
    anchors.forEach((anchor, k) => (keepAnchor[k] ? kept.push(anchor) : spareAnchors.push(anchor)));
    let next = 0;
    indices.forEach((index, k) => {
      const partner = keepIndex[k] ? kept[next] : undefined;
      if (partner) {
        result[index] = partner;
        next += 1;
      } else {
        spareIndices.push(index);
      }
    });
  }

  spareIndices.sort((a, b) => angleOf(reference[a] as Anchor) - angleOf(reference[b] as Anchor));
  spareAnchors.sort((a, b) => angleOf(a) - angleOf(b));
  spareIndices.forEach((index, k) => {
    const partner = spareAnchors[k];
    if (partner) result[index] = partner;
  });

  return result;
}

/**
 * Stamps each anchor with when it leaves as a source and when it settles as
 * a target, by role: edges and filaments loosen first and the body holds on
 * longest; the core lands first, then the sides, then edges and the long
 * tentacle or tail. Within a role, tips leave before roots and settle after.
 */
export function stampTiming(anchors: readonly Anchor[], seed: number): void {
  const { jitter, roles } = HERO_FIELD_CONFIG.morph;
  const next = random(seed);
  for (const anchor of anchors) {
    const release = roles.release[anchor.role] ?? 0;
    const resolve = roles.resolve[anchor.role] ?? 0.4;
    anchor.release = clamp(release + 0.06 * (1 - anchor.reach) + (next() - 0.5) * jitter, 0, 0.3);
    anchor.resolve = clamp(resolve + 0.1 * anchor.reach + (next() - 0.5) * jitter, 0.28, 0.64);
  }
}

export interface MorphPoint {
  x: number;
  y: number;
  z: number;
  density: number;
  alpha: number;
  weight: number;
  /** Destination influence, 0 → 1. */
  settle: number;
  /** How unformed the glyph is right now, 0 → 1 → 0 across the morph. */
  flow: number;
}

export interface MorphGlyph {
  phase: number;
  speed: number;
  /** Direction of the organism's flow field, ±1. */
  swirl: number;
  /** Motion amplitude applied to both motifs. */
  amp: number;
  /** Stretch of the cloud on its way to the target motif. */
  cloudX: number;
  cloudY: number;
  /** How far matter bound for the target's lower parts sinks while unformed. */
  sink: number;
  /** How much earlier each axis settles: wings fold in before they hang, a bell flattens before it widens. */
  leadX: number;
  leadY: number;
}

/**
 * Release → flow → resolve. Glyphs leave their source anchor on their own
 * schedule, drift through a swirling cloud that already leans toward the
 * target's proportions, then settle onto their destination anchor while both
 * motifs keep their own motion. Runs in motif space, so it composes with
 * whatever the organism is doing in the world.
 */
export function morphGlyph(
  a: Anchor,
  from: Motion,
  b: Anchor,
  into: Motion,
  progress: number,
  time: number,
  glyph: MorphGlyph,
  out: MorphPoint,
): void {
  const m = HERO_FIELD_CONFIG.morph;
  const { phase, speed, swirl, amp } = glyph;
  const release = smoothstep(a.release, a.release + m.releaseSpan, progress);
  const settle = smootherstep(b.resolve, b.resolve + m.resolveSpan, progress);
  const settleX = smootherstep(b.resolve - glyph.leadX, b.resolve - glyph.leadX + m.resolveSpan, progress);
  const settleY = smootherstep(b.resolve - glyph.leadY, b.resolve - glyph.leadY + m.resolveSpan, progress);
  const flow = release * (1 - settle);

  const ax = a.x + from.dx * amp;
  const ay = a.y + from.dy * amp;
  const az = a.z + from.dz * amp;
  const px = ax + (b.x + into.dx * amp - ax) * settleX;
  const py = ay + (b.y + into.dy * amp - ay) * settleY;
  const pz = az + (b.z + into.dz * amp - az) * settle;
  const aDensity = a.density + from.density;
  const bDensity = b.density + into.density;
  const turn = m.swirl * swirl * flow * (0.75 + 0.25 * Math.sin(phase * 3));
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  const shrink = 1 - m.contract * flow;
  const sx = shrink * (1 + (glyph.cloudX - 1) * flow);
  const sy = shrink * (1 + (glyph.cloudY - 1) * flow);

  out.x = (px * cos - py * sin) * sx + flow * (m.wobble * Math.sin(time * 1.3 * speed + phase) + m.currentX * swirl);
  out.y =
    (px * sin + py * cos) * sy +
    flow * (m.wobble * Math.cos(time * 1.1 * speed + phase * 1.7) + m.currentY + glyph.sink * Math.max(0, b.y));
  out.z = pz * shrink + flow * m.wobble * 1.6 * Math.sin(time * 0.9 * speed + phase * 2.3);
  out.density = aDensity + (bDensity - aDensity) * settle - m.thin * flow;
  out.alpha = (from.alpha + (into.alpha - from.alpha) * settle) * (1 - m.dim * flow) * (1 + m.settle * 4 * settle * (1 - settle));
  out.weight = a.weight + (b.weight - a.weight) * settle;
  out.settle = settle;
  out.flow = flow;
}
