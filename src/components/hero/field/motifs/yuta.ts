import { HERO_FIELD_CONFIG } from "../config";
import { clamp, fract, random } from "../math";
import {
  allocate,
  alongCurve,
  bounds,
  contains,
  draft,
  fillRegion,
  finalize,
  keepSpaced,
  pickEven,
  polyline,
  propose,
  Spacing,
  type Draft,
  type Point,
} from "../sample";
import type { MotifDefinition } from "../types";

const HAIR = 0;
const FACE = 1;
const FEATURE = 2;
const NECK = 3;
const CLOTHING = 4;
const AMBIENT = 5;

/** `part` inside HAIR, FACE and CLOTHING: the silhouette line versus the surface. */
const FILL = 0;
const OUTLINE = 1;

const RAD = Math.PI / 180;
const P = (x: number, y: number): Point => ({ x, y });

const HEAD = { x: 0, y: -0.33, rx: 0.48, ry: 0.46 };

/** Shaggy tufts around the crown; angles are screen degrees, −90 is straight up. */
const TUFTS = [
  { angle: -176, amp: 0.2, width: 8 },
  { angle: -156, amp: 0.26, width: 8 },
  { angle: -134, amp: 0.18, width: 7 },
  { angle: -112, amp: 0.24, width: 8 },
  { angle: -92, amp: 0.16, width: 7 },
  { angle: -72, amp: 0.26, width: 8 },
  { angle: -50, amp: 0.2, width: 7 },
  { angle: -28, amp: 0.25, width: 8 },
  { angle: -6, amp: 0.18, width: 8 },
];

function crown(degrees: number): Point {
  let r = 1;
  for (const tuft of TUFTS) {
    const d = Math.abs(degrees - tuft.angle) / tuft.width;
    if (d < 1) r += tuft.amp * Math.pow(1 - d, 1.8);
  }
  const a = degrees * RAD;
  return { x: HEAD.x + Math.cos(a) * HEAD.rx * r, y: HEAD.y + Math.sin(a) * HEAD.ry * r };
}

/*
 * One closed silhouette for the hair: the spiky crown, the right side lock,
 * a jagged fringe that falls to the eyes with one long strand between them,
 * and the left side lock. Everything inside is hair; the face shows only
 * below and between the fringe.
 */
const HAIR_OUTLINE: readonly Point[] = (() => {
  const points: Point[] = [];
  for (let degrees = -195; degrees <= 15; degrees += 1.5) points.push(crown(degrees));
  points.push(
    P(0.47, -0.13),
    P(0.44, -0.01),
    P(0.39, 0.09),
    P(0.36, -0.02),
    P(0.33, -0.14),
    P(0.31, -0.24),
    P(0.27, -0.36),
    P(0.22, -0.2),
    P(0.17, -0.37),
    P(0.105, -0.22),
    P(0.05, -0.38),
    P(0.005, -0.11),
    P(-0.045, -0.37),
    P(-0.11, -0.22),
    P(-0.17, -0.37),
    P(-0.23, -0.19),
    P(-0.28, -0.35),
    P(-0.31, -0.24),
    P(-0.33, -0.12),
    P(-0.36, 0),
    P(-0.4, 0.08),
    P(-0.44, 0),
    P(-0.47, -0.12),
  );
  return points;
})();

const FACE_OUTLINE: readonly Point[] = [
  P(-0.315, -0.42),
  P(-0.315, -0.2),
  P(-0.3, -0.06),
  P(-0.25, 0.04),
  P(-0.17, 0.13),
  P(-0.08, 0.2),
  P(0, 0.225),
  P(0.08, 0.2),
  P(0.17, 0.13),
  P(0.25, 0.04),
  P(0.3, -0.06),
  P(0.315, -0.2),
  P(0.315, -0.42),
];

/** High standing collar: rises to the jaw at the sides and dips to a closure at the front. */
const COLLAR: readonly Point[] = [
  P(-0.21, 0.25),
  P(-0.1, 0.34),
  P(0, 0.4),
  P(0.1, 0.34),
  P(0.21, 0.25),
  P(0.29, 0.47),
  P(0, 0.53),
  P(-0.29, 0.47),
];

