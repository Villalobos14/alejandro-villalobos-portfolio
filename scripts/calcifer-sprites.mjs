/*
 * Calcifer's animation sheets. Run `node scripts/calcifer-sprites.mjs` to
 * rewrite public/pets/calcifer-world.png and calcifer-glyph.png, with 6x
 * review copies in design/calcifer/.
 *
 * Every frame is the approved neutral (scripts/calcifer-model.mjs) drawn in
 * a pose, never redrawn, so he cannot drift off-model. The motion follows the
 * principles taken from design/calcifer/fire.json:
 *   - the base and the face hold still; the spire moves most, the side
 *     flames a beat behind it, the inner colours less than the shell
 *   - poses change about eight times a second and are held unevenly, along
 *     a path that never simply mirrors itself
 *   - elastic moments gather, release fast and settle slower, with one
 *     overshoot
 *   - when he comes apart, a few clusters of his own colours drift out and
 *     cut out; nothing fades, glows or sparkles
 *
 * Frames face right and stand on the anchor. The row order and frame counts
 * are mirrored in src/components/pet-world/world/sprites.ts, which also holds
 * the timing (repeated frames are holds); keep the two in step.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GLYPH, PALETTE, WORLD, blank, drawCalcifer } from "./calcifer-model.mjs";
import { encodePng, renderSheet, upscale } from "./lib/png.mjs";

/*
 * Cells larger than the neutral's frame leave room to stretch, squash and
 * scatter; the character inside is drawn at exactly the approved size.
 */
const WORLD_CELL = { ...WORLD, canvas: [52, 56] };
const GLYPH_CELL = { ...GLYPH, canvas: [40, 40] };

const world = (pose) => drawCalcifer(WORLD_CELL, pose);
const glyph = (pose) => drawCalcifer(GLYPH_CELL, pose);

/* ======================================================================
 * World Calcifer
 * ==================================================================== */

/*
 * The living flame: ten poses along an uneven path. The spire leans up-left,
 * the body gives a little, the right flame grows, the spire reaches, the
 * right flame dies down (a flick breaks off), the body breathes out, the left
 * side answers, the spire drops back, and a last variation with a glance.
 */
const IDLE = [
  {},
  { tip: [-1, 1], lobes: [[0, 0, 0], [-1, 1, 0.25]] },
  { tip: [-1, 0], breathe: [0, -1], lobes: [[0, -1, 0], [-1, 0, 0.2]], zones: { orange: [-1, 0] } },
  { tip: [0, 0], lobes: [[1, 2, 0.25], [0, 0, 0]], zones: { orange: [-1, 0] } },
  { tip: [1, 3], lobes: [[1, 1, 0.15], [0, 0, 0]], zones: { orange: [0, 1] } },
  { tip: [1, 2], lobes: [[0, -1, -0.45], [0, 0, 0]], zones: { orange: [1, 1] }, sparks: [[9, 40, "R"]] },
  { tip: [0, 1], breathe: [1, 1], lobes: [[0, 0, -0.2], [0, 0, 0]], zones: { orange: [1, 0], yellow: [0, 1] } },
  { tip: [-1, 1], breathe: [1, 0], lobes: [[0, 0, 0], [-1, 2, 0.4]], tongues: [[-8, 2, -1]] },
  { tip: [0, -1], lobes: [[0, 1, 0.1], [-1, 1, 0.2]], zones: { orange: [-1, 0] } },
  { tip: [1, 0], lobes: [[1, 0, 0.1], [0, 0, 0]], zones: { orange: [1, 0], yellow: [1, 0] }, face: { pupil: [1, 0] } },
];

/** Glances right, leaning into it a little; the flame keeps moving. Mirrored to look left. */
const LOOK = [
  { lean: 1, tip: [1, 1], face: { pupil: [2, 0] } },
  { lean: 1, tip: [1, 2], lobes: [[1, 1, 0.15], [0, 0, 0]], face: { pupil: [2, 0] } },
  { lean: 1, tip: [2, 1], zones: { orange: [1, 0] }, face: { pupil: [2, 0] } },
  { lean: 1, tip: [1, 0], breathe: [1, 0], lobes: [[0, -1, -0.2], [-1, 1, 0.2]], face: { pupil: [2, 0] } },
  { lean: 1, tip: [1, 2], face: { pupil: [2, -1] } },
  { lean: 1, tip: [2, 1], lobes: [[1, 1, 0.1], [0, 0, 0]], face: { pupil: [2, -1] } },
];

/*
 * A flame's scoot, not a walk: gather, spring up leaning forward with the
 * spire trailing, touch down, squash, recover. Code moves him along; the
 * sheet only bobs.
 */
