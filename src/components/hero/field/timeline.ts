import { HERO_FIELD_CONFIG as CONFIG } from "./config";
import { lerp, smootherstep } from "./math";
import type { FrameEnv, Organism } from "./organism";
import { samplePath, type PathPoint } from "./paths";

const ahead: PathPoint = { x: 0, y: 0, tx: 0, ty: 0, depth: 0, slope: 0 };
const FASTEST = Math.max(...Object.values(CONFIG.travel.motifs).map((travel) => travel.speed));

function inView(x: number, y: number, radius: number, env: FrameEnv): boolean {
  const inset = radius * CONFIG.morph.inset;
  return x > inset && x < env.width - inset && y > inset && y < env.height - inset;
}

/**
 * A creature only transforms where it can be watched doing it: in view now
 * and still in view when the morph ends, and never while another creature is
 * transforming, so the hero never reads as switching state.
 */
function canMorph(o: Organism, env: FrameEnv, all: readonly Organism[]): boolean {
  for (const other of all) if (other !== o && other.progress >= 0) return false;
  if (!inView(o.cx, o.cy, o.radius, env)) return false;
  const path = o.paths[o.path];
  if (!path) return false;
  const along = o.along + (env.timing.morph[1] * FASTEST) / path.config.duration;
  if (along >= 1) return false;
  samplePath(path, along, ahead);
  return inView(ahead.x, ahead.y, o.radius, env);
}

/** Holds, then morphs into the next motif of the sequence, on the organism's own clock. */
export function stepTimeline(o: Organism, env: FrameEnv, all: readonly Organism[]): void {
  if (o.still) return;
  o.clock += env.dt;

  if (o.progress < 0) {
    if (o.clock >= o.hold && canMorph(o, env, all)) {
      o.next = (o.current + 1) % o.shapes.length;
      o.progress = 0;
      o.morphLength = lerp(env.timing.morph[0], env.timing.morph[1], o.rng());
      // Swirl the matter the same way the body is about to turn as it starts or stops facing its path.
      const motifs = CONFIG.travel.motifs;
      const facing = motifs[o.motifs[o.next]?.type ?? "manta"].heading - motifs[o.motifs[o.current]?.type ?? "manta"].heading;
      o.swirl = facing * (o.heading - o.spinBase) < 0 ? -1 : 1;
    }
  } else {
    o.progress += env.dt / o.morphLength;
    if (o.progress >= 1) {
      o.current = o.next;
      o.progress = -1;
      o.clock = 0;
      o.hold = lerp(env.timing.hold[0], env.timing.hold[1], o.rng());
    }
  }

  o.blend = o.progress < 0 ? 0 : smootherstep(0.1, 0.9, o.progress);
}