const SHOULDERS: readonly Point[] = [
  P(-0.97, 1),
  P(-0.95, 0.9),
  P(-0.88, 0.76),
  P(-0.74, 0.64),
  P(-0.5, 0.55),
  P(-0.29, 0.47),
];

const TORSO: readonly Point[] = [...SHOULDERS, P(0, 0.53), ...SHOULDERS.map((p) => P(-p.x, p.y)).reverse()];

const HAIR_BOX = bounds(HAIR_OUTLINE);
const FACE_BOX = bounds(FACE_OUTLINE);
const TORSO_BOX = bounds(TORSO);

function inHair(x: number, y: number): boolean {
  return contains(HAIR_OUTLINE, x, y);
}

function inFace(x: number, y: number): boolean {
  return contains(FACE_OUTLINE, x, y) && !inHair(x, y);
}

/** How free a hair glyph hangs: 0 at the crown, 1 at the fringe and lock tips. */
function looseness(y: number): number {
  return clamp((y + 0.5) / 0.55, 0, 1);
}

function features(count: number): Draft[] {
  const out: Draft[] = [];
  const eyeBudget = Math.max(2, Math.round(count * 0.72));
  const perEye = Math.floor(eyeBudget / 2);
  const lid = Math.max(1, Math.round((perEye - 1) * 0.65));
  const bag = Math.max(0, perEye - 1 - lid);
  const rest = Math.max(0, count - perEye * 2);
  const mouth = Math.min(3, rest);
  const nose = Math.max(0, rest - mouth);

  for (const side of [-1, 1]) {
    for (let index = 0; index < lid; index += 1) {
      const u = lid === 1 ? 0.5 : index / (lid - 1);
      const x = side * (0.07 + 0.13 * u);
      const y = -0.15 + 0.018 * u - 0.028 * Math.sin(Math.PI * u);
      out.push(draft(x, y, { group: FEATURE, part: side < 0 ? 0 : 1, density: 3, weight: 0.95 }));
    }
    out.push(draft(side * 0.13, -0.128, { group: FEATURE, part: side < 0 ? 0 : 1, density: 4, weight: 1, size: 2 }));
    for (let index = 0; index < bag; index += 1) {
      const u = bag === 1 ? 0.5 : index / (bag - 1);
      const x = side * (0.09 + 0.09 * u);
      out.push(draft(x, -0.098 + 0.008 * Math.sin(Math.PI * u), { group: FEATURE, part: 2, density: 1, weight: 0.4, size: 0 }));
    }
  }

  for (let index = 0; index < mouth; index += 1) {
    const u = mouth === 1 ? 0.5 : index / (mouth - 1);
    out.push(draft(-0.04 + 0.08 * u, 0.103 - 0.004 * Math.sin(Math.PI * u), { group: FEATURE, part: 3, density: 2, weight: 0.8 }));
  }
  for (let index = 0; index < nose; index += 1) {
    out.push(draft(0.012 + index * 0.012, -0.03 + index * 0.028, { group: FEATURE, part: 4, density: index ? 1 : 2, weight: 0.6, size: 0 }));
  }

  return out;
}

