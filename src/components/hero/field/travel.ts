import { HERO_FIELD_CONFIG as CONFIG } from "./config";
import { clamp, lerp, TAU, wrapAngle } from "./math";
import { bellPulse } from "./motifs/jelly";
import type { FrameEnv, Organism } from "./organism";
import { fitPath, mapY, samplePath, type PathPoint, type VerticalMap } from "./paths";
import { depthDetail, depthScale, fontAt, poseMatrix, type Pose } from "./space";

/** Reads a near / far pair at depth `z`. */
function byDepth(values: readonly number[], z: number): number {
  const k = clamp(z, 0, 1) * (values.length - 1);
  const index = Math.min(values.length - 2, Math.floor(k));
  return lerp(values[index] ?? 1, values[index + 1] ?? 1, k - index);
}

const DEG = Math.PI / 180;

type Travel = (typeof CONFIG.travel.motifs)[keyof typeof CONFIG.travel.motifs];

const point: PathPoint = { x: 0, y: 0, tx: 0, ty: 0, depth: 0, slope: 0 };
const sourcePose: Pose = { spin: 0, tiltX: 0, tiltY: 0 };
const targetPose: Pose = { spin: 0, tiltX: 0, tiltY: 0 };

/** Glyph size follows the spacing of what is drawn, so denser creatures get a finer grain; distance makes it finer still. */
function updateFonts(o: Organism): void {
  const f = CONFIG.font;
  const spacing = o.radius * Math.sqrt(f.area / Math.max(24, o.drawn));
  const size = clamp(f.fill * spacing * byDepth(f.depth, o.depth), f.min, f.max);
  const key = Math.round(size * 4);
  if (key === o.fontKey) return;
  o.fontKey = key;
  const relief = CONFIG.relief.size;
  f.buckets.forEach((bucket, index) => {
    for (let near = 0; near < 3; near += 1) o.fonts[index * 3 + near] = fontAt(size * bucket * (1 + relief * (near - 1)));
  });
}

/** Fits the organism's paths to the hero, or puts it at its still pose under reduced motion. */
export function fitOrganism(
  o: Organism,
  width: number,
  height: number,
  map: VerticalMap,
  base: number,
  reduced: boolean,
): void {
  o.base = base * o.entity.scale;
  // Positions jump with the hero's size; take the new bearing without turning toward it.
  o.oriented = false;
  for (const path of o.paths) {
    const nearest = Math.min(...path.config.depth);
    fitPath(path, width, height, map, o.base * depthScale(nearest) * CONFIG.offscreen + 12);
  }

  const still = o.entity.still;
  if (!reduced || !still) return;
  o.still = true;
  o.current = still.motif % o.shapes.length;
  o.next = o.current;
  o.cx = still.x * width;
  o.cy = mapY(map, still.y) * height;
  o.depth = still.depth;
  o.detail = depthDetail(o.depth);
  o.radius = o.base * depthScale(o.depth);
  o.pose.spin = still.spin * DEG;
  o.pose.tiltX = still.tiltX * DEG;
  o.pose.tiltY = still.tiltY * DEG;
  o.visible = true;
  poseMatrix(o.pose, o.matrix);
  updateFonts(o);
}

/**
 * Where the camera sees this creature from: −1 below, 0 level, 1 above. The
 * eye sits level with the middle of the headline, so a creature low in the
 * hero is seen from above and one high up from below, the way animals pass
 * an aquarium window. Each path biases it, and it wanders slowly.
 */
function elevation(o: Organism, env: FrameEnv, bias: number, time: number): number {
  const c = CONFIG.camera;
  const height = env.height > 0 ? o.cy / env.height : env.horizon;
  const v = bias + c.elevation * (height - env.horizon) + c.wander * Math.sin(time * c.wanderSpeed + o.offset);
  return clamp(v, c.range[0], c.range[1]);
}

/**
 * How a motif would hold itself right now. A swimmer faces along its path and
 * rolls so its back stays up: seen from above it shows its back, level with
 * the eye its side, from below its belly. It banks into turns and noses down
 * as it heads deeper. A drifter stays upright, leans into its drift and tips
 * its axis toward or away from the camera.
 */
function poseOf(travel: Travel, o: Organism, view: number, time: number, rotation: number, out: Pose): void {
  const [spin, tiltX, tiltY] = travel.rest;
  // Which way the back has to roll to stay up; it fades out when swimming straight up or down.
  const side = clamp(Math.sin(o.heading) * 2, -1, 1);
  const roll = Math.min(CONFIG.camera.rollMax, (1 - view) * (Math.PI / 2)) * travel.view.roll * side;
  const stroke = Math.sin((time * TAU) / CONFIG.motion.manta.flapPeriod + 0.4);
  out.spin =
    lerp(o.spinBase, o.heading, travel.heading) +
    travel.lean * Math.asin(Math.sin(o.heading)) +
    spin +
    travel.sway[0] * Math.sin(time * travel.swaySpeed[0] + 0.7) * rotation;
  out.tiltX =
    tiltX +
    (clamp(-o.slope * travel.climb, -travel.climbMax, travel.climbMax) +
      view * travel.view.tilt +
      travel.sway[1] * Math.sin(time * travel.swaySpeed[1] + 2.1)) *
      rotation;
  out.tiltY =
    tiltY +
    (roll +
      clamp(o.turn * travel.bank, -travel.bankMax, travel.bankMax) +
      travel.flapRoll * stroke +
      travel.sway[2] * Math.sin(time * travel.swaySpeed[2] + 4.2)) *
      rotation;
}