const MOVE = [
  { squash: [1.08, 0.9], tip: [-1, -1] },
  { offset: [0, 2], squash: [0.94, 1.06], lean: 1, tip: [-2, 1] },
  { offset: [0, 4], squash: [0.92, 1.08], lean: 1, tip: [-2, 2], lobes: [[-1, 1, 0], [-1, 1, 0]] },
  { offset: [0, 3], squash: [0.96, 1.04], lean: 2, tip: [-3, 1] },
  { offset: [0, 1], lean: 1, tip: [-2, 0] },
  { squash: [1.1, 0.88], tip: [-1, -1], lobes: [[1, -1, 0.1], [-1, -1, 0.1]] },
  { squash: [1.03, 0.97], tip: [0, 0] },
  { tip: [1, 1], lobes: [[1, 0, 0.1], [0, 0, 0]] },
];

/** Startled: eyes wide, the flame shoots up and stretches, then he settles back with a small squash. */
const REACT = [
  { squash: [0.94, 1.08], tip: [0, 3], tongues: [[-5, 2, -1], [6, 2, 1]], face: { eyes: "wide" } },
  { squash: [0.9, 1.12], tip: [0, 4], lobes: [[1, 2, 0.25], [-1, 2, 0.3]], face: { eyes: "wide", mouth: "oh" } },
  { squash: [0.92, 1.1], tip: [1, 3], lobes: [[1, 1, 0.15], [-1, 1, 0.2]], face: { eyes: "wide", mouth: "oh" } },
  { squash: [1.06, 0.92], tip: [0, 0], face: { mouth: "small" } },
  { squash: [1.1, 0.88], tip: [0, -1], face: { eyes: "squeezed", mouth: "small" } },
  { tip: [0, 1] },
];

/** Settled on the surface: a lower flame on a wider body, lids half down, the smallest mouth. */
const resting = (pose) => ({
  squash: [1.06, 0.92],
  ...pose,
  tip: [pose.tip?.[0] ?? 0, -2 + (pose.tip?.[1] ?? 0)],
  face: { eyes: "lidded", mouth: "small" },
});
const REST = [
  {},
  { tip: [-1, 1] },
  { tip: [0, 1], breathe: [1, 0], lobes: [[0, -1, -0.1], [0, 0, 0]] },
  { tip: [1, 0], breathe: [1, 1] },
  { tip: [1, 1], zones: { orange: [1, 0] } },
  { tip: [0, 0], lobes: [[0, 0, 0], [-1, 0, 0.2]] },
].map(resting);

/** Asleep: lower and rounder still, eyes shut, one slow breath across the loop. Never goes out. */
const sleeping = (pose) => ({
  squash: [1.1, 0.86],
  ...pose,
  tip: [pose.tip?.[0] ?? 0, -3 + (pose.tip?.[1] ?? 0)],
  face: { eyes: "closed", mouth: "small" },
});
const SLEEP = [
  {},
  { tip: [-1, 1] },
  { breathe: [1, 1] },
  { breathe: [1, 1], tip: [0, 1] },
  { breathe: [0, 1], tip: [1, 1] },
  { tip: [1, 0] },
  { breathe: [0, -1] },
  { lobes: [[0, 0, 0], [-1, 0, 0.2]] },
].map(sleeping);

/*
 * Materialising: a few warm pixels, a small core of yellow and orange, the
 * red shell gathering round it in pieces, the eyes finding themselves, then
 * the whole of him, stretched as he drops onto the surface. The last two
 * frames are already flickering poses, not the neutral.
 */
const CORE = 0.72;
const TELEPORT_IN = [
  world({ body: false, sparks: [[-6, 21, "O"], [6, 27, "Y"], [1, 14, "R"]] }),
  world({ face: null, squash: [0.18, 0.22], pivot: CORE, remap: { R: "O", O: "Y", o: "Y" }, sparks: [[-5, 19, "R"], [5, 23, "O"]] }),
  world({ face: null, squash: [0.36, 0.42], pivot: CORE, remap: { R: "O" }, sparks: [[-9, 22, "R"], [8, 26, "O"]] }),
  world({ face: null, squash: [0.58, 0.64], pivot: CORE, erode: 0.45, seed: 3, sparks: [[10, 30, "R"]] }),
  world({ face: { eyes: "faint", mouth: null }, squash: [0.8, 0.84], pivot: 0.78, erode: 0.15, seed: 5, tip: [0, 1] }),
  world({ face: { eyes: "blank", mouth: "small" }, squash: [0.92, 0.96], pivot: 0.88, tip: [-1, 1] }),
  world({ squash: [0.94, 1.08], tip: [1, 2], lobes: [[0, 1, 0.1], [0, 0, 0]] }),
  world({ squash: [0.97, 1.04], tip: [0, 1], lobes: [[1, 1, 0.1], [-1, 0, 0.2]] }),
];