function build(count: number, seed: number) {
  const next = random(seed);
  const cell = Math.sqrt(2.1 / count);
  const spacing = new Spacing(cell);
  const drafts: Draft[] = [];
  const [
    hairLine = 0,
    hairFill = 0,
    faceLine = 0,
    faceFill = 0,
    featureCount = 0,
    neckCount = 0,
    collarCount = 0,
    shoulderLine = 0,
    torsoFill = 0,
    seamCount = 0,
    ambientCount = 0,
  ] = allocate(count, [0.13, 0.25, 0.08, 0.045, 0.08, 0.04, 0.1, 0.07, 0.12, 0.03, 0.055]);

  for (const item of features(featureCount)) {
    drafts.push(item);
    spacing.add(item.x, item.y);
  }

  let dropped = keepSpaced(
    alongCurve(polyline(HAIR_OUTLINE, true), hairLine, (point) =>
      draft(point.x, point.y, { group: HAIR, part: OUTLINE, t: looseness(point.y), density: 4, weight: 0.92 }),
    ),
    spacing,
    cell * 0.45,
    drafts,
  );

  const jaw = alongCurve(polyline(FACE_OUTLINE.slice(1, -1)), faceLine * 4, (point) =>
    draft(point.x, point.y, { group: FACE, part: OUTLINE, density: 3, weight: 0.9 }),
  ).filter((item) => !inHair(item.x, item.y));
  dropped += keepSpaced(pickEven(jaw, faceLine), spacing, cell * 0.4, drafts);
  dropped += Math.max(0, faceLine - Math.min(faceLine, jaw.length));

  const neckLines: Draft[] = [];
  const [neckSide = 0, neckShadow = 0] = allocate(neckCount, [0.7, 0.3]);
  for (const side of [-1, 1]) {
    neckLines.push(
      ...alongCurve(
        polyline([P(side * 0.115, 0.14), P(side * 0.125, 0.36)]),
        side < 0 ? Math.floor(neckSide / 2) : Math.ceil(neckSide / 2),
        (point) => draft(point.x, point.y, { group: NECK, density: 2, weight: 0.6 }),
      ),
    );
  }
  neckLines.push(
    ...alongCurve(polyline([P(-0.07, 0.25), P(0.07, 0.25)]), neckShadow, (point) =>
      draft(point.x, point.y, { group: NECK, density: 1, weight: 0.4, size: 0 }),
    ),
  );
  dropped += keepSpaced(neckLines, spacing, cell * 0.35, drafts);

  const [collarLine = 0, collarFill = 0] = allocate(collarCount, [0.65, 0.35]);
  dropped += keepSpaced(
    alongCurve(polyline(COLLAR, true), collarLine, (point) =>
      draft(point.x, point.y, {
        group: CLOTHING,
        part: OUTLINE,
        density: point.y < 0.42 && Math.abs(point.x) < 0.22 ? 4 : 3,
        weight: 0.85,
      }),
    ),
    spacing,
    cell * 0.4,
    drafts,
  );

  const buttons = Math.min(3, Math.ceil(seamCount * 0.5));
  const seam = seamCount - buttons;
  const seamLine: Draft[] = [];
  for (let index = 0; index < buttons; index += 1) {
    seamLine.push(draft(0, 0.64 + index * 0.13, { group: CLOTHING, part: FILL, density: 5, weight: 0.7, size: 1 }));
  }
  seamLine.push(
    ...alongCurve(polyline([P(0, 0.57), P(0, 0.98)]), seam, (point) =>
      draft(point.x, point.y, { group: CLOTHING, part: FILL, density: 1, weight: 0.5, size: 0 }),
    ),
  );
  dropped += keepSpaced(seamLine, spacing, cell * 0.35, drafts);

  for (const side of [-1, 1]) {
    const line = side < 0 ? SHOULDERS : SHOULDERS.map((p) => P(-p.x, p.y));
    dropped += keepSpaced(
      alongCurve(polyline(line), side < 0 ? Math.floor(shoulderLine / 2) : Math.ceil(shoulderLine / 2), (point) =>
        draft(point.x, point.y, {
          group: CLOTHING,
          part: OUTLINE,
          density: point.y > 0.86 ? 2 : 3,
          weight: 0.75 - 0.3 * clamp((point.y - 0.5) / 0.5, 0, 1),
        }),
      ),
      spacing,
      cell * 0.4,
      drafts,
    );
  }

  drafts.push(
    ...fillRegion(hairFill + dropped, spacing, () =>
      propose(next, 40, (rand) => {
        const x = HAIR_BOX.left + rand() * (HAIR_BOX.right - HAIR_BOX.left);
        const y = HAIR_BOX.top + rand() * (HAIR_BOX.bottom - HAIR_BOX.top);
        if (!inHair(x, y)) return null;
        const angle = Math.atan2(y - HEAD.y, x - HEAD.x);
        const strand = Math.sin(angle * 15 + Math.hypot(x - HEAD.x, y - HEAD.y) * 9);
        const density = y > -0.4 ? 3 : strand > 0.35 ? 4 : 3;
        return draft(x, y, { group: HAIR, part: FILL, t: looseness(y), density, weight: 0.62 });
      }),
    ),
  );

  drafts.push(
    ...fillRegion(faceFill, spacing, () =>
      propose(next, 40, (rand) => {
        const x = FACE_BOX.left + rand() * (FACE_BOX.right - FACE_BOX.left);
        const y = FACE_BOX.top + rand() * (FACE_BOX.bottom - FACE_BOX.top);
        if (!inFace(x, y)) return null;
        return draft(x, y, { group: FACE, part: FILL, density: 1, weight: 0.3, size: 0 });
      }),
    ),
  );

  drafts.push(
    ...fillRegion(collarFill, spacing, () =>
      propose(next, 40, (rand) => {
        const x = -0.29 + rand() * 0.58;
        const y = 0.25 + rand() * 0.28;
        if (!contains(COLLAR, x, y)) return null;
        return draft(x, y, { group: CLOTHING, part: FILL, density: 2, weight: 0.6 });
      }),
    ),
  );

  drafts.push(
    ...fillRegion(torsoFill, spacing, () =>
      propose(next, 40, (rand) => {
        const x = TORSO_BOX.left + rand() * (TORSO_BOX.right - TORSO_BOX.left);
        const y = TORSO_BOX.top + rand() * (TORSO_BOX.bottom - TORSO_BOX.top);
        if (!contains(TORSO, x, y) || contains(COLLAR, x, y)) return null;
        if (rand() < 0.6 * clamp((y - 0.5) / 0.5, 0, 1)) return null;
        return draft(x, y, { group: CLOTHING, part: FILL, density: y < 0.72 ? 2 : 1, weight: 0.35 });
      }),
    ),
  );

  drafts.push(
    ...fillRegion(ambientCount, spacing, () =>
      propose(next, 40, (rand) => {
        const x = (rand() * 2 - 1) * 0.98;
        const y = -1.1 + rand() * 2.05;
        if ((x / 0.98) ** 2 + ((y + 0.05) / 1.05) ** 2 > 1) return null;
        if (inHair(x, y) || contains(FACE_OUTLINE, x, y) || contains(TORSO, x, y) || contains(COLLAR, x, y)) return null;
        return draft(x, y, { group: AMBIENT, density: 1, weight: 0.03, size: 0 });
      }),
    ),
  );

  return finalize(drafts, count, next);
}