/** Pace multiplier: a jellyfish surges just after each contraction and coasts in between. */
function surge(travel: Travel, time: number): number {
  return travel.surge > 0 ? 1 + travel.surge * (2 * bellPulse(time - 0.3) - 1) : 1;
}

/**
 * Picks the path after the one just finished. Paths are visited in order, but
 * a crossing of the headline is skipped while another creature holds the
 * centre, so there is never more than one protagonist.
 */
function nextPath(o: Organism, all: readonly Organism[]): number {
  const total = o.paths.length;
  for (let step = 1; step <= total; step += 1) {
    const index = (o.path + step) % total;
    if (!o.paths[index]?.config.center) return index;
    let taken = false;
    for (const other of all) if (other !== o && other.paths[other.path]?.config.center) taken = true;
    if (!taken) return index;
  }
  return (o.path + 1) % total;
}

/**
 * Moves the organism along its path, at a pace and with a bearing blended
 * between the motif it is and the one it is becoming, so it never stops to
 * transform.
 */
export function stepTravel(o: Organism, env: FrameEnv, all: readonly Organism[]): void {
  if (o.still) return;
  const motifs = CONFIG.travel.motifs;
  const source = motifs[o.motifs[o.current]?.type ?? "manta"];
  const target = motifs[o.motifs[o.next]?.type ?? "manta"];
  const w = o.blend;
  const time = env.time + o.offset;

  const before = o.paths[o.path];
  if (!before) return;
  // Unseen stretches between crossings pass quickly; `seen` is from the previous frame.
  const unseen = o.oriented && !o.seen ? CONFIG.travel.offscreenPace : 1;
  const pace = lerp(source.speed * surge(source, time), target.speed * surge(target, time), w);
  o.along += (env.dt * unseen * pace) / before.config.duration;
  let switched = !o.oriented;
  if (o.along >= 1) {
    // The path ended offscreen; the next one starts offscreen on the same side.
    o.along -= 1;
    o.path = nextPath(o, all);
    switched = true;
  }
  const path = o.paths[o.path] ?? before;
  samplePath(path, o.along, point);

  const bobY = lerp(source.bob.y * Math.sin(time * source.bob.speed), target.bob.y * Math.sin(time * target.bob.speed), w);
  const bobZ = lerp(
    source.bob.z * Math.sin(time * source.bob.speed * 0.71 + 1.3),
    target.bob.z * Math.sin(time * target.bob.speed * 0.71 + 1.3),
    w,
  );
  o.depth = clamp(point.depth + bobZ, 0, 1);
  o.detail = depthDetail(o.depth);
  o.slope = point.slope;
  o.radius = o.base * depthScale(o.depth);
  const x = point.x;
  const y = point.y + bobY * o.radius;

  if (switched || env.dt <= 0) {
    o.vx = 0;
    o.vy = 0;
    o.lagX = 0;
    o.lagY = 0;
  } else {
    const k = 1 - Math.exp(-env.dt * 3);
    o.vx += ((x - o.cx) / env.dt - o.vx) * k;
    o.vy += ((y - o.cy) / env.dt - o.vy) * k;
    const settle = 1 - Math.exp(-env.dt * lerp(source.inertia, target.inertia, w));
    o.lagX += (o.vx - o.lagX) * settle;
    o.lagY += (o.vy - o.lagY) * settle;
  }
  o.cx = x;
  o.cy = y;
  o.pace = Math.hypot(o.vx, o.vy) / Math.max(1, o.radius);

  const bearing = Math.atan2(point.tx, -point.ty);
  if (switched) {
    o.heading += wrapAngle(bearing - o.heading);
    o.turn = 0;
    o.oriented = true;
  } else {
    const step = wrapAngle(bearing - o.heading) * (1 - Math.exp(-env.dt * lerp(source.follow, target.follow, w)));
    o.heading += step;
    const rate = env.dt > 0 ? step / env.dt : 0;
    o.turn += (rate - o.turn) * (1 - Math.exp(-env.dt * CONFIG.travel.turnSmooth));
  }
  if (o.progress < 0) o.spinBase = TAU * Math.round(o.heading / TAU);

  const view = elevation(o, env, path.config.view, time);
  poseOf(source, o, view, time, env.rotation, sourcePose);
  poseOf(target, o, view, time, env.rotation, targetPose);
  o.pose.spin = lerp(sourcePose.spin, targetPose.spin, w);
  o.pose.tiltX = lerp(sourcePose.tiltX, targetPose.tiltX, w);
  o.pose.tiltY = lerp(sourcePose.tiltY, targetPose.tiltY, w);
  poseMatrix(o.pose, o.matrix);
  updateFonts(o);

  const reach = o.radius * 1.6;
  o.visible = o.cx + reach > 0 && o.cx - reach < env.width && o.cy + reach > 0 && o.cy - reach < env.height;
}