/*
 * The landing: contact, the deepest squash at once (wide, low, eyes pressed),
 * then a slower recovery through a small stretch back to his height.
 */
const LAND = [
  { squash: [1.1, 0.88], tip: [0, -1], lobes: [[1, -1, 0.1], [-1, -1, 0.1]] },
  { squash: [1.22, 0.78], tip: [0, -2], lobes: [[2, -2, 0.15], [-2, -1, 0.2]], face: { eyes: "squeezed", mouth: "wide" } },
  { squash: [1.12, 0.88], tip: [0, -1], lobes: [[1, -1, 0.1], [-1, 0, 0.1]], face: { eyes: "squeezed" } },
  { squash: [0.98, 1.02], tip: [0, 1] },
  { squash: [0.94, 1.08], tip: [0, 2], lobes: [[0, 1, 0], [0, 1, 0]] },
  { squash: [1.02, 0.98], tip: [-1, 0] },
];

/*
 * Leaving: he gathers, stretches up once, and loses cohesion. The shell
 * breaks into clusters that drift out while the core shrinks and the face
 * goes, the body narrows to a small flame, and only a few pixels are left.
 */
const TELEPORT_OUT = [
  world({ squash: [1.12, 0.84], face: { eyes: "squeezed" } }),
  world({ squash: [0.86, 1.12], tip: [0, 3], face: { mouth: "small" } }),
  world({
    squash: [0.8, 0.9],
    pivot: CORE,
    erode: 0.5,
    seed: 7,
    face: { eyes: "blank", mouth: null },
    sparks: [[-15, 30, "R", 2, 2], [14, 33, "R", 2, 2], [-13, 12, "O", 2, 1], [16, 17, "R", 1, 2]],
  }),
  world({
    squash: [0.6, 0.66],
    pivot: CORE,
    erode: 0.6,
    seed: 9,
    zones: { scale: 0.8 },
    face: { eyes: "faint", mouth: null },
    sparks: [[-17, 33, "R", 2, 1], [16, 36, "R", 1, 2], [-15, 10, "O"], [18, 15, "O", 1, 1], [-3, 37, "R"]],
  }),
  world({
    squash: [0.38, 0.46],
    pivot: CORE,
    face: null,
    sparks: [[-18, 35, "R"], [17, 38, "O"], [-17, 9, "O"], [19, 13, "R"], [-2, 40, "Y"]],
  }),
  world({
    squash: [0.18, 0.32],
    pivot: CORE,
    face: null,
    remap: { o: "Y" },
    sparks: [[-19, 37, "O"], [18, 40, "R"], [20, 12, "O"], [-1, 42, "Y"]],
  }),
  world({ body: false, sparks: [[-20, 38, "O"], [19, 41, "R"], [-1, 44, "Y"]] }),
  blank(WORLD_CELL.canvas),
];

const WORLD_ROWS = [
  ["teleportIn", TELEPORT_IN],
  ["land", LAND.map(world)],
  ["idle", IDLE.map(world)],
  ["look", LOOK.map(world)],
  ["walk", MOVE.map(world)],
  ["react", REACT.map(world)],
  ["sit", REST.map(world)],
  ["sleep", SLEEP.map(world)],
  ["teleportOut", TELEPORT_OUT],
];

/* ======================================================================
 * Glyph Calcifer: the same, quieter, and never mirrored inside the word
 * ==================================================================== */

/** About a pixel of movement anywhere, the base and the face fixed. */
const GLYPH_IDLE = [
  {},
  { tip: [-1, 0], lobes: [[0, 0, 0], [0, 0, 0.2]] },
  { tip: [-1, 1], zones: { orange: [-1, 0] } },
  { tip: [0, 1], lobes: [[0, 0, 0.15], [0, 0, 0]] },
  { tip: [1, 0], breathe: [0, 1] },
  { tip: [1, 0], breathe: [1, 0], zones: { orange: [1, 0] } },
  { tip: [0, 0], lobes: [[0, 0, -0.2], [0, 0, 0.15]], zones: { yellow: [0, 1] } },
  { tip: [0, 1], zones: { orange: [1, 0] }, face: { pupil: [1, 0] } },
];