export const yuta: MotifDefinition = {
  type: "yuta",
  sheet: false,
  build,
  animate(anchor, frame, phase, out) {
    const time = frame.time;
    const m = HERO_FIELD_CONFIG.motion.yuta;
    const late = anchor.group === HAIR ? time - m.hairLag : time;
    const gain = anchor.group === HAIR ? m.hairGain : 1;
    let dx = Math.sin(late * m.driftSpeed) * m.drift * gain;
    let dy = Math.sin(late * m.driftSpeed * 0.73 + 1.3) * m.drift * 0.8 * gain;

    if (anchor.group === HAIR) {
      dx += Math.sin(time * 0.8 + anchor.y * 5 + phase * 0.3) * m.strand * anchor.t;
      if (anchor.part === OUTLINE) {
        dx += Math.sin(time * 1.4 + phase) * m.edgeNoise;
        dy += Math.cos(time * 1.2 + phase * 1.3) * m.edgeNoise;
      }
    } else if (anchor.group === FEATURE && anchor.part < 2) {
      out.alpha = 1 + m.pulse * Math.pow(Math.max(0, Math.sin(time * 0.45 + anchor.part * 0.4)), 10);
    } else if (anchor.group === AMBIENT) {
      const away = Math.pow(Math.max(0, Math.sin(time * 0.29 + phase * 2)), 3);
      dx += anchor.x * 0.1 * away;
      dy += anchor.y * 0.06 * away;
      out.alpha = 1 - 0.5 * away;
    }

    // A slow reconstruction band sweeps down the portrait, briefly thickening what it passes.
    const scan = -1.3 + fract(time / m.scanPeriod) * 4;
    const band = 1 - Math.abs(anchor.y - scan) / m.scanWidth;
    if (band > 0) {
      out.density += band;
      out.alpha *= 1 + 0.2 * band;
    }

    out.dx = dx;
    out.dy = dy;
  },
};