/** Three frames looking right, then three looking left, so the letter never flips. */
const GLYPH_LOOK = [
  { tip: [0, 0], face: { pupil: [1, 0] } },
  { tip: [1, 1], face: { pupil: [1, 0] } },
  { tip: [1, 0], lobes: [[0, 0, 0.15], [0, 0, 0]], face: { pupil: [1, 0] } },
  { tip: [0, 0], face: { pupil: [-1, 0] } },
  { tip: [-1, 1], face: { pupil: [-1, 0] } },
  { tip: [-1, 0], lobes: [[0, 0, 0], [0, 0, 0.2]], face: { pupil: [-1, 0] } },
];

/** He realises he can leave: a glance each way, eyes wide for a beat, then he gathers himself. */
const GLYPH_PREPARE = [
  { tip: [0, 1] },
  { tip: [-1, 0], face: { pupil: [-1, 0] } },
  { tip: [1, 1], face: { pupil: [1, 0] } },
  { tip: [0, 1], face: { eyes: "wide" } },
  { squash: [1.06, 0.92], tip: [0, 0] },
  { squash: [1.12, 0.84], tip: [0, -1], face: { eyes: "squeezed" } },
];

const GLYPH_OUT = [
  glyph({ squash: [1.14, 0.82], face: { eyes: "squeezed" } }),
  glyph({ squash: [0.86, 1.12], tip: [0, 2], face: { mouth: "small" } }),
  glyph({
    squash: [0.8, 0.9],
    pivot: CORE,
    erode: 0.5,
    seed: 7,
    face: { eyes: "blank", mouth: null },
    sparks: [[-11, 22, "R", 2, 2], [10, 24, "R", 1, 2], [-10, 8, "O"], [12, 12, "R"]],
  }),
  glyph({
    squash: [0.6, 0.66],
    pivot: CORE,
    erode: 0.6,
    seed: 9,
    zones: { scale: 0.8 },
    face: { eyes: "faint", mouth: null },
    sparks: [[-13, 24, "R"], [12, 26, "R", 1, 2], [-12, 7, "O"], [14, 11, "O"], [-2, 27, "R"]],
  }),
  glyph({
    squash: [0.38, 0.46],
    pivot: CORE,
    face: null,
    sparks: [[-14, 26, "R"], [13, 28, "O"], [-13, 6, "O"], [15, 10, "R"], [-1, 30, "Y"]],
  }),
  glyph({
    squash: [0.18, 0.32],
    pivot: CORE,
    face: null,
    remap: { o: "Y" },
    sparks: [[-15, 27, "O"], [14, 30, "R"], [16, 9, "O"], [0, 31, "Y"]],
  }),
  glyph({ body: false, sparks: [[-16, 28, "O"], [15, 31, "R"], [0, 33, "Y"]] }),
  blank(GLYPH_CELL.canvas),
];

const GLYPH_ROWS = [
  ["idle", GLYPH_IDLE.map(glyph)],
  ["look", GLYPH_LOOK.map(glyph)],
  ["prepare", GLYPH_PREPARE.map(glyph)],
  ["teleportOut", GLYPH_OUT],
];

/* ---------- write ---------- */

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PETS = join(root, "public", "pets");
const DESIGN = join(root, "design", "calcifer");
mkdirSync(PETS, { recursive: true });
mkdirSync(DESIGN, { recursive: true });

/** Review copy: enlarged, on a dark ground, with the cells outlined and the anchor marked. */
function review(sheet, [cellWidth, cellHeight], factor, anchorY) {
  const large = upscale(sheet, factor);
  const { width, height, rgba } = large;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const edge = x % (cellWidth * factor) === 0 || y % (cellHeight * factor) === 0;
      const ground = Math.floor(y / factor) % cellHeight === anchorY && y % factor === 0;
      if (rgba[offset + 3] === 0) {
        const shade = edge ? 70 : ground ? 48 : 24;
        rgba.set([shade, shade, shade + 4, 255], offset);
      }
    }
  }
  return large;
}

function write(name, rows, cell, anchorY) {
  const sheet = renderSheet(
    rows.map(([, frames]) => frames),
    ...cell,
    PALETTE,
  );
  writeFileSync(join(PETS, `${name}.png`), encodePng(sheet.width, sheet.height, sheet.rgba));
  const large = review(sheet, cell, 6, anchorY);
  writeFileSync(join(DESIGN, `${name}-sheet@6x.png`), encodePng(large.width, large.height, large.rgba));
  console.log(`public/pets/${name}.png  ${sheet.width}x${sheet.height}, cells ${cell.join("x")}`);
  rows.forEach(([label, frames], index) => console.log(`  row ${index}  ${label.padEnd(12)} ${frames.length} frames`));
}

write("calcifer-world", WORLD_ROWS, WORLD_CELL.canvas, 54);
write("calcifer-glyph", GLYPH_ROWS, GLYPH_CELL.canvas, 38);
